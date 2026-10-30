
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";

import { env } from "../config/env";
import { User } from "../models/user.model";

export function createAccessToken(user: User): string {
  const expiresIn =
    env.JWT_EXPIRES_IN as NonNullable<SignOptions["expiresIn"]>;

  return jwt.sign(
    {
      email: user.email,
      role: user.role,
    },
    env.JWT_SECRET,
    {
      subject: String(user.id),
      expiresIn,
      algorithm: "HS256",
    }
  );
}
