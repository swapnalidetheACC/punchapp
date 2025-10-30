import React, { useState, useEffect } from "react";

function App() {
  const [logs, setLogs] = useState(() => {
    const saved = localStorage.getItem("punchLogs");
    return saved ? JSON.parse(saved) : [];
  });
  const [status, setStatus] = useState("none");
  const [manualDate, setManualDate] = useState("");
  const [manualTime, setManualTime] = useState("");
  const [note, setNote] = useState("");
  const [projectCode, setProjectCode] = useState("");
  const [onBreak, setOnBreak] = useState(false);

  useEffect(() => {
    localStorage.setItem("punchLogs", JSON.stringify(logs));
  }, [logs]);

  const getCurrentTime = () => new Date().toLocaleString();

  const addLog = (type, manual = false) => {
    const time = manual
      ? `${manualDate} ${manualTime}`
      : getCurrentTime();
    const newLog = {
      type,
      time,
      note,
      projectCode,
    };
    setLogs((prev) => [...prev, newLog]);
    setNote("");
    setProjectCode("");
  };

  const calculateWorkSummary = () => {
    let punchInTimes = logs.filter((log) => log.type === "Punch In").map((l) => new Date(l.time));
    let punchOutTimes = logs.filter((log) => log.type === "Punch Out").map((l) => new Date(l.time));

    let totalMs = 0;
    for (let i = 0; i < Math.min(punchInTimes.length, punchOutTimes.length); i++) {
      totalMs += punchOutTimes[i] - punchInTimes[i];
    }

    const totalHours = (totalMs / (1000 * 60 * 60)).toFixed(2);
    const breakCount = logs.filter((log) => log.type.includes("Break")).length / 2;
    return { totalHours, breakCount };
  };

  const { totalHours, breakCount } = calculateWorkSummary();

  const handleBreakToggle = () => {
    if (onBreak) {
      addLog("End Break");
      setOnBreak(false);
    } else {
      addLog("Start Break");
      setOnBreak(true);
    }
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
        Track your Punch In, Punch Out, Breaks, and Project Work
      </p>

      {/* Dashboard Section */}
      <div
        style={{
          backgroundColor: "#fff",
          width: "85%",
          maxWidth: "700px",
          margin: "0 auto 25px auto",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "20px",
        }}
      >
        <h3 style={{ color: "#007bff" }}>📊 Dashboard Overview</h3>
        <p>Total Work Hours: <strong>{totalHours}</strong> hrs</p>
        <p>Breaks Taken: <strong>{breakCount}</strong></p>
        <p>Entries Logged: <strong>{logs.length}</strong></p>
      </div>

      {/* Notes and Project Input */}
      <div
        style={{
          backgroundColor: "#fff",
          width: "85%",
          maxWidth: "700px",
          margin: "0 auto 25px auto",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "20px",
          textAlign: "left",
        }}
      >
        <h3 style={{ color: "#444" }}>📝 Add Details</h3>
        <label>Project Code: </label>
        <input
          type="text"
          placeholder="Enter project code"
          value={projectCode}
          onChange={(e) => setProjectCode(e.target.value)}
          style={{
            marginLeft: "10px",
            marginBottom: "10px",
            padding: "6px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            width: "60%",
          }}
        />
        <br />
        <label>Notes: </label>
        <textarea
          placeholder="Enter notes here..."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows="2"
          style={{
            width: "90%",
            marginTop: "5px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            padding: "8px",
          }}
        ></textarea>
      </div>

      {/* Manual Entry Section */}
      <div
        style={{
          backgroundColor: "#fff",
          width: "85%",
          maxWidth: "700px",
          margin: "0 auto 25px auto",
          borderRadius: "10px",
          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          padding: "20px",
        }}
      >
        <h3 style={{ color: "#444" }}>🗓 Manual Entry</h3>
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

      {/* Action Buttons */}
      <div style={{ marginBottom: "30px" }}>
        <button
          onClick={() => addLog("Punch In")}
          style={{
            backgroundColor: "#28a745",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          Punch In
        </button>

        <button
          onClick={() => addLog("Punch Out")}
          style={{
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            marginRight: "10px",
            cursor: "pointer",
          }}
        >
          Punch Out
        </button>

        <button
          onClick={handleBreakToggle}
          style={{
            backgroundColor: onBreak ? "#ffc107" : "#17a2b8",
            color: "white",
            border: "none",
            padding: "12px 24px",
            borderRadius: "8px",
            cursor: "pointer",
          }}
        >
          {onBreak ? "End Break" : "Start Break"}
        </button>
      </div>

      {/* Logs Section */}
      <div
        style={{
          margin: "0 auto",
          width: "85%",
          maxWidth: "700px",
          textAlign: "left",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ color: "#007bff", marginBottom: "10px" }}>🕒 Shift History</h3>
        {logs.length === 0 ? (
          <p style={{ color: "#777" }}>No records yet.</p>
        ) : (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ backgroundColor: "#f0f0f0" }}>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Type</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Time</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Project</th>
                <th style={{ padding: "8px", border: "1px solid #ddd" }}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, index) => (
                <tr key={index}>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{log.type}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{log.time}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{log.projectCode || "-"}</td>
                  <td style={{ padding: "8px", border: "1px solid #ddd" }}>{log.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
