// server.js
import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// ✅ Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Resolve __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Health check route
app.get("/health", (req, res) => {
  res.status(200).send("Server is healthy ✅");
});

// ✅ Example Punch-in route
app.post("/api/punchin", (req, res) => {
  const { name, time } = req.body;
  if (!name || !time) {
    return res.status(400).json({ error: "Name and time are required" });
  }
  console.log(`Punch in recorded: ${name} at ${time}`);
  res.status(200).json({ message: "Punch in recorded successfully" });
});

// ✅ Serve React frontend (Vite build output)
app.use(express.static(path.join(__dirname, "client", "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// ✅ Dynamic port for Render
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
