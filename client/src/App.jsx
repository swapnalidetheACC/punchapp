import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [time, setTime] = useState(new Date().toISOString().slice(0, 16));
  const [note, setNote] = useState("");
  const [punches, setPunches] = useState([]);

  // dynamic greeting
  const [greeting, setGreeting] = useState("");

  useEffect(() => {
    const hours = new Date().getHours();
    if (hours < 12) setGreeting("Good Morning, Swapnali ☀️");
    else if (hours < 18) setGreeting("Good Afternoon, Swapnali 🌤️");
    else setGreeting("Good Evening, Swapnali 🌙");
  }, []);

  const handlePunch = (type) => {
    const newPunch = {
      time: new Date(time).toLocaleString(),
      type: type,
      note: note || "-",
    };
    setPunches([newPunch, ...punches]);
    setNote("");
  };

  return (
    <div className="app-container">
      <h1 className="title">⏰ Punch Clock</h1>
      <h2 className="greeting">{greeting}</h2>

      <div className="card">
        <label>
          <strong>Time:</strong>
        </label>
        <input
          type="datetime-local"
          value={time}
          onChange={(e) => setTime(e.target.value)}
        />
        <label>
          <strong>Note:</strong>
        </label>
        <input
          type="text"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Optional note..."
        />
        <div className="button-group">
          <button className="punch-in" onClick={() => handlePunch("Punch In")}>
            Punch In
          </button>
          <button className="punch-out" onClick={() => handlePunch("Punch Out")}>
            Punch Out
          </button>
        </div>
      </div>

      <div className="history-card">
        <h3>📜 Past Punches</h3>
        <ul>
          {punches.map((p, i) => (
            <li key={i}>
              <strong>{p.time}</strong> — {p.type} ({p.note})
            </li>
          ))}
        </ul>
      </div>

      <footer>© {new Date().getFullYear()} PunchApp | Made with 💙 by Swapnali</footer>
    </div>
  );
}

export default App;
