import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
export class AuthService {
    userRepository;
    refreshSessionRepository;
    jwtSecret;
    constructor(userRepository, refreshSessionRepository, jwtSecret) {
        this.userRepository = userRepository;
        this.refreshSessionRepository = refreshSessionRepository;
        this.jwtSecret = jwtSecret;
    }
    hashToken(token) {
        return crypto.createHash('sha256').update(token).digest('hex');
    }
    async login(credentials) {
        // Normalize email address
        const normalizedEmail = credentials.email.trim().toLowerCase();
        // Find user by email via the repositories
        const user = await this.userRepository.findByEmail(normalizedEmail);
        // Reject invalid credentials
        if (!user) {
            throw new Error('Invalid credentials');
        }
        // Verify password with bcrypt
        const isPasswordValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid credentials');
        }
        // Build payload containing ID (sub) and role (never include passwordHash)
        const payload = {
            sub: user.id,
            role: user.role,
        };
        const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '1m' });
        const refreshToken = crypto.randomBytes(32).toString('hex');
        const tokenHash = this.hashToken(refreshToken);
        const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        const session = {
            id: crypto.randomUUID(),
            userId: user.id,
            tokenHash,
            expiresAt,
            revoked: false,
        };
        await this.refreshSessionRepository.save(session);
        return { accessToken, refreshToken };
    }
    async refresh(incomingRefreshToken) {
        const tokenHash = this.hashToken(incomingRefreshToken);
        const session = await this.refreshSessionRepository.findByTokenHash(tokenHash);
        if (!session) {
            throw new Error('Invalid refresh token');
        }
        if (session.revoked) {
            // Security measure: if a revoked token is reused, consider revoking all sessions for this user family
            throw new Error('Refresh token reuse detected (Revoked session)');
        }
        if (session.expiresAt.getTime() <= Date.now()) {
            throw new Error('Refresh token has expired');
        }
        // 4. Verify the associated user still exists
        // (Assuming userRepository has a findById method)
        const user = await this.userRepository.findById(session.userId);
        if (!user) {
            throw new Error('User no longer exists');
        }
        // 5. Rotate: Revoke the old session
        await this.refreshSessionRepository.revokeById(session.id);
        // 6. Issue a new access token and a brand-new replacement refresh token
        const payload = {
            sub: user.id,
            role: user.role,
        };
        const accessToken = jwt.sign(payload, this.jwtSecret, { expiresIn: '1m' });
        const newRefreshToken = crypto.randomBytes(32).toString('hex');
        const newTokenHash = this.hashToken(newRefreshToken);
        const newSession = {
            id: crypto.randomUUID(),
            userId: user.id,
            tokenHash: newTokenHash,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            revoked: false,
        };
        await this.refreshSessionRepository.save(newSession);
        return {
            accessToken,
            refreshToken: newRefreshToken,
        };
    }
    async logout(refreshToken) {
        const tokenHash = this.hashToken(refreshToken);
        const session = await this.refreshSessionRepository.findByTokenHash(tokenHash);
        if (session) {
            await this.refreshSessionRepository.revokeById(session.id);
        }
    }
}
//# sourceMappingURL=AuthService.js.map