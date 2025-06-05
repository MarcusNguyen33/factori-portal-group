import React, { useState } from "react";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";
import LocationList from "@/components/LocationList";
import * as api from "@/services/api";

export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [locationIDToFetch, setLocationToFetch] = useState("");
  const [singleLocation, setSingleLocation] = useState(null);
  const [singleLocationLoading, setSingleLocationLoading] = useState(false);
  const [singleLocationError, setSingleLocationError] = useState(null);

  const handleFetchAllLocations = async () => {
    console.log("handleFetchAllLocations() called");
    setLoading(true);
    setError(null);
    setLocations([]);

    try {
      const data = await api.getLocations();
      setLocations(data);
    } catch (err) {
      setError(err);
      console.error("Failed to fetch locations:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchLocationByID = async () => {
    console.log("handleFetchLocationByID() called");
    if (!locationIDToFetch.trim()) {
      setSingleLocationError(new Error("Please enter a location ID"));
      setSingleLocation(null);
      return;
    }

    setSingleLocationLoading(true);
    setSingleLocationError(null);
    setSingleLocation(null);
    setLocations([]);

    try {
      const data = await api.getLocationByID(locationIDToFetch);
      setSingleLocation(data);
    } catch (err) {
      setSingleLocationError(err);
      console.error("Failed to fetch location:", err);
    } finally {
      setSingleLocationLoading(false);
    }
  };

  return (
    <div className="appContainer">
      <Card>
        <h1>Locations Portal</h1>
        <div
          style={{
            marginBottom: "20px",
            display: "flex",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <Button onClick={handleFetchAllLocations}>Fetch All Locations</Button>
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
            value={locationIDToFetch}
            onChange={(e) => setLocationToFetch(e.target.value)}
            placeholder="Enter Location ID"
            style={{
              padding: "8px",
              marginRight: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />
          <Button onClick={handleFetchLocationByID}>
            Fetch Location by ID
          </Button>
        </div>
      </Card>

      {(locations.length > 0 || loading || error) && !singleLocation && (
        <LocationList locations={locations} loading={loading} error={error} />
      )}

      {singleLocationLoading && <p>Loading location...</p>}
      {singleLocationError && (
        <p style={{ color: "red" }}>Error: {singleLocationError.message}</p>
      )}
      {singleLocation && !singleLocationLoading && !singleLocationError && (
        <div
          style={{
            marginTop: "20px",
            padding: "15px",
            border: "1px solid green",
            borderRadius: "5px",
          }}
        >
          <h2>Fetched Location Details</h2>
          <p>
            <strong>ID:</strong> {singleLocation.location_id}
          </p>
          <p>
            <strong>Name:</strong> {singleLocation.location_name}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {singleLocation.location_description || "N/A"}
          </p>
        </div>
      )}
    </div>
  );
}
