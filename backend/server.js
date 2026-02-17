// backend/middleware/rateLimiter.js
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// If Upstash env vars are missing or Upstash is unreachable,
// we fail open (no limiting) so the app never 500s.
const hasUpstash =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

let ratelimit = null;

if (hasUpstash) {
  try {
    const redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL,
      token: process.env.UPSTASH_REDIS_REST_TOKEN,
    });

    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.fixedWindow(60, "60 s"), // 60 req / 60s per IP
      analytics: false,
    });
  } catch (e) {
    ratelimit = null;
  }
}

export default async function rateLimiter(req, res, next) {
  // No Upstash configured or init failed → allow all
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
    // Upstash/DNS/network issues → fail open (DON'T 500)
    console.warn("Rate limiter skipped:", e?.message || e);
    return next();
  }
}
