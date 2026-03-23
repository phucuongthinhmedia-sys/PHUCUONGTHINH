"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  authService,
  User,
  LoginRequest,
  LoginResponse,
} from "@/lib/auth-service";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<LoginResponse>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // Start with null/true — same on server and client, no hydration mismatch
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Runs only on client after hydration — safe to access localStorage
    try {
      const token = localStorage.getItem("cms_auth_token");
      const stored = localStorage.getItem("cms_auth_user");
      if (token && stored) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp && payload.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem("cms_auth_token");
          localStorage.removeItem("cms_auth_user");
        } else {
          setUser(JSON.parse(stored) as User);
        }
      }
    } catch {
      localStorage.removeItem("cms_auth_token");
      localStorage.removeItem("cms_auth_user");
    } finally {
      setIsLoading(false);
    }

    // Listen for 401 from api-client — clear user state so ProtectedRoute redirects
    const handleUnauthorized = () => setUser(null);
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const login = async (credentials: LoginRequest): Promise<LoginResponse> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      setUser(response.user);
      localStorage.setItem("cms_auth_user", JSON.stringify(response.user));
      return response;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    localStorage.removeItem("cms_auth_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
