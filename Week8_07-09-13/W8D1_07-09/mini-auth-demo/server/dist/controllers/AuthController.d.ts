import type { Request, Response } from "express";
import type { AuthService } from "../services/AuthService.js";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    private cookieOptions;
    login: (req: Request, res: Response) => Promise<void>;
    refresh: (req: Request, res: Response) => Promise<void>;
    logout: (req: Request, res: Response) => Promise<void>;
}
//# sourceMappingURL=AuthController.d.ts.map