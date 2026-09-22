import type { ApiErrorResponse } from "../types/auth.types";

export const API_BASE_URL: string = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

/**
 * Shared fetch wrapper for all BrainCare API calls.
 * - Always sends/receives the HTTP-only auth cookie (`credentials: "include"`).
 * - Parses BrainCare's { error: { message, fields } } shape into ApiError.
 *
 * Other modules' services should use this same helper instead of calling
 * `fetch` directly, so auth cookies and error handling stay consistent.
 */
export async function apiRequest<TResponse>(
  path: string,
  options: RequestInit = {}
): Promise<TResponse> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const body = isJson ? await response.json() : undefined;

  if (!response.ok) {
    const errorBody = body as ApiErrorResponse | undefined;
    throw new ApiError(
      response.status,
      errorBody?.error?.message || "Something went wrong. Please try again.",
      errorBody?.error?.fields
    );
  }

  return body as TResponse;
}
