import React, { useState } from "react";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";
import InventoryList from "@/components/InventoryList";
import InventoryEntry from "@/components/InventoryEntry";
import * as api from "@/services/api";

export default function Inventory() {
  const [inventory, setInventory] = useState([]);

  const LOADING_NONE = 0;
  const LOADING_ALL = 1;
  const LOADING_SINGLE = 2;
  const [loading, setLoading] = useState(LOADING_NONE);
  const [error, setError] = useState(null);

  const [inventoryIDToFetch, setInventoryIDToFetch] = useState("");
  const [singleInventory, setSingleInventory] = useState(null);
  const [singleInventoryError, setSingleInventoryError] = useState(null);

  const handleFetchAllInventory = async () => {
    console.log("handleFetchAllInventory() called");
    setLoading(LOADING_ALL);
    setError(null);
    setInventory([]);

    try {
      const data = await api.getInventory();
      setInventory(data);
      console.log("handleFetchAllInventory() data received: ", data);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch inventory", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchInventoryByID = async (ID) => {
    console.log("handleFetchInventoryByID() called");
    if (!inventoryIDToFetch.trim()) {
      setSingleInventoryError(new Error("Please enter an inventory ID"));
      setSingleInventory(null);
      return;
    }

    setLoading(LOADING_SINGLE);
    setSingleInventoryError(null);
    setSingleInventory(null);
    setInventory([]);

    try {
      const data = await api.getInventoryByID(inventoryIDToFetch);
      setSingleInventory(data);
    } catch (err) {
      setSingleInventoryError(err);
      console.error("Failed to fetch inventory:", err);
    } finally {
      setLoading(LOADING_NONE);
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
          <Button onClick={handleFetchAllInventory}>Fetch All Inventory</Button>
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
            value={inventoryIDToFetch}
            onChange={(e) => setInventoryIDToFetch(e.target.value)}
            placeholder="Enter Inventory ID"
            style={{
              padding: "8px",
              marginRight: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <Button onClick={handleFetchInventoryByID}>
            Fetch Inventory by ID
          </Button>
        </div>
      </Card>

      {(inventory.length > 0 || loading || error) && !singleInventory && (
        <InventoryList inventory={inventory} loading={loading} error={error} />
      )}

      {loading == LOADING_SINGLE && <p>Loading Inventory...</p>}
      {singleInventoryError && (
        <p style={{ color: "red" }}>Error: {singleInventoryError.message}</p>
      )}
      {singleInventory && loading == LOADING_NONE && !singleInventoryError && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid green",
            borderRadius: "5px",
          }}
        >
          <h2>Fetched Inventory Details</h2>
          <p>
            <strong>ID:</strong> {singleInve.location_id}
          </p>
          <p>
            <strong>Name:</strong> {singleSupplier.location_name}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {singleSupplier.location_description || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}
