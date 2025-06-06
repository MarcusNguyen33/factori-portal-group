import React, { useState, useEffect } from "react";
import styles from "./ItemList.module.css";

export default function ItemList({ items, loading, error, onSelectItem }) {
  if (loading) {
    return <p className={styles.message}>Loading items...</p>;
  }

  if (error) {
    return (
      <p className={`${styles.message} ${styles.error}`}>
        Error fetching items: {error.message || "Unknown error"}
      </p>
    );
  }

  const [selectS, setSelectS] = useState(null);
  useEffect(() => {
    if (selectS) {
      onSelectItem(selectS); // Updates parent AFTER render
    }
  }, [selectS]);

  if (!items || items.length === 0) {
    return <p className={styles.message}>No items found.</p>;
  }

  return (
    <div className={styles.itemListContainer}>
      <h2>Item List</h2>
      <ul className={styles.list}>
        {items.map(({ item, attributes }) => (
          <li
            key={item.item_id}
            className={styles.listItem}
            onClick={() => setSelectS({ item: item, attributes: attributes })}
          >
            <div className={styles.itemName}>
              {item.item_name} (ID: {item.item_id})
            </div>
            <div className={styles.itemDescription}>
              {item.description || "No description"}
            </div>
            <div className={styles.itemDates}>
              Created: {new Date(item.created_at).toLocaleDateString()} |
              Updated: {new Date(item.updated_at).toLocaleDateString()}
            </div>
            <div>
              <ul className={styles.list}>
                {attributes.map(
                  ({
                    item_attribute,
                    attribute_definition,
                    unit_definition,
                    unit_type,
                  }) => (
                    <li
                      key={item_attribute.attribute_id}
                      className={styles.listItem}
                    >
                      {attribute_definition.attribute_name} (
                      {attribute_definition.data_type}, {unit_type.type_name}):{" "}
                      {item_attribute.attribute_value}{" "}
                      {unit_definition.unit_name}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
