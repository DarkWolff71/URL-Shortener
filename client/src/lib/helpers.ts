export const BACKEND_BASE_URL =
  process.env.NODE_ENV == "production"
    ? "http://localhost:4000"
    : "http://localhost:4000";

export const FRONTEND_BASE_URL =
  process.env.NODE_ENV == "production"
    ? "http://localhost:5173"
    : "http://localhost:5173";
