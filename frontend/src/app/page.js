"use client";

import React, { useState } from "react";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";
import ItemList from "@/components/ItemList";
import * as api from "@/services/api";

import HomePage from "./Home.js";
import Items from "./Items.js";
import Inventory from "./Inventory.js";
import InventoryRecords from "./InventoryRecords.js";
import InventoryTransactions from "./InventoryTransactions.js";
import Locations from "./Locations.js";

/// renders over everything to give us the navigation tabs
export default function Home() {
  const [activeTab, setActiveTab] = useState("Home");

  const tabs = [
    "Home",
    "Items",
    "Inventory",
    "Inventory Transactions",
    "Inventory Records",
    "Suppliers",
    "Locations",
  ];

  const renderComponent = () => {
    switch (activeTab) {
      case "Home":
        return <HomePage />;
      case "Items":
        return <Items />;
      case "Inventory":
        return <Inventory />;
      case "Inventory Transactions":
        return <InventoryTransactions />;
      case "Inventory Records":
        return <InventoryRecords />;
      case "Suppliers":
        return (
          <div
            dangerouslySetInnerHTML={{
              __html:
                "<iframe src='/suppliers.html' style='width:100%; height:100vh; border:none;'></iframe>",
            }}
          />
        ); //<Suppliers />;
      case "Locations":
        return <Locations />;
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          background: "#ccc",
          padding: "10px",
        }}
      >
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}>
            {tab}
          </button>
        ))}
      </div>
      <div style={{ flex: 1 }}>{renderComponent()}</div>
    </div>
  );
}
