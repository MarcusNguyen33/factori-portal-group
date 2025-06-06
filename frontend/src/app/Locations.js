import React, { useState } from "react";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";
import LocationList from "@/components/LocationList";
import * as api from "@/services/api";

/// handles displaying and giving an interface to add new locations
export default function Locations() {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [adding, setAdding] = useState(false);
  const [nameToAdd, setNameToAdd] = useState("");
  const [descriptionToAdd, setDescriptionToAdd] = useState("");
  const [newLocationWaiting, setNewLocationLoading] = useState(false);
  const [newLocationError, setNewLocationError] = useState(null);

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

  const handleInsertNewLocation = async () => {
    console.log(
      "handleInsertNewLocation() called: ",
      adding,
      nameToAdd,
      descriptionToAdd,
      newLocationWaiting,
      newLocationError,
    );
    if (!nameToAdd.trim()) {
      setNewLocationError(
        new Error("Please enter a name for the new location"),
      );
      return;
    }

    setNewLocationLoading(true);
    setNewLocationError(null);

    try {
      const response = await api.addLocation(nameToAdd, descriptionToAdd);
      setNameToAdd("");
      setDescriptionToAdd("");
    } catch (err) {
      setNewLocationError(err);
      console.error("Error trying to insert new location: ", err);
    } finally {
      setNewLocationLoading(false);
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
          <h1>Locations Portal</h1>
          <Button onClick={handleFetchAllLocations}>Fetch All Locations</Button>
          <Button onClick={() => setAdding(!adding)}>
            Create New Location
          </Button>
        </div>
        {adding == true && (
          <div>
            <input
              type="text"
              value={nameToAdd}
              onChange={(e) => setNameToAdd(e.target.value)}
              placeholder="Enter Name of New Location"
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
              placeholder="Enter Description of New Location"
              style={{
                padding: "8px",
                marginRight: "10px",
                borderRadius: "4px",
                border: "1px solid #ccc",
              }}
            />
            <Button onClick={handleInsertNewLocation}>Insert</Button>
            {newLocationWaiting && <div>Waiting For Response</div>}
            {!newLocationWaiting && newLocationError && (
              <p style={{ color: "red" }}>
                Error adding new Location: {newLocationError.message}
              </p>
            )}
          </div>
        )}
        {(locations.length > 0 || loading || error) && !singleLocation && (
          <div style={{ marginTop: "20px", width: "90%" }}>
            <LocationList
              locations={locations}
              loading={loading}
              error={error}
            />
          </div>
        )}
      </Card>
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
