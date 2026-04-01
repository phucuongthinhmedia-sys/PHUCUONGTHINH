/**
 * Admin API client instance for CMS admin pages.
 * Uses the shared ApiClient factory with the frontend's token storage.
 */
import { createApiClient, ApiClient } from "@repo/shared-utils";
import { API_URL } from "./constants";

const TOKEN_KEY = "auth_token";

function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

function onUnauthorized(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem("auth_user");
    window.dispatchEvent(new Event("auth:unauthorized"));
  }
}

export const adminApiClient: ApiClient = createApiClient({
  baseURL: API_URL,
  getToken,
  onUnauthorized,
});

// Convenience aliases
export const apiClient = adminApiClient;
export const rawApiClient = adminApiClient;
