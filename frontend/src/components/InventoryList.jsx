import React from "react";
import styles from "./XList.module.css";
import InventoryEntry from "./InventoryEntry.jsx";

export default function InventoryList({ inventory, loading, error }) {
  if (loading) {
    return <p className={styles.message}>Loading inventory...</p>;
  }

  if (error) {
    return (
      <p className={`${styles.message} ${styles.error}`}>
        Error fetching inventory: {error.message || "Unknown error"}
      </p>
    );
  }

  if (!inventory || inventory.length === 0) {
    return <p className={styles.message}>No inventory found.</p>;
  }

  return (
    <div className={styles.listContainer}>
      <h2>Inventory List</h2>
      <ul className={styles.list}>
        {inventory.map((inv, item, location) => (
          <InventoryEntry inv={inv} item={item} location={location} />
        ))}
      </ul>
    </div>
  );
}
