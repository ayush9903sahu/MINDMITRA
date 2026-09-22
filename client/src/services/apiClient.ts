/**
 * Minimal authenticated GET client, shared by every read-only service in
 * the app (currently just `progressService.ts`).
 *
 * INTEGRATION NOTE (resolved during module merge): this file originally
 * assumed a separate, not-yet-built API client and read a bearer token out
 * of localStorage. Module 2 (auth) actually issues a JWT in a secure
 * HTTP-only cookie, and `gameResultService.ts` (Module 5/6) already relies
 * on that cookie via `credentials: "include"`. Storing a copy of the JWT in
 * localStorage would both duplicate that session and reopen the XSS risk
 * HTTP-only cookies exist to prevent, so this client now sends the cookie
 * instead of a bearer token, keeping one auth mechanism across the app.
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiGet<T>(path: string): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    });
  } catch {
    throw new ApiError(
      "Unable to reach the server. Check your connection and try again.",
      0,
    );
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new ApiError(
        "Your session has expired. Please sign in again.",
        response.status,
      );
    }
    throw new ApiError(
      `Request to ${path} failed (${response.status}).`,
      response.status,
    );
  }

  return (await response.json()) as T;
}
