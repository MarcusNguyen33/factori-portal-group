import React from "react";
import Card from "@/components/Card/Card";
import Button from "@/components/Button/Button";

export default function Generic() {
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
        Welcome to Factory Management System
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
        <Button>Get Started</Button>
        <Button>Learn More</Button>
      </div>

      <Card style={{ marginTop: "40px", padding: "20px", textAlign: "left" }}>
        <h2>About the Project</h2>
        <p>
          This system provides businesses with real-time visibility into
          inventory records, transaction tracking, and supplier integrations—all
          in one unified platform.
        </p>
      </Card>

      <Card style={{ marginTop: "20px", padding: "20px", textAlign: "left" }}>
        <h2>Key Features</h2>
        <ul>
          <li>Real-time inventory monitoring</li>
          <li>Automated stock updates</li>
          <li>Comprehensive transaction history</li>
          <li>Supplier management & data integration</li>
        </ul>
      </Card>

      <Card style={{ marginTop: "20px", padding: "20px", textAlign: "left" }}>
        <h2>Built With</h2>
        <ul>
          <li>FastAPI (Backend)</li>
          <li>React & Bootstrap (Frontend)</li>
          <li>SQLModel (Database)</li>
        </ul>
      </Card>
    </div>
  );
}
