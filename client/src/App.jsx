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
          backgroundColor: "#fff",
          margin: "0 auto",
          width: "85%",
          maxWidth: "600px",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "20px",
          marginBottom: "30px",
        }}
      >
        <h3 style={{ color: "#444", marginBottom: "10px" }}>🗓 Manual Entry</h3>
        <p style={{ fontSize: "14px", color: "#666" }}>
          Select date & time and choose action manually
        </p>
        <div style={{ marginBottom: "15px" }}>
          <input
            type="date"
            value={manualDate}
            onChange={(e) => setManualDate(e.target.value)}
            style={{
              marginRight: "10px",
              padding: "6px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
          <input
            type="time"
            value={manualTime}
            onChange={(e) => setManualTime(e.target.value)}
            style={{
              padding: "6px",
              borderRadius: "6px",
              border: "1px solid #ccc",
            }}
          />
        </div>
        <div>
          <button
            onClick={() => handlePunchIn(true)}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              marginRight: "8px",
              cursor: "pointer",
            }}
          >
            Manual Punch In
          </button>
          <button
            onClick={() => handlePunchOut(true)}
            style={{
              backgroundColor: "#dc3545",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              marginRight: "8px",
              cursor: "pointer",
            }}
          >
            Manual Punch Out
          </button>
          <button
            onClick={() => handleCheckOut(true)}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              cursor: "pointer",
            }}
          >
            Manual Check Out
          </button>
        </div>
      </div>

      {/* Logs Section */}
      <div
        style={{
          margin: "0 auto",
          width: "85%",
          maxWidth: "600px",
          textAlign: "left",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ color: "#007bff", marginBottom: "10px" }}>🕒 Punch Logs</h3>
        {logs.length === 0 ? (
          <p style={{ color: "#777" }}>No punch records yet.</p>
        ) : (
          <ul style={{ listStyleType: "none", paddingLeft: "0" }}>
            {logs.map((log, index) => (
              <li key={index} style={{ marginBottom: "8px", color: "#333" }}>
                {log}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
