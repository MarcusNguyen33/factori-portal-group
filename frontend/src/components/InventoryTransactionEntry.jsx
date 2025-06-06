import React, { useState } from "react";
import styles from "./XList.module.css";

export default function InventoryTransactionEntry({ itils }) {
  const [expanded, setExpanded] = useState(false);

  console.log("InventoryTransactionEntry(): ", itils);
  const { transaction, item, location, supplier } = itils;

  console.log(
    "InventoryTransactionEntry(): ",
    "transaction: ",
    transaction,
    "item: ",
    item,
    "location: ",
    location,
    "supplier: ",
    supplier,
  );
  return (
    <li
      key={transaction.transaction_id}
      className={styles.listLocation}
      onClick={() => {
        setExpanded(!expanded);
      }}
    >
      <div className={styles.XName}>
        {item.item_name} (ID: {item.item_id})
      </div>
      <div className={`${styles.location} ${styles.shiftedRight}`}>
        {location.location_name || "No name"} (ID: {location.location_id})
      </div>
      <div className={`${styles.supplier} ${styles.shiftedRight}`}>
        {supplier ? supplier.supplier_name : "No Supplier"}
      </div>
      <div className={`${styles.quantity}`}>
        Quantity:{" "}
        {transaction.quantity > 0
          ? `+${transaction.quantity}`
          : transaction.quantity || 0}{" "}
        On: {new Date(transaction.transaction_date).toLocaleString()}
      </div>

      {expanded == true && (
        <div className={`${styles.XDescription}`}>
          Description: {transaction.transaction_description}
        </div>
      )}
    </li>
  );
}
