import { useState } from "react";
import PunchIn from "./PunchIn";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [showRegister, setShowRegister] = useState(false);

  return (
    <div style={{ padding: "40px", fontFamily: "Arial" }}>
      <h1>Punch App ⏰</h1>
      {!token ? (
        showRegister ? (
          <Register setShowRegister={setShowRegister} />
        ) : (
          <Login setToken={setToken} setShowRegister={setShowRegister} />
        )
      ) : (
        <PunchIn token={token} />
      )}
    </div>
  );
}

export default App;
