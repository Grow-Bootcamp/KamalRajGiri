import type { IUserRepository } from "../repositories/UserRepository.js";
import type { IRefreshSessionRepository } from "../repositories/IRefreshSessionRepository.js";
export interface LoginCredentials {
    email: string;
    password: string;
}
export interface LoginResult {
    accessToken: string;
    refreshToken: string;
}
export declare class AuthService {
    private userRepository;
    private refreshSessionRepository;
    private jwtSecret;
    constructor(userRepository: IUserRepository, refreshSessionRepository: IRefreshSessionRepository, jwtSecret: string);
    private hashToken;
    login(credentials: LoginCredentials): Promise<LoginResult>;
    refresh(incomingRefreshToken: string): Promise<LoginResult>;
    logout(refreshToken: string): Promise<void>;
}
//# sourceMappingURL=AuthService.d.ts.map