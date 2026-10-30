import type { User } from '../models/User.js'
export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}

export class UserRepository implements IUserRepository {
    private users: User[] = [];

    async findByEmail(email: string): Promise<User | null> {
        const normalizedEmail = email.trim().toLowerCase();
        return this.users.find(u => u.email === email) || null;
    }
    async findById(id: string): Promise<User | null> {
        return this.users.find(u => u.id === id) || null;
    }

    public save(user: User): void {
        const normalizedEmail = user.email.trim().toLowerCase();
        const existingUser = this.users.find(u => u.email === user.email);
        if (existingUser) {
            throw new Error('User with this email already exists.');
        }
        this.users.push({ ...user, email: normalizedEmail, });
    }
}