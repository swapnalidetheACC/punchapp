import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import bodyParser from "body-parser";
import dotenv from "dotenv";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

// TEMP user (later can move to Couchbase)
const USERS = [{ username: "admin", password: "password123" }];

// Secret key for JWT
const SECRET_KEY = process.env.JWT_SECRET || "mysecretkey";

// Login route
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Generate token
  const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
  res.json({ token });
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"];
  if (!bearerHeader) return res.sendStatus(403);

  const token = bearerHeader.split(" ")[1];
  jwt.verify(token, SECRET_KEY, (err, authData) => {
    if (err) return res.sendStatus(403);
    req.user = authData;
    next();
  });
};

// Protected route (example)
app.get("/api/punches", verifyToken, (req, res) => {
  res.json({ message: "This is protected data", user: req.user });
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
