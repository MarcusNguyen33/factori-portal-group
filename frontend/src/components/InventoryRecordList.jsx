import React from "react";
import styles from "./XList.module.css";
import InventoryRecordEntry from "./InventoryRecordEntry.jsx";

export default function InventoryRecordList({ inventory, loading, error }) {
  if (loading) {
    return <p className={styles.message}>Loading inventory records...</p>;
  }
  if (error) {
    return (
      <p className={`${styles.message} ${styles.error}`}>
        Error fetching inventory records: {error.message || "Unknown error"}
      </p>
    );
  }

  if (!inventory || inventory.length === 0) {
    return <p className={styles.message}>No inventory records found.</p>;
  }

  return (
    <div className={styles.listContainer}>
      <h2>Inventory Record List</h2>
      <ul className={styles.list}>
        {inventory.map(({ inventory_record, item, location }) => (
          <InventoryRecordEntry
            key={inventory_record.record_id}
            inventory_record={inventory_record}
            item={item}
            location={location}
          />
        ))}
      </ul>
    </div>
  );
}
