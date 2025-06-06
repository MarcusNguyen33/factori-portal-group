from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from sqlalchemy import bindparam
from sqlalchemy.exc import IntegrityError

from ..db import get_session
from ..models import (
    AttributeDefinition,
    IaAdUdUt,
    ItemAttribute,
    ItemAttributeBase,
    ItemAttributeCreate,
    ItemRead,
    Items,
    ItemsBase,
    ItemsWithAttributes,
    UnitDefinition,
    UnitType,
)

router = APIRouter()


# this gets all items from the database
@router.get("/", response_model=List[ItemsWithAttributes])
async def read_items_endpoint(db: Session = Depends(get_session)):
    # statement = select(Items)
    # items = db.exec(statement).all()
    # attribute_subquery = (
    #    select(ItemAttribute, AttributeDefinition, UnitDefinition, UnitType)
    #    .join(AttributeDefinition, ItemAttribute.definition_id == AttributeDefinition.definition_id)
    #    .join(UnitDefinition, ItemAttribute.unit_id == UnitDefinition.unit_id)
    #    .join(UnitType, UnitDefinition.type_id == UnitType.type_id)
    #    #.where(ItemAttribute.item_id == Items.item_id)
    #    .subquery("attribute_subquery")
    # )
    attribute_statement = (
        select(ItemAttribute, AttributeDefinition, UnitDefinition, UnitType)
        .join(
            AttributeDefinition,
            ItemAttribute.definition_id == AttributeDefinition.definition_id,
        )
        .join(UnitDefinition, ItemAttribute.unit_id == UnitDefinition.unit_id)
        .join(UnitType, UnitDefinition.type_id == UnitType.type_id)
        .where(ItemAttribute.item_id == bindparam("item_id"))
    )

    statement = select(Items)
    items = db.exec(statement).all()
    response = []
    for item in items:
        attributes = db.exec(
            attribute_statement, params={"item_id": item.item_id}
        ).all()
        attributes = [
            IaAdUdUt(
                item_attribute=ia,
                attribute_definition=ad,
                unit_definition=ud,
                unit_type=ut,
            )
            for ia, ad, ud, ut in attributes
        ]

        response.append(ItemsWithAttributes(item=item, attributes=attributes))

    return response
    # statement = (
    #    select(Items, ItemAttribute, AttributeDefinition, UnitDefinition, UnitType)
    #    .join(ItemAttribute, Items.item_id == ItemAttribute.item_id)
    #    .join(AttributeDefinition, )
    # )
    # return items


# so now if we go to http://localhost:8000/api/v1/items/1 it will return the item with id 1
@router.get("/{item_id}", response_model=ItemRead)
async def read_item_by_id(item_id: int, db: Session = Depends(get_session)):
    # first argument is the SQLModel class, second is the primary key value.
    db_item = db.get(Items, item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    return db_item


@router.post("/", response_model=None)
async def add_item_endpoint(item: ItemsBase, db: Session = Depends(get_session)):
    try:
        new_item = Items(**item.model_dump())  # Convert Pydantic model to ORM model
        db.add(new_item)
        db.commit()
        db.refresh(new_item)  # Ensure latest state is returned
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database Error: {str(e.orig)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")


@router.post("/attribute", response_model=None)
async def add_attribute_to_item_endpoint(
    item: ItemAttributeCreate, db: Session = Depends(get_session)
):
    try:
        matching_item = db.exec(
            (select(Items).where(Items.item_id == item.item_id))
        ).first()  # Convert Pydantic model to ORM model
        if matching_item is None:
            raise Exception("Invalid item id!")

        attribute_definition_id = db.exec(
            (
                select(AttributeDefinition.definition_id).where(
                    AttributeDefinition.attribute_name == item.attribute_name
                )
            )
        ).first()
        if attribute_definition_id is None:
            raise Exception("Invalid definition_id")

        unit = db.exec(
            (
                select(UnitDefinition.unit_id).where(
                    UnitDefinition.unit_name == item.unit_name
                )
            )
        ).first()
        if unit is None:
            raise Exception("No matching unit")

        new_attribute = ItemAttributeBase(
            item_id=item.item_id,
            definition_id=attribute_definition_id,
            attribute_value=item.attribute_value,
            unit_id=unit,
        )

        created_attribute = ItemAttribute(**new_attribute.model_dump())

        db.add(created_attribute)
        db.commit()
        db.refresh(created_attribute)  # Ensure latest state is returned
    except IntegrityError as e:
        db.rollback()
        raise HTTPException(status_code=400, detail=f"Database Error: {str(e.orig)}")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")
