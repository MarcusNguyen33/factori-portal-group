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


class Suppliers(SQLModel, table=True):
    supplier_id: Optional[int] = Field(default=None, primary_key=True)
    supplier_name: Optional[str] = Field(unique=True)


class SupplierRead(SQLModel):
    supplier_id: int
    supplier_name: str


class InventoryBase(SQLModel):
    item_id: Optional[int] = Field(default=None, foreign_key="items.item_id")
    location_id: Optional[int] = Field(
        default=None, foreign_key="locations.location_id"
    )
    quantity: int = Field(default=0)


class Inventory(InventoryBase, table=True):
    inventory_id: Optional[int] = Field(default=None, primary_key=True)


class InventoryCreate(InventoryBase):
    pass


class InventoryOutput(InventoryBase):
    inventory_id: int


class InventoryItemsLocation(SQLModel):
    inventory_id: int
    item_id: int
    item_name: str
    description: Optional[str]
    location_id: int
    location_name: str
    location_description: Optional[str]
    quantity: int


# class InventoryRead(SQLModel, table=True):
#    inventory_id: int
#    item_id:  int
#    location_id: int
#    quantity: int
