/**
 * Shared authentication constants.
 * Other modules should import these rather than hard-coding auth paths
 * or validation rules, so future changes stay in one place.
 */

export const AUTH_API_BASE = "/api/auth";

export const AUTH_ROUTES = {
  register: `${AUTH_API_BASE}/register`,
  login: `${AUTH_API_BASE}/login`,
  logout: `${AUTH_API_BASE}/logout`,
  me: `${AUTH_API_BASE}/me`,
} as const;

export const AUTH_COOKIE_NAME = "braincare_token";

export const PASSWORD_MIN_LENGTH = 8;

/** Client-side route paths that Module 1 (navigation/routing) should link to. */
export const CLIENT_AUTH_PATHS = {
  login: "/login",
  register: "/register",
  dashboard: "/dashboard",
} as const;
