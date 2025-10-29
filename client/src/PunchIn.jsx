export default function PunchIn({ token }) {
  const punchIn = async () => {
    const time = new Date().toLocaleString();
    const username = "user"; // Ideally decoded from token
    const res = await fetch("https://punchapp-f8f8.onrender.com/api/punchin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ username, time }),
    });
    const data = await res.json();
    if (data.success) alert(`Punched in at ${time}`);
    else alert("Error punching in");
  };

  return (
    <div>
      <h3>Punch In</h3>
      <button onClick={punchIn}>Punch In Now</button>
    </div>
  );
}
