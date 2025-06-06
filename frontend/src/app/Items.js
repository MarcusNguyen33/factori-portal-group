import React, { useState } from "react";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";
import ItemList from "@/components/ItemList";
import * as api from "@/services/api";

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /// id of the item clicked that we want to add something to
  const [itemIDToChange, setItemIDToChange] = useState(null);
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newAttributeName, setNewAttributeName] = useState("");
  const [newAttributeUnit, setNewAttributeUnit] = useState("");
  const [newAttributeUnitType, setNewAttributeUnitType] = useState("");
  const [newAttributeValue, setNewAttributeValue] = useState("");

  const resetChanges = () => {
    setItemIDToChange(null);
    setNewItemName("");
    setNewItemDescription("");
    setNewAttributeName("");
    setNewAttributeUnit("");
    setNewAttributeUnitType("");
    setNewAttributeValue("");
  };

  const appendChange = (change, setter, elem) => {
    setter(change.append(elem));
  };

  const CHANGE_NONE = 0;
  /// click the list to add a new item
  const CHANGE_NEW_ITEM = 1;
  /// click an item to give it a new attribute
  const CHANGE_NEW_ATTRIBUTE = 2;
  const [change, setChange] = useState(CHANGE_NONE);
  const CHANGE_LOADING_NONE = CHANGE_NONE;
  const CHANGE_LOADING_NEW_ITEM = CHANGE_NEW_ITEM;
  const CHANGE_LOADING_NEW_ATTRIBUTE = CHANGE_NEW_ATTRIBUTE;
  const [changeLoading, setChangeLoading] = useState(CHANGE_LOADING_NONE);
  const [changeError, setChangeError] = useState(null);

  const onSelectItem = (item, attributes) => {
    if (changeLoading != CHANGE_LOADING_NONE) {
      return;
    }
    setChange(CHANGE_NEW_ATTRIBUTE);
    setChangeError(null);
    resetChanges();
  };

  const onSelectList = () => {
    if (changeLoading != CHANGE_LOADING_NONE) {
      return;
    }
    setChange(CHANGE_NEW_ITEM);
    setChangeError(null);
    resetChanges();
  };

  const handleFetchAllItems = async () => {
    console.log("handleFetchAllItems called");
    setLoading(true);
    setError(null);
    setItems([]);
    try {
      const data = await api.getItems(); // calling the API service function
      setItems(data);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch items:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInsertNewItem = async () => {
    console.log("handleInsertNewItem() called");
    setChangeLoading(CHANGE_LOADING_NEW_ITEM);
    setChangeError(null);

    try {
      const data = await api.addItem(newItemName, newItemDescription);
      handleFetchAllItems();
    } catch (err) {
      setChangeError(err);
      console.error("Failed to fetch items:", err);
    } finally {
      setChangeLoading(CHANGE_LOADING_NONE);
    }
  };

  const handleInsertNewAttribute = async () => {
    console.log("handleInsertNewAttribute()");
    setChangeLoading(CHANGE_LOADING_NEW_ATTRIBUTE);
    setChangeError(null);

    try {
      const data = await api.addItemAttribute(
        itemIDToChange,
        newAttributeName,
        newAttributeUnit,
        newAttributeUnitType,
        newAttributeValue,
      );
      handleFetchAllItems();
    } catch (err) {
      setChangeError(err);
      console.error("Failed to fetch items:", err);
    } finally {
      setChangeLoading(CHANGE_LOADING_NONE);
    }
  };

  return (
    <div className="appContainer">
      <Card>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <h1>Items Portal</h1>
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            <Button onClick={handleFetchAllItems}>Fetch All Items</Button>
          </div>
          <div
            style={{
              marginBottom: "20px",
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          ></div>
          {change == CHANGE_NEW_ITEM && (
            <div>
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Enter Name of New Item"
                style={{
                  padding: "8px",
                  marginRight: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />
              <input
                type="text"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Enter Description of New Item"
                style={{
                  padding: "8px",
                  marginRight: "10px",
                  borderRadius: "4px",
                  border: "1px solid #ccc",
                }}
              />

              <Button onClick={handleInsertNewItem}>Insert</Button>
              {changeLoading && <div>Waiting For Response</div>}
              {!changeLoading && changeError && (
                <p style={{ color: "red" }}>
                  Error adding new item: {changeError.message}
                </p>
              )}
            </div>
          )}
        </div>
        {(items.length > 0 || loading || error) && (
          <div style={{ marginTop: "20px", width: "90%" }}>
            <ItemList
              items={items}
              loading={loading}
              error={error}
              onSelectItem={onSelectItem}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
