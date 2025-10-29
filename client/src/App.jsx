import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [punches, setPunches] = useState([]);
  const [greeting, setGreeting] = useState("");

  // 🕒 auto-update time every second
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      // Convert to local datetime format accepted by input
      const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setTime(localISOTime);

      // Greeting logic
      const hours = now.getHours();
      if (hours < 12) setGreeting("Good Morning, Swapnali ☀️");
      else if (hours < 18) setGreeting("Good Afternoon, Swapnali 🌤️");
      else setGreeting("Good Evening, Swapnali 🌙");
    };

    updateTime(); // initial load
    const interval = setInterval(updateTime, 1000); // update every second
    return () => clearInterval(interval);
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
