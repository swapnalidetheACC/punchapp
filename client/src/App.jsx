import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [time, setTime] = useState("");
  const [note, setNote] = useState("");
  const [punches, setPunches] = useState([]);
  const [greeting, setGreeting] = useState("");
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Auto-time updater
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const localISOTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
      setTime(localISOTime);
      const hours = now.getHours();
      if (hours < 12) setGreeting("Good Morning ☀️");
      else if (hours < 18) setGreeting("Good Afternoon 🌤️");
      else setGreeting("Good Evening 🌙");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
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

  const handleLogin = async () => {
    try {
      const res = await fetch("https://punchapp-<your-render-name>.onrender.com/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) throw new Error("Invalid credentials");

      const data = await res.json();
      localStorage.setItem("token", data.token);
      setToken(data.token);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  if (!token) {
    return (
      <div className="login-container">
        <h1>🔐 Punch Clock Login</h1>
        {error && <p className="error">{error}</p>}
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="header">
        <h1>⏰ Punch Clock</h1>
        <button className="logout" onClick={handleLogout}>Logout</button>
      </div>
      <h2>{greeting}</h2>

      <div className="card">
        <label>Time:</label>
        <input type="datetime-local" value={time} onChange={(e) => setTime(e.target.value)} />
        <label>Note:</label>
        <input type="text" value={note} onChange={(e) => setNote(e.target.value)} />
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
        <h3>Past Punches</h3>
        <ul>
          {punches.map((p, i) => (
            <li key={i}>
              {p.time} — {p.type} ({p.note})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
