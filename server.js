// server.js
import express from "express";
import path from "path";
import cors from "cors";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

// ✅ Load environment variables from .env (for local dev)
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Handle module __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ✅ Health check route (Render uses this to confirm it's alive)
app.get("/health", (req, res) => {
  res.status(200).send("Server is healthy ✅");
});

// ✅ Example Punch-in route (you can link to Couchbase later)
a

