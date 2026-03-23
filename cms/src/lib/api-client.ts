import axios, { AxiosInstance, AxiosError } from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

interface ApiError {
  error: {
    code: string;
    message: string;
    details?: any;
    timestamp: string;
    path: string;
  };
}

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Add request interceptor to include JWT token
    this.client.interceptors.request.use((config) => {
      const token = this.getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          this.clearToken();
          localStorage.removeItem("cms_auth_user");
          // Dispatch custom event so AuthContext can react and update state
          if (typeof window !== "undefined") {
            window.dispatchEvent(new Event("auth:unauthorized"));
          }
        }
        return Promise.reject(error);
      },
    );
  }

  private getToken(): string | null {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("cms_auth_token");
  }

  private clearToken(): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem("cms_auth_token");
  }

  setToken(token: string): void {
    if (typeof window !== "undefined") {
      localStorage.setItem("cms_auth_token", token);
    }
  }

  getStoredToken(): string | null {
    return this.getToken();
  }

  clearStoredToken(): void {
    this.clearToken();
  }

  async get<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.get(url, config);
    // Support both wrapped { data: T } and raw T responses
    return (
      response.data?.data !== undefined ? response.data.data : response.data
    ) as T;
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.post(url, data, config);
    return (
      response.data?.data !== undefined ? response.data.data : response.data
    ) as T;
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.put(url, data, config);
    return (
      response.data?.data !== undefined ? response.data.data : response.data
    ) as T;
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    const response = await this.client.patch(url, data, config);
    return (
      response.data?.data !== undefined ? response.data.data : response.data
    ) as T;
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.delete(url, config);
    return (
      response.data?.data !== undefined ? response.data.data : response.data
    ) as T;
  }

  // Returns the raw response.data without unwrapping — use when you need
  // top-level fields like `pagination` alongside `data`.
  async getRaw<T>(url: string, config?: any): Promise<T> {
    const response = await this.client.get(url, config);
    return response.data as T;
  }
}

export const apiClient = new ApiClient();
// Convenience export so services can call getRaw without casting
export const rawApiClient = apiClient;
export type { ApiResponse, ApiError };
