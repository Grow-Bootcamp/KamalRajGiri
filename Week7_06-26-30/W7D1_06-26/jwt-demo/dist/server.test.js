"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const vitest_1 = require("vitest");
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = require("./app");
const secret = process.env.JWT_SECRET;
if (!secret) {
    throw new Error("JWT_SECRET is missing from test environment.");
}
(0, vitest_1.describe)("JWT authentication API", () => {
    (0, vitest_1.it)("allows access to the public route", async () => {
        const response = await (0, supertest_1.default)(app_1.app).get("/api/public");
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(response.body.message).toContain("welcome");
    });
    (0, vitest_1.it)("rejects profile access without a token", async () => {
        const response = await (0, supertest_1.default)(app_1.app).get("/api/profile");
        (0, vitest_1.expect)(response.status).toBe(401);
    });
    (0, vitest_1.it)("rejects incorrect login credentials", async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .post("/api/auth/login")
            .send({
            email: "kamal@example.com",
            password: "wrong-password"
        });
        (0, vitest_1.expect)(response.status).toBe(401);
    });
    (0, vitest_1.it)("issues a JWT for valid credentials", async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .post("/api/auth/login")
            .send({
            email: "kamal@example.com",
            password: "Kamal123"
        });
        (0, vitest_1.expect)(response.status).toBe(200);
        (0, vitest_1.expect)(typeof response.body.token).toBe("string");
        const decoded = jsonwebtoken_1.default.verify(response.body.token, secret);
        (0, vitest_1.expect)(decoded).toMatchObject({
            userId: 1,
            email: "kamal@example.com"
        });
    });
    (0, vitest_1.it)("allows access with a valid token", async () => {
        const login = await (0, supertest_1.default)(app_1.app)
            .post("/api/auth/login")
            .send({
            email: "kamal@example.com",
            password: "Kamal123"
        });
        const token = login.body.token;
        const response = await (0, supertest_1.default)(app_1.app)
            .get("/api/profile")
            .set("Authorization", `Bearer ${token}`);
    });
    (0, vitest_1.it)("rejects a tampered token", async () => {
        const login = await (0, supertest_1.default)(app_1.app)
            .post("/api/auth/login")
            .send({
            email: "kamal@example.com",
            password: "Kamal123"
        });
        const token = login.body.token;
        const parts = token.split(".");
        parts[1] = parts[1].slice(0, -1) + (parts[1].endsWith("a") ? "b" : "a");
        const response = await (0, supertest_1.default)(app_1.app)
            .get("/api/profile")
            .set("Authorization", `Bearer ${parts.join(".")}`);
        (0, vitest_1.expect)(response.status).toBe(401);
    });
    (0, vitest_1.it)("rejects an expired token", async () => {
        const expiredToken = jsonwebtoken_1.default.sign({
            userId: 1,
            email: "asha@example.com"
        }, secret, {
            algorithm: "HS256",
            expiresIn: -10
        });
        const response = await (0, supertest_1.default)(app_1.app)
            .get("/api/profile")
            .set("Authorization", `Bearer ${expiredToken}`);
        (0, vitest_1.expect)(response.status).toBe(401);
    });
    (0, vitest_1.it)("rejects an empty bearer token", async () => {
        const response = await (0, supertest_1.default)(app_1.app)
            .get("/api/profile")
            .set("Authorization", "Bearer ");
        (0, vitest_1.expect)(response.status).toBe(401);
    });
});
