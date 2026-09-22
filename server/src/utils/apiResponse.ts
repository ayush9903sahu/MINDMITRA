import { Response } from "express";
import { ApiResponse } from "../../../../shared/types/api";

export function sendSuccess<T>(res: Response, data: T, status = 200): void {
  const body: ApiResponse<T> = { success: true, data };
  res.status(status).json(body);
}

export function sendError(res: Response, message: string, status = 400, code?: string): void {
  const body: ApiResponse<never> = { success: false, error: { message, code } };
  res.status(status).json(body);
}
