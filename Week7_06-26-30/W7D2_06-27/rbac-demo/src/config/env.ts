import "dotenv/config";
import type { SignOptions } from "jsonwebtoken";

const jwtExpiresIn = process.env.JWT_EXPIRES_IN ?? "15m";
function requiredEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

const port = Number(process.env.PORT ?? 5000);
const dbPort = Number(process.env.DB_PORT ?? 3306);

if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error("PORT must be a valid port number");
}

if (!Number.isInteger(dbPort) || dbPort < 1 || dbPort > 65535) {
  throw new Error("DB_PORT must be a valid port number");
}

export const env = {
  PORT: port,
  DB_HOST: requiredEnv("DB_HOST"),
  DB_PORT: dbPort,
  DB_NAME: requiredEnv("DB_NAME"),
  DB_USER: requiredEnv("DB_USER"),
  DB_PASSWORD: process.env.DB_PASSWORD ?? "",
  JWT_SECRET: requiredEnv("JWT_SECRET"),
  JWT_EXPIRES_IN: jwtExpiresIn,
};