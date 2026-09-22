import jwt from "jsonwebtoken";
import type { JwtPayload } from "../../../../shared/types/auth.types";
import { env } from "./env";

/**
 * Signs a JWT for the given user payload.
 */
export function signAuthToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
  } as jwt.SignOptions);
}

/**
 * Verifies a JWT and returns its decoded payload.
 * Throws if the token is invalid or expired.
 */
export function verifyAuthToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, env.JWT_SECRET);
  if (
    typeof decoded === "object" &&
    decoded !== null &&
    "userId" in decoded &&
    "email" in decoded
  ) {
    return {
      userId: String((decoded as Record<string, unknown>).userId),
      email: String((decoded as Record<string, unknown>).email),
    };
  }
  throw new Error("Invalid token payload");
}
