export class InMemoryUserRepository {
    users;
    constructor(users = []) {
        this.users = users.map(user => ({ ...user }));
    }
    async findById(id) {
        const user = this.users.find(u => u.id === id);
        return user ? { ...user } : null;
    }
    async findByEmail(email) {
        const user = this.users.find(u => u.email === email);
        return user ? { ...user } : null;
    }
}
//# sourceMappingURL=InMemoryUserRepository.js.map