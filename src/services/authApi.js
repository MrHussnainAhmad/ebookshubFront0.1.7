// src/services/api.js
import axios from "axios";

// Set your backend API base URL using an environment variable
const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || "https://ebookshub.up.railway.app",
});

// Add the token to every request if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      statusCode: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    };
    
    // Log error for debugging
    console.error("API Error:", customError);
    
    return Promise.reject(customError);
  }
);

export default API;