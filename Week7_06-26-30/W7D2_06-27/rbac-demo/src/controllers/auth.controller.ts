
import type { Request, Response, NextFunction } from "express";

import { authService } from "../services/auth.services";
import { AppError } from "../utils/app-error";

export class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, email, password } = req.body ?? {};

      if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof password !== "string"
      ) {
        throw new AppError(
          400,
          "Name, email, and password must be strings."
        );
      }

      const result = await authService.register({
        name,
        email,
        password,
      });

      res.status(201).json({
        message: "Account created successfully.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body ?? {};

      if (
        typeof email !== "string" ||
        typeof password !== "string"
      ) {
        throw new AppError(
          400,
          "Email and password must be strings."
        );
      }

      const result = await authService.login({
        email,
        password,
      });

      res.status(200).json({
        message: "Login successful.",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
