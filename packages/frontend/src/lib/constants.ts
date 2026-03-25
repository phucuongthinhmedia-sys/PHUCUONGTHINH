// Use /api/backend proxy on client-side, direct URL on server-side
export const API_URL =
  typeof window !== "undefined"
    ? "/api/backend"
    : process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3001/api/v1";
