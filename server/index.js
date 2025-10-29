import express from "express";
import cors from "cors";
import { connectToBucket } from "./db.js";

const app = express();

// ✅ Middlewares
app.use(cors());
app.use(express.json());

// Global bucket variable
let bucket = null;

// Initialize Couchbase connection
(async () => {
  try {
    bucket = await connectToBucket();
    if (!bucket) {
      console.warn("⚠️ Couchbase not connected — running in limited mode.");
    } else {
      console.log("✅ Couchbase connection successful!");
    }
  } catch (err) {
    console.warn("⚠️ Couchbase connection issue, continuing anyway...");
  }
})();

// ✅ Health check route
app.get("/", (req, res) => {
  res.send("✅ PunchApp backend is running!");
});

// ✅ Fallback in-memory store (used if Couchbase is offline)
let punches = [];

// ✅ Punch In/Out API
app.post("/api/punch", async (req, res) => {
  const punch = req.body;

  try {
    if (bucket) {
      const collection = bucket.defaultCollection();
      const id = `punch_${Date.now()}`;
      await collection.upsert(id, punch);
      console.log("✅ Punch stored in Couchbase:", punch);
      return res.json({ message: "Punch recorded in Couchbase", punch });
    } else {
      punches.push(punch);
      console.warn("⚠️ Couchbase offline. Punch stored locally.");
      return res.json({ message: "Punch recorded locally", punch });
    }
  } catch (err) {
    console.error("❌ Error saving punch:", err);
    punches.push(punch);
    return res.json({ message: "Punch stored locally (error saving to DB)",
