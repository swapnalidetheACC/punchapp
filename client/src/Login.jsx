import { useState } from "react";

const API = "https://punchapp-f8f8.onrender.com";

export default function Login({ setToken, setShowRegister }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    const res = await fetch(`${API}/api/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      setToken(data.token);
    } else alert(data.error || "Login failed");
  };

  return (
    <div>
      <h3>Login</h3>
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} /><br />
      <input type="password" placeholder="Password" onChange={e => setPassword(e.target.value)} /><br />
      <button onClick={login}>Login</button>
      <p>
        Don’t have an account?{" "}
        <button onClick={() => setShowRegister(true)}>Register</button>
      </p>
    </div>
  );
}
