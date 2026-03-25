// Use /api/backend proxy on client-side, direct URL on server-side
export const API_URL =
  typeof window !== "undefined"
    ? "/api/backend"
    : process.env.BACKEND_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "http://localhost:3001/api/v1";

// Helper: strip empty strings/null/undefined before sending to API
export function cleanPayload<T extends Record<string, any>>(
  obj: T,
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, v]) => v !== "" && v !== null && v !== undefined,
    ),
  ) as Partial<T>;
}
