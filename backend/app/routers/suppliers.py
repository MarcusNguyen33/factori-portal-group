from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from ..db import get_session
from ..models import SupplierRead, Suppliers

router = APIRouter()


# this gets all items from the database
@router.get("/", response_model=List[SupplierRead])
async def read_suppliers_endpoint(db: Session = Depends(get_session)):
    # `statement` is the query object retuned from selecting items.
    statement = select(Suppliers)  # select(Items) is like doing 'SELECT *'
    items = db.exec(statement).all()
    return items


# so now if we go to http://localhost:8000/api/v1/items/1 it will return the item with id 1
@router.get("/{supplier_id}", response_model=SupplierRead)
async def read_item_by_id(item_id: int, db: Session = Depends(get_session)):
    # first argument is the SQLModel class, second is the primary key value.
    db_item = db.get(Suppliers, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item
