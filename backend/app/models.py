from sqlmodel import SQLModel, Field
from typing import Optional
from datetime import datetime, timezone


class ItemsBase(SQLModel):
    item_name: str = Field(index=True)
    description: Optional[str] = None


class Items(ItemsBase, table=True):
    item_id: Optional[int] = Field(default=None, primary_key=True)
    created_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc), nullable=True
    )
    updated_at: Optional[datetime] = Field(
        default_factory=lambda: datetime.now(timezone.utc), nullable=True
    )


# what the items should look like when when read from the API
class ItemRead(ItemsBase):
    item_id: int
    created_at: datetime
    updated_at: datetime


# no extra fields needed for creation other than whats in ItemsBase
class ItemCreate(ItemsBase):
    pass


# everything is optional here because the clint might only want to update one field
class ItemUpdate(SQLModel):
    item_name: Optional[str] = None
    description: Optional[str] = None


class Locations(SQLModel, table=True):
    location_id: Optional[int] = Field(default=None, primary_key=True)
    location_name: Optional[str] = Field(unique=True)
    location_description: Optional[str] = Field()


class LocationRead(SQLModel):
    location_id: int
    location_name: str
    location_description: str
