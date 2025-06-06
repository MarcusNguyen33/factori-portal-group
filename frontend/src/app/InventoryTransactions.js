import React, { useState, useEffect } from "react";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";
import InventoryTransactionList from "@/components/InventoryTransactionList";
import InventoryTransactionEntry from "@/components/InventoryTransactionEntry";
import * as api from "@/services/api";

export default function InventoryTransactions() {
  const [inventory, setInventory] = useState([]);

  const LOADING_NONE = 0;
  const LOADING_ALL = 1;
  const [loading, setLoading] = useState(LOADING_NONE);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (inventory) {
      console.log("inventory transactions set = ", inventory);
    }
  }, [inventory]);

  const [adding, setAdding] = useState(false);
  const [itemNameToAdd, setItemNameToAdd] = useState("");
  const [locationNameToAdd, setLocationNameToAdd] = useState("");
  const [quantityToAdd, setQuantityToAdd] = useState("0");
  const [descriptionToAdd, setDescriptionToAdd] = useState("");
  const [dateToAdd, setDateToAdd] = useState(new Date().toISOString());
  const [supplierNameToAdd, setSupplierNameToAdd] = useState(null);

  const [addLoading, setAddLoading] = useState(false);
  const [addError, setAddError] = useState(null);

  const handleFetchAll = async () => {
    console.log("handleFetchAll() called");

    setLoading(LOADING_ALL);
    setError(null);
    setInventory([]);

    try {
      const data = await api.getTransactions();
      setInventory(data);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch transactions:", err);
    } finally {
      setLoading(LOADING_NONE);
    }
  };

  const handleInsertNewTransaction = async () => {
    console.log("handleInsertNewTransaction() called");
    if (!itemNameToAdd.trim()) {
      setAddError(
        new Error("Please enter an item name for the new transaction"),
      );
      return;
    }
    if (!locationNameToAdd.trim()) {
      setAddError(
        new Error("Please enter a location name for the new transaction"),
      );
      return;
    }
    const quantity = parseInt(quantityToAdd, 10);
    if (isNaN(quantity)) {
      setAddError(new Error("Invalid Quantity"));
      return;
    }
    if (quantity == 0) {
      setAddError(
        new Error("Transactions with a quantity of 0 don't make any sense"),
      );
      return;
    }

    setAddLoading(true);
    setAddError(null);

    try {
      const response = await api.addTransaction(
        itemNameToAdd,
        locationNameToAdd,
        quantity,
        descriptionToAdd,
        dateToAdd,
        supplierNameToAdd,
      );
      handleFetchAll();
    } catch (err) {
      setAddError(err);
      console.error("Error trying to insert new transaction: ", err);
    } finally {
      setAddLoading(false);
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
          <h1>Inventory Transactions Portal</h1>
          <Button onClick={handleFetchAll}>
            Fetch All Inventory Transactions
          </Button>
          <Button onClick={() => setAdding(!adding)}>
            Create New Transaction
          </Button>
        </div>
        {adding == true && (
          <div>
            <input
              type="text"
              value={itemNameToAdd}
              onChange={(e) => setItemNameToAdd(e.target.value)}
              placeholder="Enter Name of Item to Add"
              style={{
                padding: "8px",
                marginRight: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              value={locationNameToAdd}
              onChange={(e) => setLocationNameToAdd(e.target.value)}
              placeholder="Enter Name of Location to Add"
              style={{
                padding: "8px",
                marginRight: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              value={quantityToAdd}
              onChange={(e) => {
                const newValue = e.target.value;
                setQuantityToAdd(newValue);
                //if (/^-?\d*$/.test(newValue)) {
                //  setQuantityToAdd(newValue === "" ? 0 : parseInt(newValue, 10));
                //}
              }}
              placeholder="Enter Quantity to Add"
              style={{
                padding: "8px",
                marginRight: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              value={descriptionToAdd}
              onChange={(e) => setDescriptionToAdd(e.target.value)}
              placeholder="Enter Description of the New Transaction"
              style={{
                padding: "8px",
                marginRight: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="datetime-local"
              value={dateToAdd}
              onChange={(e) => setDateToAdd(e.target.value)}
              placeholder="Enter Date that the Transaction Took Place"
              style={{
                padding: "8px",
                marginRight: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <input
              type="text"
              value={supplierNameToAdd}
              onChange={(e) => setSupplierNameToAdd(e.target.value)}
              placeholder="Enter Name of Supplier to Add"
              style={{
                padding: "8px",
                marginRight: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />

            <Button onClick={handleInsertNewTransaction}>Insert</Button>
            {addLoading && <div>Waiting For Response</div>}
            {!addLoading && addError && (
              <p style={{ color: "red" }}>
                Error adding new transaction: {addError.message}
              </p>
            )}
          </div>
        )}

        {(inventory.length > 0 || loading || error) && (
          <div style={{ marginTop: "20px", width: "90%" }}>
            <InventoryTransactionList
              inventory={inventory}
              loading={loading}
              error={error}
            />
          </div>
        )}
      </Card>

      {loading == LOADING_ALL && <p>Loading Inventory Transactions...</p>}
    </div>
  );
}
