import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../models/User.js";
export declare function authorizeRole(...allowedRoles: UserRole[]): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authorizeRole.d.ts.map