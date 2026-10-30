
import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../models/user.model";
import { AppError } from "../utils/app-error";

export function authorizeRoles(...allowedRoles: UserRole[]) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    if (!req.currentUser) {
      next(new AppError(401, "Authentication required."));
      return;
    }

    if (!allowedRoles.includes(req.currentUser.role)) {
      next(new AppError(403, "You do not have permission to access this resource."));
      return;
    }

    next();
  };
}
