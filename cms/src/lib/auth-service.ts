import { apiClient } from "./api-client";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: {
    id: string;
    email: string;
    role: string;
  };
}

export interface User {
  id: string;
  email: string;
  role: string;
}

class AuthService {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      "/auth/login",
      credentials,
    );
    if (response.accessToken) {
      apiClient.setToken(response.accessToken);
    }
    return response;
  }

  async refreshToken(): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("/auth/refresh");
    if (response.access_token) {
      apiClient.setToken(response.access_token);
    }
    return response;
  }

  logout(): void {
    apiClient.clearStoredToken();
  }

  getStoredToken(): string | null {
    return apiClient.getStoredToken();
  }

  isAuthenticated(): boolean {
    return !!this.getStoredToken();
  }
}

export const authService = new AuthService();
