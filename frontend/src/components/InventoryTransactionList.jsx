import React from "react";
import styles from "./XList.module.css";
import InventoryTransactionEntry from "./InventoryTransactionEntry.jsx";

export default function InventoryTransactionList({
  inventory,
  loading,
  error,
}) {
  if (loading) {
    return <p className={styles.message}>Loading inventory transactions...</p>;
  }
  console.log(`InventoryTransactionList(`, inventory, `)`);
  if (error) {
    return (
      <p className={`${styles.message} ${styles.error}`}>
        Error fetching inventory transactions:{" "}
        {error.message || "Unknown error"}
      </p>
    );
  }

  if (!inventory || inventory.length === 0) {
    return <p className={styles.message}>No inventory transactions found.</p>;
  }

  return (
    <div className={styles.listContainer}>
      <h2>Inventory Transaction List</h2>
      <ul className={styles.list}>
        {inventory.map((inv) => (
          <InventoryTransactionEntry
            key={inv.transaction.transaction_id}
            itils={inv}
          />
        ))}
      </ul>
    </div>
  );
}
