/**
 * Shared authentication types.
 * These types define the contract between the BrainCare client and server
 * for Module 2 (Authentication). Other modules must import from here rather
 * than redefining equivalent shapes.
 */

/** Safe, public-facing user representation. NEVER includes passwordHash. */
export interface SafeUser {
  id: string;
  email: string;
  createdAt: string; // ISO date string
  updatedAt: string; // ISO date string
}

export interface RegisterRequestBody {
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface LoginRequestBody {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: SafeUser;
}

export interface ApiErrorResponse {
  error: {
    message: string;
    /** Field-level validation errors, keyed by field name. */
    fields?: Record<string, string>;
  };
}

/** Shape of the JWT payload issued by the server. */
export interface JwtPayload {
  userId: string;
  email: string;
}
