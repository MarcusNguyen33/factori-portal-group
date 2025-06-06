from sqlmodel import SQLModel, Field
from typing import List, Optional
from datetime import datetime, timezone
from pydantic import BaseModel

#                                   sorry


class UnitTypeBase(SQLModel):
    type_name: str = Field()


class UnitType(UnitTypeBase, table=True):
    __tablename__ = "unit_types"
    type_id: Optional[int] = Field(default=None, primary_key=True)


class UnitDefinitionBase(SQLModel):
    unit_name: str = Field()
    type_id: int = Field(foreign_key="unit_types.type_id")


class UnitDefinition(UnitDefinitionBase, table=True):
    __tablename__ = "unit_definitions"
    unit_id: Optional[int] = Field(primary_key=True)


class AttributeDefinitionBase(SQLModel):
    attribute_name: str = Field()
    data_type: str = Field()
    unit_type: int = Field(foreign_key="unit_types.type_id")
    allowed_values: str = Field()


class AttributeDefinition(AttributeDefinitionBase, table=True):
    __tablename__ = "attribute_definitions"
    definition_id: Optional[int] = Field(primary_key=True)


class ItemAttributeBase(SQLModel):
    item_id: int = Field(foreign_key="items.item_id")
    definition_id: int = Field(foreign_key="attribute_definitions.definition_id")
    attribute_value: str = Field()
    unit_id: int = Field(foreign_key="unit_definitions.unit_id")


class ItemAttribute(ItemAttributeBase, table=True):
    __tablename__ = "item_attributes"
    attribute_id: Optional[int] = Field(primary_key=True)


class ItemAttributeCreate(BaseModel):
    item_id: int
    attribute_name: str
    unit_name: str
    type_name: str
    attribute_value: str


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


class IaAdUdUt(BaseModel):
    item_attribute: ItemAttribute
    attribute_definition: AttributeDefinition
    unit_definition: UnitDefinition
    unit_type: UnitType


class ItemsWithAttributes(BaseModel):
    item: Items
    attributes: List[IaAdUdUt]


class Locations(SQLModel, table=True):
    location_id: Optional[int] = Field(default=None, primary_key=True)
    location_name: Optional[str] = Field(unique=True)
    location_description: Optional[str] = Field()


class LocationRead(SQLModel):
    location_id: int
    location_name: str
    location_description: str


class LocationCreate(BaseModel):
    location_name: str
    location_description: str = ""


class Suppliers(SQLModel, table=True):
    supplier_id: Optional[int] = Field(default=None, primary_key=True)
    supplier_name: Optional[str] = Field(unique=True)


class SupplierRead(SQLModel):
    supplier_id: int
    supplier_name: str


class SupplierCreate(BaseModel):
    supplier_name: str = Field(unique=True)


class InventoryBase(SQLModel):
    item_id: Optional[int] = Field(default=None, foreign_key="items.item_id")
    location_id: Optional[int] = Field(
        default=None, foreign_key="locations.location_id"
    )
    quantity: int = Field(default=0)


class Inventory(InventoryBase, table=True):
    inventory_id: Optional[int] = Field(default=None, primary_key=True)
    # item: Items = Relationship(back_populates="inventory")
    # location: Locations = Relationship(back_populates="inventory")


class InventoryCreate(InventoryBase):
    pass


class InventoryOutput(InventoryBase):
    inventory_id: int


class InventoryItemsLocation(SQLModel):
    inventory_id: int
    quantity: int
    item_id: int
    location_id: int
    item_name: str
    description: Optional[str]
    location_name: str
    location_description: Optional[str]


class InventoryTransactionBase(SQLModel):
    __tablename__ = "inventory_transactions"
    item_id: int = Field(foreign_key="items.item_id")
    location_id: int = Field(foreign_key="locations.location_id")
    quantity: int = Field(default=0)
    transaction_description: Optional[str] = Field(default="")
    transaction_date: datetime = Field()
    supplier_id: Optional[int] = Field(
        default=None, foreign_key="suppliers.supplier_id"
    )


class InventoryTransaction(InventoryTransactionBase, table=True):
    transaction_id: int = Field(primary_key=True)


# passed in from the frontend, which doesnt have all of the id's for the necessary fields
class InventoryTransactionAttemptCreate(BaseModel):
    __tablename__ = "inventory_transactions"
    item_name: str = Field()
    location_name: str = Field()
    quantity: int = Field(default=0)
    transaction_description: Optional[str] = Field(default=None)
    transaction_date: datetime = Field()
    supplier_name: Optional[str] = Field(default=None)


class InventoryTransactionCreate(BaseModel):
    __tablename__ = "inventory_transactions"
    item_id: int = Field(foreign_key="items.item_id")
    location_id: int = Field(foreign_key="locations.location_id")
    quantity: int = Field(default=0)
    transaction_description: Optional[str] = Field(default="")
    transaction_date: datetime = Field()
    supplier_id: Optional[int] = Field(
        default=None, foreign_key="suppliers.supplier_id"
    )


class InventoryTransactionSupplier(BaseModel):
    transaction: InventoryTransaction
    supplier: Optional[Suppliers]


class InventoryTransactionItemLocationSupplier(BaseModel):
    transaction: InventoryTransaction
    item: Items
    location: Locations
    supplier: Optional[Suppliers]


class InventoryRecordBase(SQLModel):
    __tablename__ = "inventory_records"
    item_id: int = Field(foreign_key="items.item_id")
    location_id: int = Field(foreign_key="locations.location_id")
    quantity: int = Field(default=0)
    date_of_count: datetime = Field()


class InventoryRecord(InventoryRecordBase, table=True):
    record_id: int = Field(primary_key=True)


class InventoryRecordCreate(InventoryRecordBase):
    pass


class InventoryRecordAttemptCreate(BaseModel):
    item_name: str
    location_name: str
    quantity: int
    date_of_count: datetime


class RecordItemLocation(BaseModel):
    inventory_record: InventoryRecord
    item: Items
    location: Locations


class InventoryResponse(BaseModel):
    inventory: Inventory
    item: Items
    location: Locations
    latest_record: InventoryRecord
    transactions: List[InventoryTransactionSupplier]


# class InventoryRead(SQLModel, table=True):
#    inventory_id: int
#    item_id:  int
#    location_id: int
#    quantity: int
