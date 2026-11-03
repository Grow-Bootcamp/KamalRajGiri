
import { db } from "../config/database.js";
import type { User } from "../types/user.js";
import type { ResultSetHeader, RowDataPacket } from "mysql2";

export interface RefreshTokenRecord {
    tokenHash: string;
    userId: string;
    expiresAt: number;
}

interface UserRow extends RowDataPacket {
    id: string;
    name: string;
    email: string;
    password_hash: string;
    role: User["role"];
}

interface RefreshTokenRow extends RowDataPacket {
    token_hash: string;
    user_id: string;
    expires_at: number | string;
}

export class UserRepository {

    async findByEmail(email: string): Promise<User | null> {
        const normalizedEmail = email.trim().toLowerCase();

        const [rows] = await db.execute<UserRow[]>(
            `SELECT id, name, email, password_hash, role
             FROM users
             WHERE email = ?
             LIMIT 1`,
            [normalizedEmail]
        );

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return {
            id: row.id,
            name: row.name,
            email: row.email,
            passwordHash: row.password_hash,
            role: row.role,
        };
    }

    async findById(id: string): Promise<User | null> {
        const [rows] = await db.execute<UserRow[]>(
            `SELECT id, name, email, password_hash, role
             FROM users
             WHERE id = ?
             LIMIT 1`,
            [id]
        );

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return {
            id: row.id,
            name: row.name,
            email: row.email,
            passwordHash: row.password_hash,
            role: row.role,
        };
    }

    async create(user: User): Promise<User> {
        await db.execute<ResultSetHeader>(
            `INSERT INTO users
                (id, name, email, password_hash, role)
             VALUES (?, ?, ?, ?, ?)`,
            [
                user.id,
                user.name,
                user.email.trim().toLowerCase(),
                user.passwordHash,
                user.role,
            ]
        );

        return {
            ...user,
            email: user.email.trim().toLowerCase(),
        };
    }

    async saveRefreshToken(
        record: RefreshTokenRecord
    ): Promise<void> {
        await db.execute<ResultSetHeader>(
            `INSERT INTO refresh_tokens
                (token_hash, user_id, expires_at)
             VALUES (?, ?, ?)`,
            [
                record.tokenHash,
                record.userId,
                record.expiresAt,
            ]
        );
    }

    async findRefreshToken(
        tokenHash: string
    ): Promise<RefreshTokenRecord | null> {
        const [rows] = await db.execute<RefreshTokenRow[]>(
            `SELECT token_hash, user_id, expires_at
             FROM refresh_tokens
             WHERE token_hash = ?
             LIMIT 1`,
            [tokenHash]
        );

        if (rows.length === 0) {
            return null;
        }

        const row = rows[0];

        return {
            tokenHash: row.token_hash,
            userId: row.user_id,
            expiresAt: Number(row.expires_at),
        };
    }

    async deleteRefreshToken(tokenHash: string): Promise<void> {
        await db.execute<ResultSetHeader>(
            `DELETE FROM refresh_tokens
             WHERE token_hash = ?`,
            [tokenHash]
        );
    }
}
