import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import path from "path";

import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const __dirname = path.resolve();

/**
 * CORS
 * - In production, you can restrict to your frontend domain later.
 * - For now, keep it simple so you can showcase without surprises.
 */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

/**
 * Rate limiter
 * If the middleware throws due to missing env (Upstash vars), we don't want the whole server to crash
 * while you're trying to demo. We'll fail-soft and still run.
 */
try {
  if (typeof rateLimiter === "function") {
    app.use(rateLimiter);
  }
} catch (e) {
  console.error("⚠️ Rate limiter disabled (startup error):", e?.message || e);
}

app.use("/api/notes", notesRoutes);

// Health check (helps with Render + debugging)
app.get("/health", (req, res) => res.status(200).json({ ok: true }));

// Serve frontend in production if you build frontend into /frontend/dist
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err);
    // On Render, crash clearly if DB is required
    process.exit(1);
  });
