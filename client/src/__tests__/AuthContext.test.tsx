import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider } from "../context/AuthContext";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/auth.service";
import { ApiError } from "../services/api";

vi.mock("../services/auth.service", () => ({
  authService: {
    fetchCurrentUser: vi.fn(),
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
  },
}));

const mockedAuthService = vi.mocked(authService);

const safeUser = { id: "1", email: "person@example.com", createdAt: "now", updatedAt: "now" };

function Probe() {
  const { user, isLoading, isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <p data-testid="loading">{String(isLoading)}</p>
      <p data-testid="authed">{String(isAuthenticated)}</p>
      <p data-testid="email">{user?.email ?? "none"}</p>
      <button onClick={() => login("person@example.com", "Password123")}>login</button>
      <button onClick={() => logout()}>logout</button>
    </div>
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("starts loading, then sets user when a valid session cookie exists", async () => {
    mockedAuthService.fetchCurrentUser.mockResolvedValue({ user: safeUser });

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    expect(screen.getByTestId("loading")).toHaveTextContent("true");

    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));
    expect(screen.getByTestId("authed")).toHaveTextContent("true");
    expect(screen.getByTestId("email")).toHaveTextContent("person@example.com");
  });

  it("resolves to logged-out state when no valid session exists", async () => {
    mockedAuthService.fetchCurrentUser.mockRejectedValue(new ApiError(401, "Authentication required."));

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));
    expect(screen.getByTestId("authed")).toHaveTextContent("false");
  });

  it("updates state after a successful login()", async () => {
    mockedAuthService.fetchCurrentUser.mockRejectedValue(new ApiError(401, "Authentication required."));
    mockedAuthService.login.mockResolvedValue({ user: safeUser });
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId("loading")).toHaveTextContent("false"));
    await user.click(screen.getByText("login"));

    await waitFor(() => expect(screen.getByTestId("authed")).toHaveTextContent("true"));
    expect(mockedAuthService.login).toHaveBeenCalledWith({
      email: "person@example.com",
      password: "Password123",
    });
  });

  it("clears user state after logout()", async () => {
    mockedAuthService.fetchCurrentUser.mockResolvedValue({ user: safeUser });
    mockedAuthService.logout.mockResolvedValue({ message: "Logged out successfully." });
    const user = userEvent.setup();

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    await waitFor(() => expect(screen.getByTestId("authed")).toHaveTextContent("true"));
    await user.click(screen.getByText("logout"));

    await waitFor(() => expect(screen.getByTestId("authed")).toHaveTextContent("false"));
    expect(screen.getByTestId("email")).toHaveTextContent("none");
  });
});
