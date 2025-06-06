from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from typing import List
from sqlalchemy import desc

from ..db import get_session
from ..models import (
    Inventory,
    InventoryItemsLocation,
    InventoryRecord,
    InventoryResponse,
    InventoryTransaction,
    InventoryTransactionSupplier,
    Items,
    Locations,
    Suppliers,
)

router = APIRouter()


# this gets all inventory from the database
@router.get("/", response_model=List[InventoryResponse])
async def read_inventory_endpoint(db: Session = Depends(get_session)):

    subquery = (
        select(
            InventoryRecord.item_id,
            InventoryRecord.location_id,
            func.max(InventoryRecord.date_of_count).label("latest_date"),
        )
        .group_by(InventoryRecord.item_id, InventoryRecord.location_id)
        .subquery("subquery")
    )

    statement = (
        select(Inventory, Items, Locations, InventoryRecord)
        .join(Items, Inventory.item_id == Items.item_id)
        .join(Locations, Inventory.location_id == Locations.location_id)
        .join(
            subquery,
            (Inventory.item_id == subquery.c.item_id)
            & (Inventory.location_id == subquery.c.location_id),
        )
        .join(
            InventoryRecord,
            (subquery.c.item_id == InventoryRecord.item_id)
            & (subquery.c.location_id == InventoryRecord.location_id)
            & (subquery.c.latest_date == InventoryRecord.date_of_count),
        )
        # .group_by(Inventory.inventory_id, Items.item_id, Locations.location_id, InventoryRecord.location_id)
    )

    inv_with_records = db.exec(statement).all()

    transactions_statement = (
        select(InventoryTransaction, Suppliers)
        .outerjoin(Suppliers, InventoryTransaction.supplier_id == Suppliers.supplier_id)
        .order_by(
            desc(InventoryTransaction.transaction_date),
            InventoryTransaction.transaction_id,
        )
    )
    trans = db.exec(transactions_statement).all()
    transactions = []
    for record in trans:
        transaction, supplier = record
        transactions.append(
            InventoryTransactionSupplier(transaction=transaction, supplier=supplier)
        )
    # transactions = [InventoryTransactionSupplier(t,s) for t,s in transactions]

    response = []
    for record in inv_with_records:
        inventory, item, location, latest_record = record
        response.append(
            InventoryResponse(
                inventory=inventory,
                item=item,
                location=location,
                latest_record=latest_record,
                transactions=[
                    t
                    for t in transactions
                    if t.transaction.item_id == inventory.item_id
                    and t.transaction.location_id == inventory.location_id
                ],
            )
        )

    return response


@router.get("/{inventory_id}", response_model=InventoryItemsLocation)
async def read_inventory_by_id(inventory_id: int, db: Session = Depends(get_session)):
    # first argument is the SQLModel class, second is the primary key value.
    statement = (
        select(Inventory, Items, Locations)
        .join(Items)
        .join(Locations)
        .where(Inventory.inventory_id == inventory_id)
    )
    # db_item = db.get(Inventory, inventory_id)
    db_item = db.exec(statement).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Inventory not found")
    return db_item
