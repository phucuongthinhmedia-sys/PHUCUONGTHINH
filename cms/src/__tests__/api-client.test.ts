import { apiClient } from "@/lib/api-client";

jest.mock("axios");

describe("API Client", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  it("should set and retrieve token", () => {
    const token = "test-token-123";
    apiClient.setToken(token);

    expect(apiClient.getStoredToken()).toBe(token);
  });

  it("should clear token", () => {
    apiClient.setToken("test-token");
    apiClient.clearStoredToken();

    expect(apiClient.getStoredToken()).toBeNull();
  });

  it("should check authentication status", () => {
    expect(apiClient.getStoredToken()).toBeNull();

    apiClient.setToken("test-token");
    expect(apiClient.getStoredToken()).not.toBeNull();
  });
});
