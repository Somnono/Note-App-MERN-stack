import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// CORS (simple, demo-friendly)
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

// Prevent favicon requests from triggering errors
app.get("/favicon.ico", (req, res) => res.status(204).end());

// Rate limiter (fail-soft)
try {
  if (typeof rateLimiter === "function") {
    app.use(rateLimiter);
  }
} catch (e) {
  console.error("⚠️ Rate limiter disabled (startup error):", e?.message || e);
}

// Routes
app.use("/api/notes", notesRoutes);

// Health check
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

// Root route (so hitting the Render URL doesn't 500)
app.get("/", (req, res) => {
  res.status(200).send("✅ Note App API is running");
});

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  });
