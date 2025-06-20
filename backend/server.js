//These are the package imports for the backend server.
// They include Express for building the server, CORS for handling cross-origin requests,
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// and the local modules for handling notes routes, database connection, and rate limiting middleware.
import notesRoutes from "./routes/notesRoutes.js";
import { connectDB } from "./config/db.js";
import rateLimiter from "./middleware/rateLimiter.js";

// This code imports the necessary modules and sets up an Express server with routes for handling notes.

 dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

// These lines are the middleware setup for the Express application.
app.use(cors());
app.use(express.json());
// This line allows the Express app to parse incoming JSON requests, enabling it to handle JSON data in request bodies.
app.use(rateLimiter);
app.use("/api/notes", notesRoutes);

// This line mounts the notesRoutes on the "/api/notes" path, meaning that any requests to this path will be handled by the notesRoutes. 

connectDB().then(() => {
  app.listen(PORT, () => {
  console.log("Sever is running from Backend, we online:", PORT);
});
});
// This code creates an Express application and starts a server listening on port 5001. 
// It also connects to a MongoDB database using the connectDB function from the config/db.js file.
// The server is set up to handle JSON requests and uses a rate limiter middleware to limit the number of requests to the API.