import React, { useState } from "react";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";
import ItemList from "@/components/ItemList";
import * as api from "@/services/api";

export default function Items() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // state for input field for fetching a single item by ID
  const [itemIdToFetch, setItemIdToFetch] = useState("");
  // also saving the actual fetched item
  const [singleItem, setSingleItem] = useState(null);
  const [singleItemLoading, setSingleItemLoading] = useState(false);
  const [singleItemError, setSingleItemError] = useState(null);

  const handleFetchAllItems = async () => {
    console.log("handleFetchAllItems called");
    setLoading(true);
    setError(null);
    setItems([]);
    setSingleItem(null);
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

  const handleFetchItemById = async () => {
    console.log("handleFetchItemById called");
    if (!itemIdToFetch.trim()) {
      setSingleItemError(new Error("Please enter an item ID."));
      setSingleItem(null);
      return;
    }
    setSingleItemLoading(true);
    setSingleItemError(null);
    setSingleItem(null);
    setItems([]);
    try {
      const data = await api.getItemById(itemIdToFetch);
      setSingleItem(data);
    } catch (err) {
      setSingleItemError(err);
      console.error(`Failed to fetch item ${itemIdToFetch}:`, err);
    } finally {
      setSingleItemLoading(false);
    }
  };

  return (
    <div className="appContainer">
      <Card>
        <h1>Inventory Portal</h1>
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
        >
          <input
            type="text"
            value={itemIdToFetch}
            onChange={(e) => setItemIdToFetch(e.target.value)}
            placeholder="Enter Item ID"
            style={{
              padding: "8px",
              marginRight: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <Button onClick={handleFetchItemById}>Fetch Item by ID</Button>
        </div>
      </Card>

      {(items.length > 0 || loading || error) && !singleItem && (
        <ItemList items={items} loading={loading} error={error} />
      )}

      {singleItemLoading && <p>Loading item...</p>}
      {singleItemError && (
        <p style={{ color: "red" }}>Error: {singleItemError.message}</p>
      )}
      {singleItem && !singleItemLoading && !singleItemError && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid green",
            borderRadius: "5px",
          }}
        >
          <h2>Fetched Item Details</h2>
          <p>
            <strong>ID:</strong> {singleItem.item_id}
          </p>
          <p>
            <strong>Name:</strong> {singleItem.item_name}
          </p>
          <p>
            <strong>Description:</strong> {singleItem.description || "N/A"}
          </p>
          <p>
            <strong>Created:</strong>{" "}
            {new Date(singleItem.created_at).toLocaleString()}
          </p>
          <p>
            <strong>Updated:</strong>{" "}
            {new Date(singleItem.updated_at).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}
