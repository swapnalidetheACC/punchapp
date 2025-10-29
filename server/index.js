// server/index.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import couchbase from "couchbase";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "supersecretjwtkey";

// ✅ Couchbase Connection
let cluster, bucket, collection;
(async () => {
  try {
    cluster = await couchbase.connect(process.env.COUCHBASE_CONNSTR, {
      username: process.env.COUCHBASE_USER,
      password: process.env.COUCHBASE_PASSWORD,
    });
    bucket = cluster.bucket(process.env.COUCHBASE_BUCKET);
    collection = bucket.defaultCollection();
    console.log("✅ Couchbase connected successfully!");
  } catch (err) {
    console.error("❌ Couchbase connection failed:", err);
  }
})();

// ✅ Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({
