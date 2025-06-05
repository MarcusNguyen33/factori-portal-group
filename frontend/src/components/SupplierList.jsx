import React from "react";
import styles from "./XList.module.css";

export default function SupplierList({ suppliers, loading, error }) {
  if (loading) {
    return <p className={styles.message}>Loading suppliers...</p>;
  }

  if (error) {
    return (
      <p className={`${styles.message} ${styles.error}`}>
        Error fetching suppliers: {error.message || "Unknown error"}
      </p>
    );
  }

  if (!suppliers || suppliers.length === 0) {
    return <p className={styles.message}>No suppliers found.</p>;
  }

  return (
    <div className={styles.listContainer}>
      <h2>Supplier List</h2>
      <ul className={styles.list}>
        {suppliers.map((supplier) => (
          <li key={supplier.supplier_id} className={styles.listLocation}>
            <div className={styles.XName}>
              {supplier.supplier_name} (ID: {supplier.supplier_id})
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
