
import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../models/user.model";
import { AppError } from "../utils/app-error";

export type Permission =
  | "read:posts"
  | "delete:comments"
  | "manage:users";

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  user: ["read:posts"],
  moderator: ["read:posts", "delete:comments"],
  admin: ["read:posts", "delete:comments", "manage:users"],
};

export function authorizePermissions(
  ...requiredPermissions: Permission[]
) {
  return (
    req: Request,
    _res: Response,
    next: NextFunction
  ): void => {
    const user = req.currentUser;

    if (!user) {
      next(new AppError(401, "Authentication required."));
      return;
    }

    const granted = ROLE_PERMISSIONS[user.role];

    const allowed = requiredPermissions.every((permission) =>
      granted.includes(permission)
    );

    if (!allowed) {
      next(new AppError(403, "You do not have permission to perform this action."));
      return;
    }

    next();
  };
}
