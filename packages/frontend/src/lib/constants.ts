// Direct backend URL - bypass Next.js proxy when NEXT_PUBLIC_API_URL is set
// On Railway: FE and BE are separate services, direct call eliminates proxy hop
const _directBackend = process.env.NEXT_PUBLIC_API_URL
  ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
  : null;

export const API_URL =
  typeof window !== "undefined"
    ? _directBackend || "/api/backend"
    : process.env.BACKEND_URL ||
      (process.env.NEXT_PUBLIC_API_URL
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/v1`
        : null) ||
      "http://localhost:3001/api/v1";

// Debug: log which URL is being used (remove after confirming)
if (typeof window !== "undefined") {
  console.log(
    "[API_URL]",
    API_URL,
    "| NEXT_PUBLIC_API_URL:",
    process.env.NEXT_PUBLIC_API_URL,
  );
}

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
