from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from sqlalchemy.exc import IntegrityError

from ..db import get_session
from ..models import (
    Inventory,
    InventoryCreate,
    InventoryRecord,
    InventoryRecordAttemptCreate,
    InventoryRecordCreate,
    Items,
    Locations,
    RecordItemLocation,
)

router = APIRouter()


@router.get("/", response_model=List[RecordItemLocation])
async def read_records_endpoint(db: Session = Depends(get_session)):
    # statement = select(InventoryTransaction)
    statement = (
        select(InventoryRecord, Items, Locations)
        .join(Items, InventoryRecord.item_id == Items.item_id)
        .join(Locations, InventoryRecord.location_id == Locations.location_id)
    )
    data = db.exec(statement).all()

    response = []
    for record in data:
        rec, item, location = record
        response.append(
            RecordItemLocation(inventory_record=rec, item=item, location=location)
        )

    return response


@router.post("/", response_model=InventoryRecord)
async def add_record_endpoint(
    inventory_record: InventoryRecordAttemptCreate, db: Session = Depends(get_session)
):
    try:
        item_statement = select(Items).where(
            Items.item_name == inventory_record.item_name
        )
        item = db.exec(item_statement).first()
        if item is None:
            raise Exception("No matching item!")

        location_statement = select(Locations).where(
            Locations.location_name == inventory_record.location_name
        )
        location = db.exec(location_statement).first()
        if location is None:
            raise Exception("No matching location!")

        new_record = InventoryRecordCreate(
            item_id=item.item_id,
            location_id=location.location_id,
            quantity=inventory_record.quantity,
            date_of_count=inventory_record.date_of_count,
        )

        created_record = InventoryRecord(**new_record.model_dump())
        await add_and_commit_record_to_db(created_record, db)
        # db.add(created_transaction)
        # db.commit()
        # db.refresh(created_transaction)
        return created_record

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database Error: {str(e.orig)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


async def find_matching_inventory_row_to_record(
    record: InventoryRecord, db: Session = Depends(get_session)
):
    statement = (
        select(Inventory)
        .where(Inventory.item_id == record.item_id)
        .where(Inventory.location_id == record.location_id)
    )
    match = db.exec(statement).first()
    return match


# unsafe
async def create_matching_inventory_row_for_record(
    record: InventoryRecord, db: Session = Depends(get_session), commit=True
) -> InventoryCreate:
    new_inventory = InventoryCreate(
        item_id=record.item_id, location_id=record.location_id, quantity=0
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
async def find_or_create_matching_inventory_row_for_record(
    record: InventoryRecord, db: Session = Depends(get_session), commit=True
):
    match = await find_matching_inventory_row_to_record(record, db)
    if match is None:
        return await create_matching_inventory_row_for_record(record, db, commit=commit)
    return match


# adds the transaction to inventory_transactions, and then changes or creates the matching inventory (same item & location) row with the correct quantity change
async def add_and_commit_record_to_db(
    record: InventoryRecord, db: Session = Depends(get_session)
):
    try:
        matching_inventory: Inventory = (
            await find_or_create_matching_inventory_row_for_record(
                record, db, commit=False
            )
        )
        matching_inventory.quantity = record.quantity

        db.add(record)
        db.commit()

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database Error: {str(e.orig)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
