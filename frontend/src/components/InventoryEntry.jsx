import React from "react";
import styles from "./XList.module.css";

export default function InventoryEntry({ inv, item, location }) {
  console.log(
    "InventoryEntry(): ",
    "inv: ",
    inv,
    " item: ",
    item,
    " location: ",
    location,
  );
  return (
    <li key={inv.inventory_id} className={styles.listLocation}>
      <div className={styles.XName}>
        {item.item_name} (ID: {item.item_id})
      </div>
      <div className={`${styles.location} ${styles.shiftedRight}`}>
        {location.location_name || "No name"} (ID: {location.location_id})
      </div>
      <div className={`${styles.quantity} ${styles.shiftedRight}`}>
        Quantity: {inv.quantity || 0}
      </div>
    </li>
  );
}
