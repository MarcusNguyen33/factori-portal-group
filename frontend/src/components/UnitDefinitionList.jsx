import React from "react";
import styles from "./ItemList.module.css";

export default function UnitDefinitionList({ items, loading, error }) {
  if (loading) {
    return <p className={styles.message}>Loading unit definitions...</p>;
  }

  if (error) {
    return (
      <p className={`${styles.message} ${styles.error}`}>
        Error fetching unit definitions: {error.message || "Unknown error"}
      </p>
    );
  }

  if (!items || items.length === 0) {
    return <p className={styles.message}>No unit definitions found.</p>;
  }

  return (
    <div className={styles.itemListContainer}>
      <h2>Unit Definition List</h2>
      <ul className={styles.list}>
        {items.map(({ unit_definition, unit_type }) => (
          <li key={unit_definition.unit_id} className={styles.listItem}>
            Unit Name: {unit_definition.unit_name} Type: {unit_type.type_name}
          </li>
        ))}
      </ul>
    </div>
  );
}
