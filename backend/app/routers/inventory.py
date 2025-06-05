from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from ..db import get_session
from ..models import Inventory, InventoryItemsLocation, Items, Locations

router = APIRouter()


# this gets all inventory from the database
@router.get("/", response_model=List[InventoryItemsLocation])
async def read_inventory_endpoint(db: Session = Depends(get_session)):
    # `statement` is the query object retuned from selecting items.
    # statement = select(Inventory, Items, Locations).join(Items).join(Locations)#.where(Inventory.item_id == Items.item_id and Inventory.location_id == Locations.location_id)
    statement = (
        select(
            Inventory.inventory_id,
            Inventory.item_id,
            Items.item_name,
            Items.description,
            Items.created_at,
            Items.updated_at,
            Inventory.location_id,
            Locations.location_name,
            Locations.location_description,
        )
        .join(Items, Inventory.item_id == Items.item_id)
        .join(Locations, Inventory.location_id == Locations.location_id)
    )

    items = db.exec(statement).all()

    # items = [
    #    InventoryItemsLocation(inv.item_id, inv.location_id, inv.quantity, inv.inventory_id, item, location)
    #    for inv, item, location in items
    # ]

    return items


@router.get("/id={inventory_id}", response_model=InventoryItemsLocation)
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
