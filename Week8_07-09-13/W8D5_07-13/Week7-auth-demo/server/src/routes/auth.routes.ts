
import { Router } from 'express';

import { UserRepository } from '../repos/user.repo.js';
import { AuthService } from '../services/auth.service.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { authorizeRoles } from '../middleware/authorize.middleware.js';

const router = Router();

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret || jwtSecret.length < 32) {
  throw new Error('JWT_SECRET must be configured with at least 32 characters');
}

const userRepository = new UserRepository();
const authService = new AuthService(userRepository, jwtSecret);

// Admin test 

// if (process.env.NODE_ENV === 'development') {
  // router.post('/dev/promote-admin', async (req, res) => {
  //   const devKey = process.env.DEV_ADMIN_KEY;
  //   const suppliedKey = req.headers['x-dev-admin-key'];
  //   const email = req.body?.email;

  //   if (!devKey || suppliedKey !== devKey) {
  //     return res.status(403).json({ message: 'Forbidden' });
  //   }

  //   if (typeof email !== 'string') {
  //     return res.status(400).json({ message: 'Email is required' });
  //   }

  //   const user = await userRepository.promoteToAdmin(email);

  //   if (!user) {
  //     return res.status(404).json({ message: 'User not found' });
  //   }

  //   const { passwordHash: _passwordHash, ...publicUser } = user;

  //   return res.status(200).json({
  //     message: 'Development user promoted to admin',
  //     user: publicUser,
  //   });
  // });
// }

// Admin test

const REFRESH_COOKIE_NAME = 'refreshToken';

const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/api/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const clearRefreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/api/auth',
};

// REGISTER
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body ?? {};

  if (
    typeof name !== 'string' ||
    typeof email !== 'string' ||
    typeof password !== 'string'
  ) {
    return res.status(400).json({
      message: 'Name, email, and password must be strings',
    });
  }

  try {
    const user = await authService.register({ name, email, password });

    return res.status(201).json({
      message: 'Registration successful',
      user,
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Registration failed';

    const inputErrors = [
      'Name, email, and password are required',
      'Password must be at least 8 characters',
    ];

    if (inputErrors.includes(message)) {
      return res.status(400).json({ message });
    }

    if (message === 'Email is already registered') {
      return res.status(409).json({ message });
    }

    console.error('Registration error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// LOGIN
router.post('/login', async (req, res) => {
  const { email, password } = req.body ?? {};

  if (typeof email !== 'string' || typeof password !== 'string') {
    return res.status(400).json({
      message: 'Email and password must be strings',
    });
  }

  try {
    const result = await authService.login({ email, password });

    const { refreshToken, ...responseData } = result;

    res.cookie(
      REFRESH_COOKIE_NAME,
      refreshToken,
      refreshCookieOptions,
    );

    return res.status(200).json(responseData);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Login failed';

    if (message === 'Email and password are required') {
      return res.status(400).json({ message });
    }

    if (message === 'Invalid credentials') {
      return res.status(401).json({ message });
    }

    console.error('Login error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// REFRESH ACCESS TOKEN
router.post('/refresh', async (req, res) => {
  const refreshToken: unknown = req.cookies?.[REFRESH_COOKIE_NAME];

  if (typeof refreshToken !== 'string') {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  try {
    const result = await authService.refresh(refreshToken);

    const { refreshToken: newRefreshToken, ...responseData } = result;

    res.cookie(
      REFRESH_COOKIE_NAME,
      newRefreshToken,
      refreshCookieOptions,
    );

    return res.status(200).json(responseData);
  } catch (error: unknown) {
    const message =
      error instanceof Error ? error.message : 'Token refresh failed';

    if (message === 'Invalid refresh token') {
      res.clearCookie(REFRESH_COOKIE_NAME, clearRefreshCookieOptions);

      return res.status(401).json({ message });
    }

    console.error('Token refresh error:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

// LOGOUT
router.post('/logout', async (req, res) => {
  const refreshToken: unknown = req.cookies?.[REFRESH_COOKIE_NAME];

  try {
    if (typeof refreshToken === 'string') {
      await authService.logout(refreshToken);
    }

    res.clearCookie(REFRESH_COOKIE_NAME, clearRefreshCookieOptions);

    return res.status(200).json({
      message: 'Logout successful',
    });
  } catch (error: unknown) {
    console.error('Logout error:', error);
    return res.status(500).json({ message: 'Logout failed' });
  }
});

// CURRENT USER
router.get('/me', authenticate, async (req, res) => {
  if (!req.auth) {
    return res.status(401).json({ message: 'Authentication required' });
  }

  const user = await authService.getPublicUserById(req.auth.userId);

  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({ user });
});

// ADMIN-ONLY ROUTE
router.get(
  '/admin',
  authenticate,
  authorizeRoles('admin'),
  (_req, res) => {
    return res.status(200).json({
      message: 'Welcome to the admin area',
    });
  },
);

export default router;
