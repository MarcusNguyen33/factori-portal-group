import React, { useState } from "react";
import styles from "./XList.module.css";

export default function InventoryRecordEntry({
  inventory_record,
  item,
  location,
}) {
  return (
    <li key={inventory_record.record_id} className={styles.listLocation}>
      <div className={styles.XName}>
        {item.item_name} (ID: {item.item_id})
      </div>
      <div className={`${styles.location} ${styles.shiftedRight}`}>
        {location.location_name || "No name"} (ID: {location.location_id})
      </div>
      <div className={`${styles.quantity}`}>
        Quantity: {inventory_record.quantity} On:{" "}
        {new Date(inventory_record.date_of_count).toLocaleString()}
      </div>
    </li>
  );
}
