import { Router } from "express";
import { createAuthMiddleware } from "../middleware/authenticate.js";
import { authorizeRole } from "../middleware/authorizeRole.js";
export function createAuthRoute(authController, jwtSecret) {
    const router = Router();
    const authenticate = createAuthMiddleware(jwtSecret);
    router.post('/login', authController.login);
    router.post('/refresh', authController.refresh);
    router.post('/logout', authController.logout);
    router.get('/profile', authenticate, authorizeRole('user', 'admin'), (req, res) => {
        res.status(200).json({ message: 'Welcome to your profile', user: req.auth });
    });
    router.get('/admin', authenticate, authorizeRole('admin'), (req, res) => {
        res.status(200).json({ message: 'Welcome to the admin Dashboard', user: req.auth });
    });
    return router;
}
//# sourceMappingURL=authRoutes.js.map