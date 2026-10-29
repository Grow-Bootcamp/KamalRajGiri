export class UserRepository {
    users = [];
    async findByEmail(email) {
        const normalizedEmail = email.trim().toLowerCase();
        return this.users.find(u => u.email === email) || null;
    }
    async findById(id) {
        return this.users.find(u => u.id === id) || null;
    }
    save(user) {
        const normalizedEmail = user.email.trim().toLowerCase();
        const existingUser = this.users.find(u => u.email === user.email);
        if (existingUser) {
            throw new Error('User with this email already exists.');
        }
        this.users.push({ ...user, email: normalizedEmail, });
    }
}
//# sourceMappingURL=UserRepository.js.map