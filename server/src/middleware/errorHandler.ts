import type { Request, Response, NextFunction } from "express";

export class AppError extends Error {
  status: number;
  fields?: Record<string, string>;

  constructor(status: number, message: string, fields?: Record<string, string>) {
    super(message);
    this.status = status;
    this.fields = fields;
  }
}

/**
 * Central error handler. Any module's routes can `next(err)` with an
 * AppError (or a generic Error) and this will format a consistent
 * ApiErrorResponse without leaking internals.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.status).json({ error: { message: err.message, fields: err.fields } });
    return;
  }

  console.error("Unhandled error:", err);
  res.status(500).json({ error: { message: "Something went wrong. Please try again." } });
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({ error: { message: `No route matches ${req.method} ${req.path}` } });
}
