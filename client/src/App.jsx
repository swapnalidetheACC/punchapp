import React from "react";

function App() {
  const handlePunchIn = () => {
    const time = new Date().toLocaleTimeString();
    alert(`You punched in at ${time}`);
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Punch In App</h1>
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
        onClick={handlePunchIn}
      >
        Punch In
      </button>
    </div>
  );
}

export default App;
