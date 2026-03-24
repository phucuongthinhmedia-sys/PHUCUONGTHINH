import { useContext, useEffect } from "react";
import { AuthContext } from "./auth-context";
import type { AuthContextType, AuthUser } from "./auth-context";

/**
 * Access the full authentication context.
 * Must be used inside <AuthProvider>.
 */
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

/**
 * Returns the currently authenticated user, or null if not logged in.
 */
export function useUser(): AuthUser | null {
  return useAuth().user;
}

/**
 * Redirects to the given path when the user is not authenticated.
 * Intended for use in protected route components.
 *
 * @param redirectTo - path to redirect unauthenticated users to (default: "/admin/login")
 * @param onRedirect - callback that performs the actual redirect (e.g. router.push)
 */
export function useRequireAuth(
  onRedirect: (path: string) => void,
  redirectTo = "/admin/login",
): AuthContextType {
  const auth = useAuth();

  useEffect(() => {
    if (!auth.isLoading && !auth.isAuthenticated) {
      onRedirect(redirectTo);
    }
  }, [auth.isLoading, auth.isAuthenticated, onRedirect, redirectTo]);

  return auth;
}
