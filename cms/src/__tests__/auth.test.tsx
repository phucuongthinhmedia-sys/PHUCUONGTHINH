import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/contexts/auth-context";
import { authService } from "@/lib/auth-service";

jest.mock("@/lib/auth-service");
jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

function TestComponent() {
  const { user, isAuthenticated, login, logout } = useAuth();

  return (
    <div>
      <div data-testid="auth-status">
        {isAuthenticated ? "Authenticated" : "Not Authenticated"}
      </div>
      <div data-testid="user-email">{user?.email || "No user"}</div>
      <button
        onClick={() =>
          login({ email: "test@example.com", password: "password" })
        }
        data-testid="login-btn"
      >
        Login
      </button>
      <button onClick={logout} data-testid="logout-btn">
        Logout
      </button>
    </div>
  );
}

describe("Authentication Context", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should provide authentication context", () => {
    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    expect(screen.getByTestId("auth-status")).toHaveTextContent(
      "Not Authenticated",
    );
  });

  it("should handle login", async () => {
    const mockLogin = jest.fn().mockResolvedValue({
      access_token: "test-token",
      user: { id: "1", email: "test@example.com", role: "admin" },
    });

    (authService.login as jest.Mock) = mockLogin;

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    const loginBtn = screen.getByTestId("login-btn");
    fireEvent.click(loginBtn);

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "password",
      });
    });
  });

  it("should handle logout", async () => {
    const mockLogout = jest.fn();
    (authService.logout as jest.Mock) = mockLogout;

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>,
    );

    const logoutBtn = screen.getByTestId("logout-btn");
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(mockLogout).toHaveBeenCalled();
    });
  });
});
