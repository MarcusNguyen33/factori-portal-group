import React, { useState } from "react";
import styles from "./XList.module.css";

export default function InventoryEntry({
  inv,
  item,
  location,
  latest_record,
  transactions,
}) {
  const [expanded, setExpanded] = useState(false);
  const [transactionsExpanded, setTransactionsExpanded] = useState(false);

  const onClicked = () => {
    setExpanded(!expanded);
  };

  console.log(
    "InventoryEntry(): ",
    "inv: ",
    inv,
    " item: ",
    item,
    " location: ",
    location,
    " latest_record: ",
    latest_record,
    " transactions: ",
    transactions,
  );
  return (
    <li
      key={inv.inventory_id}
      className={styles.listLocation}
      onClick={onClicked}
    >
      <div className={styles.XName}>
        {item.item_name} (ID: {item.item_id})
      </div>
      <div className={`${styles.location} ${styles.shiftedRight}`}>
        {location.location_name || "No name"} (ID: {location.location_id})
      </div>
      <div className={`${styles.quantity}`}>
        Quantity: {inv.quantity || 0} (Quantity at Last Count:{" "}
        {latest_record.quantity} on:{" "}
        {new Date(latest_record.date_of_count).toLocaleString()})
      </div>
      {expanded == true && (
        <ul className={styles.transactionList}>
          {transactions.map(({ transaction, supplier }) => (
            <li
              key={transaction.transaction_id}
              className={`${styles.transactionItem} ${styles.shiftedRight}`}
            >
              <div className={styles.transactionTop}>
                <span className={styles.quantity}>{transaction.quantity}</span>
                <span className={styles.transactionDate}>
                  {new Date(transaction.transaction_date).toLocaleString()}
                </span>
              </div>
              <div className={styles.transactionSupplier}>
                Supplier:{" "}
                {supplier ? supplier.supplier_name || "Unknown" : "Unknown"}
              </div>
              <div className={styles.transactionDescription}>
                {transaction.transaction_description || "No Description"}
              </div>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
}
