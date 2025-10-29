import { useState } from "react";

const API = "https://punchapp-f8f8.onrender.com";

export default function Register({ setShowRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const register = async () => {
    const res = await fetch(`${API}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.success) {
      alert("Registered successfully!");
      setShowRegister(false);
    } else alert(data.error);
  };

  return (
    <div>
      <h3>Register</h3>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} /><br />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={register}>Register</button>
    </div>
  );
}
