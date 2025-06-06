import React, { useState } from "react";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";
import SupplierList from "@/components/SupplierList";
import * as api from "@/services/api";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //with adding new suppliers to the db
  const [adding, setAdding] = useState(false);
  const [nameToAdd, setNameToAdd] = useState("");
  const [newWaiting, setNewLoading] = useState(false);
  const [newError, setNewError] = useState(null);

  const [suppliersIDToFetch, setSupplierToFetch] = useState("");
  const [singleSupplier, setSingleSupplier] = useState(null);
  const [singleSupplierLoading, setSingleSupplierLoading] = useState(false);
  const [singleSupplierError, setSingleSupplierError] = useState(null);

  const handleFetchAllSuppliers = async () => {
    console.log("handleFetchAllSuppliers() called");
    setLoading(true);
    setError(null);
    setSuppliers([]);

    try {
      const data = await api.getSuppliers();
      setSuppliers(data);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch suppliers:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchSuppliersByID = async () => {
    console.log("handleFetchSuppliersByID() called");
    if (!suppliersIDToFetch.trim()) {
      setSingleSupplierError(new Error("Please enter a supplier ID"));
      setSingleSupplier(null);
      return;
    }

    setSingleSupplierLoading(true);
    setSingleSupplierError(null);
    setSingleSupplier(null);
    setSuppliers([]);

    try {
      const data = await api.getSupplierByID(suppliersIDToFetch);
      setSingleSupplier(data);
    } catch (err) {
      setSingleSupplierError(err);
      console.error("Failed to fetch supplier:", err);
    } finally {
      setSingleSupplierLoading(false);
    }
  };

  const handleInsertNew = async () => {
    console.log(
      "handleInsertNew() called: ",
      adding,
      nameToAdd,
      newWaiting,
      newError,
    );
    if (!nameToAdd.trim()) {
      setNewLocationError(
        new Error("Please enter a name for the new location"),
      );
      return;
    }

    setNewLoading(true);
    setNewError(null);

    try {
      const response = await api.addSupplier(nameToAdd);
      setNameToAdd("");
      await handleFetchAllSuppliers();
    } catch (err) {
      setNewError(err);
      console.error("Error trying to insert new location: ", err);
    } finally {
      setNewLoading(false);
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
          <h1>Suppliers Portal</h1>
          <Button onClick={handleFetchAllSuppliers}>Fetch All Suppliers</Button>
          <Button onClick={() => setAdding(!adding)}>Add New Supplier</Button>
        </div>
        {adding == true && (
          <div>
            <input
              type="text"
              value={nameToAdd}
              onChange={(e) => setNameToAdd(e.target.value)}
              placeholder="Enter Name of New Supplier"
              style={{
                padding: "8px",
                marginRight: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <Button onClick={handleInsertNew}>Insert</Button>
            {newWaiting && <div>Waiting For Response</div>}
            {!newWaiting && newError && (
              <p style={{ color: "red" }}>
                Error adding new Supplier: {newError.message}
              </p>
            )}
          </div>
        )}
        {(suppliers.length > 0 || loading || error) && (
          <div style={{ marginTop: "20px", width: "90%" }}>
            <SupplierList
              suppliers={suppliers}
              loading={loading}
              error={error}
            />
          </div>
        )}
      </Card>
    </div>
  );
}
