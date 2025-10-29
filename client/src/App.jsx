import React, { useState, useEffect } from 'react';

export default function App() {
  const [time, setTime] = useState('');
  const [note, setNote] = useState('');
  const [punches, setPunches] = useState([]);

  useEffect(() => {
    const now = new Date();
    const local = now.toISOString().slice(0,16);
    setTime(local);
    loadPunches();
  }, []);

  async function loadPunches() {
    const res = await fetch('/api/punches');
    const data = await res.json();
    if (data.success) setPunches(data.punches);
  }

  async function punchIn() {
    const iso = new Date(time).toISOString();
    const offset = new Date().getTimezoneOffset();
    await fetch('/api/punch', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ timestamp: iso, timezoneOffset: offset, note })
    });
    setNote('');
    loadPunches();
  }

  return (
    <div style={{ fontFamily: 'sans-serif', maxWidth: 600, margin: '2rem auto' }}>
      <h1>Punch Clock</h1>
      <div>
        <label>Time:</label>
        <input type="datetime-local" value={time} onChange={e=>setTime(e.target.value)} />
      </div>
      <div>
        <label>Note:</label>
        <input type="text" value={note} onChange={e=>setNote(e.target.value)} />
      </div>
      <button onClick={punchIn}>Punch In</button>
      <hr/>
      <h2>Past Punches</h2>
      <ul>
        {punches.map(p => (
          <li key={p.id}>
            {new Date(p.timestamp).toLocaleString()} — {p.note || '-'}
          </li>
        ))}
      </ul>
    </div>
  );
}
