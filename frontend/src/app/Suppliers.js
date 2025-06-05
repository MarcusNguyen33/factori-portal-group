import React, { useState } from "react";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";
import SupplierList from "@/components/SupplierList";
import * as api from "@/services/api";

export default function Suppliers() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="appContainer">
      <Card>
        <h1>Suppliers Portal</h1>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <Button onClick={handleFetchAllSuppliers}>Fetch All Suppliers</Button>
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
            value={suppliersIDToFetch}
            onChange={(e) => setSupplierToFetch(e.target.value)}
            placeholder="Enter Supplier ID"
            style={{
              padding: "8px",
              marginRight: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <Button onClick={handleFetchSuppliersByID}>
            Fetch Supplier by ID
          </Button>
        </div>
      </Card>

      {(suppliers.length > 0 || loading || error) && !singleSupplier && (
        <SupplierList suppliers={suppliers} loading={loading} error={error} />
      )}

      {singleSupplierLoading && <p>Loading Supplier...</p>}
      {singleSupplierError && (
        <p style={{ color: "red" }}>Error: {singleSupplierError.message}</p>
      )}
      {singleSupplier && !singleSupplierLoading && !singleSupplierError && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid green",
            borderRadius: "5px",
          }}
        >
          <h2>Fetched Supplier Details</h2>
          <p>
            <strong>ID:</strong> {singleSupplier.location_id}
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
