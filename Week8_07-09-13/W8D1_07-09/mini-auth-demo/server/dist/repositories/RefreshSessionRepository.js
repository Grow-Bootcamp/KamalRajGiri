export class RefreshSessionRepository {
    sessions = [];
    async save(session) {
        const index = this.sessions.findIndex((s) => s.id === session.id);
        if (index >= 0) {
            this.sessions[index] = session;
        }
        else {
            this.sessions.push(session);
        }
    }
    async findById(id) {
        const session = this.sessions.find((s) => s.id === id);
        return session || null;
    }
    async findByTokenHash(tokenHash) {
        const session = this.sessions.find((s) => s.tokenHash === tokenHash);
        return session || null;
    }
    async revokeById(id) {
        const session = this.sessions.find((s) => s.id === id);
        if (session) {
            session.revoked = true;
        }
    }
}
//# sourceMappingURL=RefreshSessionRepository.js.map