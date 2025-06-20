import { Ratelimit } from "@upstash/ratelimit"; 
import { Redis } from "@upstash/redis"; 
// Import necessary modules from Upstash for rate limiting and Redis connection

import dotenv from "dotenv"; // Import environment variables

dotenv.config(); // Load environment variables from .env file

// Initialize the rate limiter with Redis from environment variables
// and an empty limiter configuration
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, "60 s"), // Allow 10 requests every 10 seconds
});

// Export the rate limiter for use in other parts of the application
export default ratelimit;