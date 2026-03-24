"use client";

import React, { createContext, useState, useEffect, useCallback } from "react";
import type { LoginDto, AuthResponse } from "@repo/shared-types";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  /**
   * Call after a successful login API response to persist the session.
   * The caller is responsible for making the API request and passing the response.
   */
  login: (credentials: LoginDto, response: AuthResponse) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export interface AuthProviderProps {
  children: React.ReactNode;
  /** Called when the stored token is found to be expired on mount */
  onTokenExpired?: () => void;
}

/**
 * AuthProvider manages JWT-based authentication state.
 *
 * - Reads/writes JWT token and user to localStorage under TOKEN_KEY / USER_KEY.
 * - On mount, validates the stored token expiry and clears it if expired.
 * - Listens for the "auth:unauthorized" window event dispatched by the API
 *   client on 401 responses, so auth state is cleared automatically.
 * - Exposes login() to persist a successful auth response, and logout() to
 *   clear all auth state.
 */
export function AuthProvider({ children, onTokenExpired }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Runs only on client after hydration — safe to access localStorage
    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const stored = localStorage.getItem(USER_KEY);
      if (token && stored) {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const isExpired = payload.exp && payload.exp * 1000 < Date.now();
        if (isExpired) {
          localStorage.removeItem(TOKEN_KEY);
          localStorage.removeItem(USER_KEY);
          onTokenExpired?.();
        } else {
          setUser(JSON.parse(stored) as AuthUser);
        }
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setIsLoading(false);
    }

    // Listen for 401 from API client — clear user so protected routes redirect
    const handleUnauthorized = () => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      setUser(null);
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () =>
      window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [onTokenExpired]);

  const login = useCallback(
    (_credentials: LoginDto, response: AuthResponse) => {
      const authUser: AuthUser = response.user;
      localStorage.setItem(TOKEN_KEY, response.accessToken);
      localStorage.setItem(USER_KEY, JSON.stringify(authUser));
      setUser(authUser);
    },
    [],
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setUser(null);
  }, []);

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

/**
 * Returns the stored JWT token from localStorage.
 * Safe to call outside React (e.g. from the API client factory).
 */
export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}
