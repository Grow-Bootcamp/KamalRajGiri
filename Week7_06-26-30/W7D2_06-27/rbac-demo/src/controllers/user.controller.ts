
import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/app-error";
import { userRepository } from "../repositories/user.repository";

export class UserController {
  me(req: Request, res: Response, next: NextFunction): void {
    try {
      const user = req.currentUser;

      if (!user) {
        throw new AppError(401, "Authentication required.");
      }

      res.status(200).json({
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  moderationDashboard(
    _req: Request,
    res: Response
  ): void {
    res.status(200).json({
      message: "Welcome to the moderation dashboard.",
    });
  }

  adminDashboard(
    _req: Request,
    res: Response
  ): void {
    res.status(200).json({
      message: "Welcome to the admin dashboard.",
    });
  }
  
  async deleteUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const idText = req.params.id;

      if (typeof idText !== "string" ||  !/^[1-9]\d*$/.test(idText)) {
        throw new AppError(400, "A valid user ID is required.");
      }

      const id = Number(idText);

      if (!Number.isSafeInteger(id)) {
        throw new AppError(400, "A valid user ID is required.");
      }

      if (req.currentUser?.id === id) {
        throw new AppError(400, "You cannot delete your own account through this endpoint.");
      }

      const existingUser = await userRepository.findById(id);

      if (!existingUser) {
        throw new AppError(404, "User not found.");
      }

      await userRepository.deleteById(id);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
