import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { connectToBucket } from "./db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

app.use(cors());
app.use(bodyParser.json());

// Get current directory (for serving frontend)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Couchbase connection
const bucket = await connectToBucket();

// ✅ Register user
app.post("/api/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const userDoc = {
      username,
      password: hashedPassword,
      createdAt: new Date().toISOString(),
    };
    await bucket.collection("users").upsert(username, userDoc);
    res.json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "User registration failed" });
  }
});

// ✅ Login user
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const result = await bucket.collection("users").get(username);
    const user = result.content;
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "2h" });
    res.json({ token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(401).json({ error: "User not found or invalid credentials" });
  }
});

// ✅ Punch In (protected)
app.post("/api/punchin", async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "Missing token" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const record = {
      username: decoded.username,
      punchedAt: new Date().toLocaleString(),
    };
    await bucket.collection("punches").upsert(
      `${decoded.username}-${Date.now()}`,
      record
    );
    res.json({ message: "Punch in recorded", record });
  } catch (error) {
    console.error("Punchin error:", error);
    res.status(403).json({ error: "Invalid or expired token" });
  }
});

// ✅ Serve frontend (React build)
app.use(express.static(path.join(__dirname, "../client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

// ✅ Start server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
