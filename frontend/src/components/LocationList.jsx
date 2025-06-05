import React from "react";
import styles from "./XList.module.css";

export default function LocationList({ locations, loading, error }) {
  if (loading) {
    return <p className={styles.message}>Loading locations...</p>;
  }

  if (error) {
    return (
      <p className={`${styles.message} ${styles.error}`}>
        Error fetching locations: {error.message || "Unknown error"}
      </p>
    );
  }

  if (!locations || locations.length === 0) {
    return <p className={styles.message}>No location found.</p>;
  }

  return (
    <div className={styles.listContainer}>
      <h2>Location List</h2>
      <ul className={styles.list}>
        {locations.map((location) => (
          <li key={location.location_id} className={styles.listLocation}>
            <div className={styles.XName}>
              {location.location_name} (ID: {location.location_id})
            </div>
            <div className={styles.XDescription}>
              {location.location_description || "No description"}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
