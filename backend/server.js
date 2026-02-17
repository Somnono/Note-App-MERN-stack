// backend/middleware/rateLimiter.js
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

let ratelimit = null;
let disabled = false;

// If the Upstash DB was deleted or DNS fails, we permanently disable limiter at runtime
async function initRateLimitOnce() {
  if (!hasUpstash || disabled || ratelimit) return;

  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    // quick connectivity check (will throw if DNS/network/token is bad)
    await redis.ping();

    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(60, "60 s"), // 60 req per 60 seconds
      analytics: false,
    });
  } catch (e) {
    disabled = true; // fail-open forever until redeploy with valid env vars
    ratelimit = null;
    console.warn("Rate limiter disabled (Upstash unreachable):", e?.message || e);
  }
}

export default async function rateLimiter(req, res, next) {
  // No env vars or previously disabled => allow all
  if (!hasUpstash || disabled) return next();

  // Lazy init (and connectivity check) once
  await initRateLimitOnce();

  // If init failed => allow all
  if (!ratelimit) return next();

  try {
    const ip =
      (req.headers["x-forwarded-for"] || "").toString().split(",")[0].trim() ||
      req.socket?.remoteAddress ||
      "unknown";

    const { success, reset, remaining } = await ratelimit.limit(ip);

    res.setHeader("X-RateLimit-Remaining", String(remaining));
    res.setHeader("X-RateLimit-Reset", String(reset));

    if (!success) {
      return res.status(429).json({ message: "Too many requests. Try again soon." });
    }

    return next();
  } catch (e) {
    // Any runtime Upstash error => disable and fail open (no more 500s)
    disabled = true;
    ratelimit = null;
    console.warn("Rate limiter disabled (runtime error):", e?.message || e);
    return next();
  }
}
