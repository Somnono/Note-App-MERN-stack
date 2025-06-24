import React from 'react'
import axios from 'axios'


const BASE_URL = import.meta.env.MODE === "development" 
  ? "http://localhost:5001/api" 
  : "/api";
// This is a placeholder component for axios, which is not used directly in the UI.
// It is typically used for making HTTP requests in the application.
const api = axios.create({
    baseURL: BASE_URL,
});


export default api;
// You can use this api instance to make requests like:
// api.get('/notes')