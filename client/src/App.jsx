import React, { useEffect, useState } from 'react';

function formatLocal(isoString) {
  try {
    const d = new Date(isoString);
    return d.toLocaleString();
  } catch {
    return isoString;
  }
}

export default function App() {
  const [punches, setPunches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState('auto'); // 'auto' or 'manual'
  const [manualTime, setManualTime] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function fetchPunches() {
    setLoading(true);
    try {
      const res = await fetch('/api/punches');
      const data = await res.json();
      setPunches(data);
    } catch (err) {
      console.error(err);
      setError('Failed to load punches.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPunches();
  }, []);

  function getAutoTimestamp() {
    const now = new Date();
    return now.toISOString();
  }

  function getLocalOffsetMinutes() {
    // getTimezoneOffset() returns number of minutes to add to local time to get UTC (so IST => -330)
    // We store localOffsetMinutes as -getTimezoneOffset() so positive for IST (330)
    return -new Date().getTimezoneOffset();
  }

  async function punchIn() {
    setSaving(true);
    setError(null);
    try {
      let timestamp;
      let source;
      let localOffsetMinutes = null;

      if (mode === 'auto') {
        timestamp = getAutoTimestamp();
        source = 'auto';
        localOffsetMinutes = getLocalOffsetMinutes();
      } else {
        if (!manualTime) {
          setError('Please enter a time.');
          setSaving(false);
          return;
        }
        // manualTime is in format "YYYY-MM-DDTHH:MM" (datetime-local)
        // Construct a Date -> ISO string (interpreted as local)
        timestamp = new Date(manualTime).toISOString();
        source = 'manual';
        localOffsetMinutes = getLocalOffsetMinutes(); // still capture the local offset
      }

      const payload = { timestamp, source, localOffsetMinutes };
      const res = await fetch('/api/punch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(errBody.error || 'Failed to save punch');
      }
      const newPunch = await res.json();
      setPunches(prev => [newPunch, ...prev]);
      setManualTime('');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: 900, margin: '24px auto' }}>
      <h1>Punch App</h1>
      <div style={{ border: '1px solid #ddd', padding: 16, borderRadius: 8 }}>
        <h2>Record Punch</h2>

        <div style={{ marginBottom: 12 }}>
          <label style={{ marginRight: 12 }}>
            <input type="radio" checked={mode === 'auto'} onChange={() => setMode('auto')} />
            {' '}Auto-capture local time
          </label>
          <label style={{ marginLeft: 12 }}>
            <input type="radio" checked={mode === 'manual'} onChange={() => setMode('manual')} />
            {' '}Manual entry
          </label>
        </div>

        {mode === 'manual' && (
          <div style={{ marginBottom: 12 }}>
            <input
              type="datetime-local"
              value={manualTime}
              onChange={(e) => setManualTime(e.target.value)}
              style={{ padding: 8, fontSize: 14 }}
            />
          </div>
        )}

        <div>
          <button onClick={punchIn} disabled={saving} style={{ padding: '10px 18px', fontSize: 16 }}>
            {saving ? 'Saving...' : 'Punch In'}
          </button>
        </div>

        {error && <div style={{ color: 'red', marginTop: 12 }}>{error}</div>}
      </div>

      <div style={{ marginTop: 20 }}>
        <h2>Past Punches</h2>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ccc' }}>Recorded (local)</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ccc' }}>Source</th>
                <th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #ccc' }}>Created At (UTC)</th>
              </tr>
            </thead>
            <tbody>
              {punches.map((p) => (
                <tr key={p.id}>
                  <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{formatLocal(p.timestamp)}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{p.source}</td>
                  <td style={{ padding: 8, borderBottom: '1px solid #eee' }}>{p.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
