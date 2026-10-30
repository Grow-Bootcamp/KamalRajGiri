
import bcrypt from "bcrypt";
import { UniqueConstraintError } from "sequelize";

import { userRepository } from "../repositories/user.repository";
import { AppError } from "../utils/app-error";
import { createAccessToken } from "../utils/jwt";
import { User } from "../models/user.model";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

function toPublicUser(user: User) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    createdAt: user.createdAt,
  };
}

export class AuthService {
  async register(input: RegisterInput) {
    const name = input.name?.trim();
    const email = input.email?.trim().toLowerCase();
    const password = input.password;

    if (!name || !email || typeof password !== "string") {
      throw new AppError(400, "Name, email, and password are required.");
    }

    if (name.length > 100) {
      throw new AppError(400, "Name must be 100 characters or fewer.");
    }

    if (password.length < 8) {
      throw new AppError(400, "Password must be at least 8 characters.");
    }

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new AppError(409, "An account with this email already exists.");
    }

    const passwordHash = await bcrypt.hash(password, 12);

    try {
      const user = await userRepository.create({
        name,
        email,
        passwordHash,
        role: "user",
      });

      return {
        user: toPublicUser(user),
        token: createAccessToken(user),
      };
    } catch (error) {
      // Also handle a duplicate email caused by simultaneous requests.
      if (error instanceof UniqueConstraintError) {
        throw new AppError(409, "An account with this email already exists.");
      }

      throw error;
    }
  }

  async login(input: LoginInput) {
    const email = input.email?.trim().toLowerCase();
    const password = input.password;

    if (!email || typeof password !== "string" || !password) {
      throw new AppError(400, "Email and password are required.");
    }

    const user = await userRepository.findByEmail(email);

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new AppError(401, "Invalid email or password.");
    }

    return {
      user: toPublicUser(user),
      token: createAccessToken(user),
    };
  }
}

export const authService = new AuthService();
