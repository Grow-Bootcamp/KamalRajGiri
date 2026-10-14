
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      message: error.message,
    });
    return;
  }

  console.error("Unexpected application error:", error);

  res.status(500).json({
    message: "Internal server error.",
  });
}
