
import type { Request, Response, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { UserRole } from '../types/user.js';

const jwtSecret = process.env.JWT_SECRET as string;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be configured correctly');
}

const validRoles: UserRole[] = ['user', 'moderator', 'admin'];

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const authorization = req.headers.authorization;

  if (!authorization?.startsWith('Bearer ')) {
    return res.status(401).json({
      message: 'Authentication required',
    });
  }

  const token = authorization.slice(7).trim();

  if (!token) {
    return res.status(401).json({
      message: 'Authentication required',
    });
  }

  try {
    const decoded = jwt.verify(token, jwtSecret, {
      algorithms: ['HS256'],
    });

    if (
      typeof decoded === 'string' ||
      typeof decoded.sub !== 'string' ||
      !validRoles.includes(decoded.role as UserRole)
    ) {
      return res.status(401).json({
        message: 'Invalid token',
      });
    }

    const payload = decoded as JwtPayload;

    req.auth = {
      userId: payload.sub!,
      role: payload.role as UserRole,
    };

    next();
  } catch {
    return res.status(401).json({
      message: 'Invalid or expired token',
    });
  }
}
