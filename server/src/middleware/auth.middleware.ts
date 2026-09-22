import type { Request, Response, NextFunction } from "express";
import { verifyAuthToken } from "../utils/jwt";
import { AUTH_COOKIE_NAME } from "../../../shared/constants/auth.constants";

/**
 * Protects a route. Reads the JWT from the HTTP-only cookie (falling back
 * to an "Authorization: Bearer <token>" header for non-browser clients),
 * verifies it, and attaches the decoded payload to `req.user`.
 *
 * Other modules should use this same middleware to protect their own
 * routes, e.g.:
 *   router.get("/profile", requireAuth, profileController.getProfile);
 */
export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const cookieToken = req.cookies?.[AUTH_COOKIE_NAME] as string | undefined;
  const authHeader = req.headers.authorization;
  const headerToken = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : undefined;

  const token = cookieToken || headerToken;

  if (!token) {
    res.status(401).json({ error: { message: "Authentication required." } });
    return;
  }

  try {
    req.user = verifyAuthToken(token);
    next();
  } catch {
    res.status(401).json({ error: { message: "Invalid or expired session. Please log in again." } });
  }
}
