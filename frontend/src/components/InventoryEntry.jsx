import React from "react";
import styles from "./XList.module.css";

export default function InventoryEntry({ inv, item, location }) {
  return (
    <li key={inv.inventory_id} className={styles.listLocation}>
      <div className={styles.XName}>
        {item.item_name} (ID: {item.item_id})
      </div>
      <div className={styles.XName}>
        {location.location_name || "No name"} (ID: {location.location_id})
      </div>
      <div className={styles.XDescription}>
        Quantity: {inv.quantity || 0} (ID: {inv.inventory_id})
      </div>
    </li>
  );
}
