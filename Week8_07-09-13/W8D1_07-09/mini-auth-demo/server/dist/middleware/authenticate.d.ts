import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../models/User.js";
export interface AuthenticatedUser {
    userId: string;
    role: UserRole;
}
declare global {
    namespace Express {
        interface Request {
            auth?: AuthenticatedUser;
        }
    }
}
export declare function createAuthMiddleware(jwtSecret: string): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authenticate.d.ts.map