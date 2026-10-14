
import type { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

import { env } from "../config/env";
import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/app-error";

export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new AppError(401, "Authentication token required.");
    }

    const token = authorization.slice("Bearer ".length).trim();

    if (!token) {
      throw new AppError(401, "Authentication token required.");
    }

    let decoded: string | JwtPayload;

    try {
      decoded = jwt.verify(token, env.JWT_SECRET, {
        algorithms: ["HS256"],
      });
    } catch {
      throw new AppError(401, "Invalid or expired authentication token.");
    }

    if (
      typeof decoded === "string" ||
      typeof decoded.sub !== "string" ||
      !/^[1-9]\d*$/.test(decoded.sub)
    ) {
      throw new AppError(401, "Invalid authentication token.");
    }

    const userId = Number(decoded.sub);

    if (!Number.isSafeInteger(userId)) {
      throw new AppError(401, "Invalid authentication token.");
    }

    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError(401, "Account no longer exists.");
    }

    req.currentUser = user;
    next();
  } catch (error) {
    next(error);
  }
}
