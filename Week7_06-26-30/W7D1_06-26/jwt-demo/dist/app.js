"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app = (0, express_1.default)();
exports.app = app;
app.use(express_1.default.json());
const PORT = Number(process.env.PORT ?? 5000);
const secret = process.env.JWT_SECRET;
if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET must be configured with a strong secret.");
}
const JWT_SECRET = secret;
const users = [
    {
        id: 1,
        name: "Kamal",
        email: "kamal@example.com",
        password: "Kamal123"
    }
];
// Public route :no authentication required.
app.get("/api/public", (_req, res) => {
    res.json({
        message: "Hello, Everyone is welcome here."
    });
});
// login routes: validate credentials and issuea JWT
app.post("/api/auth/login", (req, res) => {
    const { email, password } = req.body ?? {};
    if (typeof email !== "string" || typeof password !== "string") {
        return res.status(400).json({
            message: "Email and password are required."
        });
    }
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
        return res.status(401).json({
            message: "Invalid email or password."
        });
    }
    const token = jsonwebtoken_1.default.sign({
        userId: user.id, email: user.email
    }, JWT_SECRET, {
        algorithm: "HS256",
        expiresIn: "1h"
    });
    return res.json({
        message: "Login successful.",
        token
    });
});
// Authentication Middleware.
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        return res.status(401).json({
            message: "Authentication token required."
        });
    }
    const token = authHeader.slice("Bearer ".length).trim();
    if (!token) {
        return res.status(401).json({
            message: "Authentication token required."
        });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET, { algorithms: ["HS256"] });
        if (typeof decoded === "string" || typeof decoded.userId !== "number" || typeof decoded.email !== "string") {
            return res.status(401).json({
                message: "Invalid authentication token."
            });
        }
        req.user = decoded;
        return next();
    }
    catch {
        return res.status(401).json({
            message: "Invalid or expired authentication token."
        });
    }
}
// Protected route: Middleware runs before the handler.
app.get("/api/profile", authenticateToken, (req, res) => {
    return res.json({
        message: `Welcome back, ${req.user.email}`,
        user: {
            id: req.user.userId,
            email: req.user.email
        }
    });
});
