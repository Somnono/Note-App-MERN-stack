import axios from "axios";

/*
  In development:
  - Uses local backend (localhost:5001)

  In production (Vercel):
  - Uses VITE_API_URL from environment variables
*/

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : `${import.meta.env.VITE_API_URL}/api`;

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
