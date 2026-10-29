import express from "express";
import "dotenv/config";
import cors from 'cors';
import bcrypt from 'bcrypt';
import cookieParser from "cookie-parser";
import { AuthService } from "./services/AuthService.js";
import { AuthController } from "./controllers/AuthController.js";
import { UserRepository } from "./repositories/UserRepository.js";
import { RefreshSessionRepository } from "./repositories/RefreshSessionRepository.js";
import { createAuthRoute } from "./routes/authRoutes.js";
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('FATAL: JWT_SECRET environment variable is missing.');
}
if (JWT_SECRET.length < 32) {
    throw new Error('FATAL: JWT_SECRET must be at least 32 characters long.');
}
const app = express();
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(cookieParser());
const userRepository = new UserRepository();
const refreshSessionRepository = new RefreshSessionRepository();
const seedUsers = async () => {
    const hashedPassword = await bcrypt.hash('password123', 10);
    await userRepository.save({
        id: '1',
        email: 'user@example.com',
        passwordHash: hashedPassword,
        role: 'user',
        createdAt: new Date(),
    });
    await userRepository.save({
        id: '2',
        email: 'admin@example.com',
        passwordHash: hashedPassword,
        role: 'admin',
        createdAt: new Date(),
    });
};
await seedUsers();
const authService = new AuthService(userRepository, refreshSessionRepository, JWT_SECRET);
const authController = new AuthController(authService);
const authRouter = createAuthRoute(authController, JWT_SECRET);
app.use('/api/auth', authRouter);
export default app;
//# sourceMappingURL=app.js.map