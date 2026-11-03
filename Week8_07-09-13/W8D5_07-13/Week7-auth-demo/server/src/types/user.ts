export type UserRole = "user" | "moderator" | "admin";

export interface User {
    id: string;
    name: string;
    email: string;
    role: UserRole;
    passwordHash: string;
}