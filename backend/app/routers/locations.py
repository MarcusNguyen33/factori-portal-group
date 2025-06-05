from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List

from ..db import get_session
from ..models import Locations, LocationRead

router = APIRouter()


@router.get("/", response_model=List[LocationRead])
async def read_locations_endpoint(db: Session = Depends(get_session)):
    statement = select(Locations)
    locations = db.exec(statement).all()
    return locations


@router.get("/{location_id}", response_model=LocationRead)
async def read_location_by_id(location_id: int, db: Session = Depends(get_session)):
    db_location = db.get(Locations, location_id)
    if not db_location:
        raise HTTPException(status_code=404, detail="Supplier not found")

    return db_location
