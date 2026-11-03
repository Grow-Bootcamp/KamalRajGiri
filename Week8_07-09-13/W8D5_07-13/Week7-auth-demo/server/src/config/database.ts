
import mysql, { type Pool } from "mysql2/promise";

const requiredEnv = [
    "DB_HOST",
    "DB_PORT",
    "DB_USER",
    "DB_PASSWORD",
    "DB_NAME",
] as const;

for (const key of requiredEnv) {
    if (process.env[key] === undefined) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}

export const db: Pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,

    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,

    enableKeepAlive: true,
});
