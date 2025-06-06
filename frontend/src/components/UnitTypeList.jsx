import React from "react";
import styles from "./ItemList.module.css";

export default function UnitTypeList({ items, loading, error }) {
  if (loading) {
    return <p className={styles.message}>Loading unit types...</p>;
  }

  if (error) {
    return (
      <p className={`${styles.message} ${styles.error}`}>
        Error fetching unit types: {error.message || "Unknown error"}
      </p>
    );
  }

  if (!items || items.length === 0) {
    return <p className={styles.message}>No unit types found.</p>;
  }

  return (
    <div className={styles.itemListContainer}>
      <h2>Unit Type List</h2>
      <ul className={styles.list}>
        {items.map((item) => (
          <li key={item.type_id} className={styles.listItem}>
            Type Name: {item.type_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
