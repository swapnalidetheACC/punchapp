import React, { useState } from "react";

function App() {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState("none");
  const [manualDate, setManualDate] = useState("");
  const [manualTime, setManualTime] = useState("");

  const getCurrentTime = () => {
    const time = new Date().toLocaleString();
    return time;
  };

  const handlePunchIn = (manual = false) => {
    const time = manual
      ? `${manualDate} ${manualTime}`
      : getCurrentTime();
    setLogs((prev) => [...prev, `✅ Punched In at ${time}`]);
    setStatus("in");
  };

  const handlePunchOut = (manual = false) => {
    const time = manual
      ? `${manualDate} ${manualTime}`
      : getCurrentTime();
    setLogs((prev) => [...prev, `⏰ Punched Out at ${time}`]);
    setStatus("out");
  };

  const handleCheckOut = (manual = false) => {
    const time = manual
      ? `${manualDate} ${manualTime}`
      : getCurrentTime();
    setLogs((prev) => [...prev, `🚪 Checked Out at ${time}`]);
    setStatus("checkout");
  };

  return (
    <div
      style={{
        textAlign: "center",
        fontFamily: "Segoe UI, Arial, sans-serif",
        backgroundColor: "#f4f6f8",
        minHeight: "100vh",
        paddingTop: "40px",
      }}
    >
      <h1 style={{ color: "#333", fontSize: "32px" }}>👋 Welcome to Punch Clock</h1>
      <p style={{ color: "#555", marginBottom: "20px", fontSize: "18px" }}>
        Track your Punch In, Punch Out, and Check Out times below
      </p>

      {/* Buttons Section */}
      <div style={{ marginBottom: "30px" }}>
        <button
          onClick={() => handlePunchIn(false)}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Punch In
        </button>

        <button
          onClick={() => handlePunchOut(false)}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
            marginRight: "10px",
          }}
        >
          Punch Out
        </button>

        <button
          onClick={() => handleCheckOut(false)}
          style={{
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            fontSize: "16px",
            cursor: "pointer",
          }}
        >
          Check Out
        </button>
      </div>

      {/* Manual Entry Section */}
      <div
        style={{
          back
