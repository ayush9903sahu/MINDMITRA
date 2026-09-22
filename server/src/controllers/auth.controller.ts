import type { Request, Response, NextFunction } from "express";
import { registerSchema, loginSchema, zodErrorToFields } from "../utils/validation";
import { registerUser, verifyCredentials, getUserById, toSafeUser } from "../services/auth.service";
import { signAuthToken } from "../utils/jwt";
import { AppError } from "../middleware/errorHandler";
import { AUTH_COOKIE_NAME } from "../../../shared/constants/auth.constants";
import { env } from "../utils/env";

const COOKIE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days, matches default JWT_EXPIRES_IN

function setAuthCookie(res: Response, token: string): void {
  res.cookie(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_MS,
    path: "/",
  });
}

function clearAuthCookie(res: Response): void {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: env.isProduction,
    sameSite: "lax",
    path: "/",
  });
}

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, "Please fix the highlighted fields.", zodErrorToFields(parsed.error));
    }

    const { email, password } = parsed.data;
    const user = await registerUser(email, password);
    const token = signAuthToken({ userId: user.id, email: user.email });
    setAuthCookie(res, token);

    res.status(201).json({ user: toSafeUser(user) });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      throw new AppError(400, "Please fix the highlighted fields.", zodErrorToFields(parsed.error));
    }

    const { email, password } = parsed.data;
    const user = await verifyCredentials(email, password);
    const token = signAuthToken({ userId: user.id, email: user.email });
    setAuthCookie(res, token);

    res.status(200).json({ user: toSafeUser(user) });
  } catch (err) {
    next(err);
  }
}

export function logout(req: Request, res: Response): void {
  clearAuthCookie(res);
  res.status(200).json({ message: "Logged out successfully." });
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError(401, "Authentication required.");
    }

    const user = await getUserById(req.user.userId);
    if (!user) {
      clearAuthCookie(res);
      throw new AppError(401, "Session is no longer valid. Please log in again.");
    }

    res.status(200).json({ user: toSafeUser(user) });
  } catch (err) {
    next(err);
  }
}
