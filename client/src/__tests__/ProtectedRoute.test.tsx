import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { ProtectedRoute } from "../components/ProtectedRoute";
import { AuthContext, type AuthContextValue } from "../context/AuthContext";

function renderProtected(authValue: Partial<AuthContextValue>) {
  const value: AuthContextValue = {
    user: null,
    isLoading: false,
    isAuthenticated: false,
    login: vi.fn(),
    register: vi.fn(),
    logout: vi.fn(),
    ...authValue,
  };

  render(
    <MemoryRouter initialEntries={["/dashboard"]}>
      <AuthContext.Provider value={value}>
        <Routes>
          <Route path="/login" element={<div>Login Page</div>} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Secret Dashboard</div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

describe("ProtectedRoute", () => {
  it("shows a loading state while the session check is in flight", () => {
    renderProtected({ isLoading: true });
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("redirects to /login when not authenticated", () => {
    renderProtected({ isLoading: false, isAuthenticated: false });
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });

  it("renders children when authenticated", () => {
    renderProtected({
      isLoading: false,
      isAuthenticated: true,
      user: { id: "1", email: "a@b.com", createdAt: "", updatedAt: "" },
    });
    expect(screen.getByText("Secret Dashboard")).toBeInTheDocument();
  });
});
