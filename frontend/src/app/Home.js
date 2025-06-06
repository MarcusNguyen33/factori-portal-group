import React, { useState } from "react";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";

///the home page component
export default function HomePage() {
  const [view, setView] = useState("default"); // Tracks current display state

  const dataCategories = [
    {
      name: "Items",
      description: "Stores all available product details and attributes.",
    },
    {
      name: "Inventory",
      description:
        "Estimates the current inventory count for each item at each location based on the sum of matching inventory_transactions that are dated later than the last matching inventory_record. This page allows you to fetch all inventory and it combines those entries with associated data about relevant transactions, location, and optional supplier",
    },
    {
      name: "Inventory Transactions",
      description:
        "Records every time a quantity of items is added to or removed from a location. Less accurate than actual inventory counts (recorded in Inventory Records) but easier to keep track of for operators. Displays all existing transactions in order of most to least recent and allows you to add a new transaction for an existing item and location",
    },
    {
      name: "Inventory Records",
      description: "Historical logs of stock changes and audit details.",
    },
    {
      name: "Suppliers",
      description: "Manages supplier relationships and contact information.",
    },
    {
      name: "Locations",
      description: "Defines warehouse and storage areas within the system.",
    },
  ];

  const creditsList = [
    {
      name: "Arshdeep Singh Saran",
      worked_on:
        "Creating the schema. Researching and creating the frameworks we use for our project",
    },
    {
      name: "Kyler Lumpkin",
      worked_on:
        "Creating the schema. Expanding out the backend and frontend to fill most of the existing sql tables",
    },
    { name: "Marcus Nguyen", worked_on: "" },
    { name: "Evan Lei", worked_on: "" },
    { name: "Jafar Al-Saheli", worked_on: "" },
  ];

  return (
    <div
      style={{
        padding: "40px",
        textAlign: "center",
        maxWidth: "800px",
        margin: "auto",
      }}
    >
      <h1 style={{ fontSize: "2rem", marginBottom: "20px" }}>
        Welcome to Factori Management System
      </h1>
      <p style={{ fontSize: "1.2rem", color: "#555" }}>
        Streamline inventory tracking, transaction management, and supplier
        coordination with an intuitive interface.
      </p>

      <div
        style={{
          marginTop: "30px",
          display: "flex",
          gap: "15px",
          justifyContent: "center",
        }}
      >
        <Button onClick={() => setView("data")}>Get Started</Button>
        <Button onClick={() => setView("credits")}>Credits</Button>
      </div>

      <div style={{ marginTop: "40px" }}>
        {view === "default" && (
          <>
            <Card style={{ padding: "20px", textAlign: "left" }}>
              <h2>About the Project</h2>
              <p>
                This system provides businesses with real-time visibility into
                inventory records, transaction tracking, and supplier
                integrations—all in one unified platform.
              </p>
            </Card>

            <Card
              style={{ marginTop: "20px", padding: "20px", textAlign: "left" }}
            >
              <h2>Key Features</h2>
              <ul>
                <li>Real-time inventory monitoring</li>
                <li>Automated stock updates</li>
                <li>Comprehensive transaction history</li>
                <li>Supplier management & data integration</li>
              </ul>
            </Card>

            <Card
              style={{ marginTop: "20px", padding: "20px", textAlign: "left" }}
            >
              <h2>Built With</h2>
              <ul>
                <li>FastAPI (Backend)</li>
                <li>React & Bootstrap (Frontend)</li>
                <li>SQLModel (Database)</li>
              </ul>
            </Card>
          </>
        )}

        {view === "data" && (
          <Card style={{ padding: "20px", textAlign: "left" }}>
            <h2>System Data Categories</h2>
            <ul>
              {dataCategories.map((category) => (
                <li key={category.name}>
                  <strong>{category.name}</strong>: {category.description}
                </li>
              ))}
            </ul>
          </Card>
        )}

        {view === "credits" && (
          <Card style={{ padding: "20px", textAlign: "left" }}>
            <h2>Credits</h2>
            <ul>
              {creditsList.map(({ name, worked_on }) => (
                <li key={name}>
                  {name}: {worked_on}
                </li>
              ))}
            </ul>
          </Card>
        )}
      </div>
    </div>
  );
}
