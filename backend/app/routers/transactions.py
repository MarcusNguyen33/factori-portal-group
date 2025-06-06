from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from sqlalchemy.exc import IntegrityError
from sqlalchemy import desc

from ..db import get_session
from ..models import (
    Inventory,
    InventoryCreate,
    InventoryTransaction,
    InventoryTransactionAttemptCreate,
    InventoryTransactionCreate,
    InventoryTransactionItemLocationSupplier,
    Items,
    Locations,
    Suppliers,
)

router = APIRouter()


@router.get("/", response_model=List[InventoryTransactionItemLocationSupplier])
async def read_transactions_endpoint(db: Session = Depends(get_session)):
    # statement = select(InventoryTransaction)
    statement = (
        select(InventoryTransaction, Items, Locations, Suppliers)
        .join(Items, InventoryTransaction.item_id == Items.item_id)
        .join(Locations, InventoryTransaction.location_id == Locations.location_id)
        .outerjoin(Suppliers, InventoryTransaction.supplier_id == Suppliers.supplier_id)
        .order_by(
            desc(InventoryTransaction.transaction_date),
            Items.item_name,
            Locations.location_name,
        )
    )
    data = db.exec(statement).all()

    response = []
    for record in data:
        trans, item, location, supplier = record
        response.append(
            InventoryTransactionItemLocationSupplier(
                transaction=trans, item=item, location=location, supplier=supplier
            )
        )

    return response


@router.get("/itemloc/{location_id}", response_model=InventoryTransaction)
async def get_transactions_for_item_at_loc(
    item_id: int, location_id: int, db: Session = Depends(get_session)
):
    statement = select(InventoryTransaction).where(
        InventoryTransaction.item_id == item_id
        and InventoryTransaction.location_id == location_id
    )
    data = db.exec(statement).all()

    return data


@router.post("/", response_model=InventoryTransaction)
async def add_transaction_endpoint(
    transaction: InventoryTransactionAttemptCreate, db: Session = Depends(get_session)
):
    try:

        item_statement = select(Items).where(Items.item_name == transaction.item_name)
        item = db.exec(item_statement).first()
        if item is None:
            raise Exception("No matching item!")

        location_statement = select(Locations).where(
            Locations.location_name == transaction.location_name
        )
        location = db.exec(location_statement).first()
        if location is None:
            raise Exception("No matching location!")

        supplier_statement = select(Suppliers).where(
            Suppliers.supplier_name == transaction.supplier_name
        )
        supplier = db.exec(supplier_statement).first()

        new_transaction = InventoryTransactionCreate(
            item_id=item.item_id,
            location_id=location.location_id,
            quantity=transaction.quantity,
            transaction_description=transaction.transaction_description,
            transaction_date=transaction.transaction_date,
            supplier_id=supplier.supplier_id if supplier is not None else None,
        )

        created_transaction = InventoryTransaction(**new_transaction.model_dump())
        await add_and_commit_transaction_to_db(created_transaction, db)
        # db.add(created_transaction)
        # db.commit()
        # db.refresh(created_transaction)
        return created_transaction

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database Error: {str(e.orig)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


async def find_matching_inventory_row_to_transaction(
    transaction: InventoryTransaction, db: Session = Depends(get_session)
):
    statement = (
        select(Inventory)
        .where(Inventory.item_id == transaction.item_id)
        .where(Inventory.location_id == transaction.location_id)
    )
    match = db.exec(statement).first()
    return match


# unsafe
async def create_matching_inventory_row_for_transaction(
    transaction: InventoryTransaction, db: Session = Depends(get_session), commit=True
) -> InventoryCreate:
    new_inventory = InventoryCreate(
        item_id=transaction.item_id, location_id=transaction.location_id, quantity=0
    )
    new_row = Inventory(**new_inventory.model_dump())

    try:
        db.add(new_row)
        if commit is True:
            db.commit()
            db.refresh(new_row)
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database Error: {str(e.orig)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

    return new_row


# creates a matching inventory row for the transaction assuming iff it doesnt exist, returning the existing match otherwise
async def find_or_create_matching_inventory_row_for_transaction(
    transaction: InventoryTransaction, db: Session = Depends(get_session), commit=True
):
    match = await find_matching_inventory_row_to_transaction(transaction, db)
    if match is None:
        return await create_matching_inventory_row_for_transaction(
            transaction, db, commit=commit
        )
    return match


# adds the transaction to inventory_transactions, and then changes or creates the matching inventory (same item & location) row with the correct quantity change
async def add_and_commit_transaction_to_db(
    transaction: InventoryTransaction, db: Session = Depends(get_session)
):
    try:
        matching_inventory: Inventory = (
            await find_or_create_matching_inventory_row_for_transaction(
                transaction, db, commit=False
            )
        )
        matching_inventory.quantity += transaction.quantity

        db.add(transaction)
        db.commit()

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database Error: {str(e.orig)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
