import React, { useState } from "react";

function App() {
  const [logs, setLogs] = useState([]);
  const [punchedIn, setPunchedIn] = useState(false);

  const handlePunchIn = () => {
    const time = new Date().toLocaleString();
    setLogs((prev) => [...prev, `✅ Punched In at ${time}`]);
    setPunchedIn(true);
  };

  const handlePunchOut = () => {
    const time = new Date().toLocaleString();
    setLogs((prev) => [...prev, `⏰ Punched Out at ${time}`]);
    setPunchedIn(false);
  };

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "Segoe UI, Arial, sans-serif",
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        paddingTop: "60px",
      }}
    >
      <h1 style={{ color: "#333", fontSize: "32px" }}>👋 Welcome to Punch Clock</h1>
      <p style={{ color: "#555", marginBottom: "30px", fontSize: "18px" }}>
        Track your Punch In and Punch Out times below
      </p>

      <div style={{ marginBottom: "30px" }}>
        {!punchedIn ? (
          <button
            onClick={handlePunchIn}
            style={{
              backgroundColor: "#28a745",
