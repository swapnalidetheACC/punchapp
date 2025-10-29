import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import couchbase from "couchbase";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Couchbase setup
const clusterConnStr = process.env.COUCHBASE_URL;
const username = process.env.COUCHBASE_USERNAME;
const password = process.env.COUCHBASE_PASSWORD;
const bucketName = process.env.COUCHBASE_BUCKET;

let bucket;
let collection;

// Connect to Couchbase
async function connectToCouchbase() {
  try {
    const cluster = await couchbase.connect(clusterConnStr, {
      username,
      password,
      configProfile: "wanDevelopment",
    });
    bucket = cluster.bucket(bucketName);
    collection = bucket.defaultCollection();
    console.log("✅ Couchbase connected successfully!");
  } catch (error) {
    console.error("❌ Couchbase connection failed:", error);
  }
}

connectToCouchbase();

// API route to punch in
app.post("/api/punchin", async (req, res) => {
  try {
    const { user, time } = req.body;
    const docId = `punch_${Date.now()}`;
    await collection.insert(docId, { user, time });
    res.status(200).json({ message: "Punch-in recorded successfully" });
  } catch (error) {
    console.error("Error inserting document:", error);
    res.status(500).json({ error: "Failed to record punch-in" });
  }
});

// Root route
app.get("/", (req, res) => {
  res.send("Punch App Backend is running 🚀");
});

// Start server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
