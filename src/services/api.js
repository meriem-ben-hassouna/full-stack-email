import axios from "axios";

// Base URL of the FastAPI backend. Override with VITE_API_BASE_URL in a
// .env file if the backend runs somewhere other than localhost:8000.
const baseURL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Normalizes FastAPI error payloads ({ detail: "..." }) into a plain
// message string so components can just do `catch (err) { alert(err.message) }`.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const detail = error?.response?.data?.detail;
    const message =
      (typeof detail === "string" && detail) ||
      error?.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

export default api;
