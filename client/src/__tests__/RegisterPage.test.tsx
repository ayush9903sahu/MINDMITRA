import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RegisterPage from "../pages/RegisterPage";
import { AuthContext, type AuthContextValue } from "../context/AuthContext";

function renderWithAuth(overrides: Partial<AuthContextValue> = {}) {
  const value: AuthContextValue = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    ...overrides,
  };

  render(
    <MemoryRouter initialEntries={["/register"]}>
      <AuthContext.Provider value={value}>
        <RegisterPage />
      </AuthContext.Provider>
    </MemoryRouter>
  );

  return value;
}

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a client-side error when passwords do not match", async () => {
    const user = userEvent.setup();
    const register = vi.fn();
    renderWithAuth({ register });

    await user.type(screen.getByLabelText(/email/i), "new@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123");
    await user.type(screen.getByLabelText(/confirm password/i), "Different123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    expect(register).not.toHaveBeenCalled();
  });

  it("calls register with entered values when passwords match", async () => {
    const user = userEvent.setup();
    const register = vi.fn().mockResolvedValue(undefined);
    renderWithAuth({ register });

    await user.type(screen.getByLabelText(/email/i), "new@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    await waitFor(() => {
      expect(register).toHaveBeenCalledWith("new@example.com", "Password123", "Password123");
    });
  });

  it("displays server-side field errors (e.g. duplicate email)", async () => {
    const user = userEvent.setup();
    const { ApiError } = await import("../services/api");
    const register = vi
      .fn()
      .mockRejectedValue(
        new ApiError(409, "An account with this email already exists.", {
          email: "An account with this email already exists.",
        })
      );
    renderWithAuth({ register });

    await user.type(screen.getByLabelText(/email/i), "taken@example.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password123");
    await user.type(screen.getByLabelText(/confirm password/i), "Password123");
    await user.click(screen.getByRole("button", { name: /create account/i }));

    const alerts = await screen.findAllByText(/already exists/i);
    expect(alerts.length).toBeGreaterThan(0);
  });
});
