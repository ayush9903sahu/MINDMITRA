import { apiRequest } from "./api";
import type { AuthResponse, LoginRequestBody, RegisterRequestBody } from "../types/auth.types";

/**
 * Client-side auth API. Other modules should get the current user via
 * AuthContext/useAuth rather than calling fetchCurrentUser() directly.
 */
export const authService = {
  register(payload: RegisterRequestBody): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  login(payload: LoginRequestBody): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  logout(): Promise<{ message: string }> {
    return apiRequest<{ message: string }>("/api/auth/logout", {
      method: "POST",
    });
  },

  fetchCurrentUser(): Promise<AuthResponse> {
    return apiRequest<AuthResponse>("/api/auth/me", {
      method: "GET",
    });
  },
};
