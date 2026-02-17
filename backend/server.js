import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS (demo-friendly)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Prevent favicon requests from causing noise/errors
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Rate limiter (safe: should fail-open if Upstash is missing/down)
try {
  if (typeof rateLimiter === "function") {
    app.use(rateLimiter);
  }
} catch (e) {
  console.error("⚠️ Rate limiter disabled (startup error):", e?.message || e);
}

// API routes
app.use("/api/notes", notesRoutes);

// Health check
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

// Root route (so hitting the Render URL doesn't 500)
app.get("/", (req, res) => {
  res.status(200).send("✅ Note App API is running");
});

/**
 * IMPORTANT (Render stability):
 * - Do NOT exit the process if Mongo fails during demo.
 * - Start the server regardless so Render sees an open port.
 */
connectDB()
  .then(() => {
    console.log("✅ MongoDB connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    console.log("⚠️ Starting server WITHOUT database (demo/debug mode)...");
  })
  .finally(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  });
