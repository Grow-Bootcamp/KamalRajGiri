import type { UserRole } from "../models/user.model";

export interface AuthenticatedUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  createdAt: Date;
}