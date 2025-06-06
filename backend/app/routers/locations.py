from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from sqlalchemy.exc import IntegrityError

from ..db import get_session
from ..models import LocationCreate, Locations, LocationRead

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
        raise HTTPException(status_code=404, detail="Location not found")

    return db_location


@router.post("/", response_model=Locations)
async def create_location_endpoint(
    location: LocationCreate, db: Session = Depends(get_session)
):
    try:
        new_location = Locations(
            **location.model_dump()
        )  # Convert Pydantic model to ORM model
        db.add(new_location)
        db.commit()
        db.refresh(new_location)  # Ensure latest state is returned
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database Error: {str(e.orig)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
    return new_location
