import type { User } from '../models/User.js';
export interface IUserRepository {
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}
export declare class UserRepository implements IUserRepository {
    private users;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    save(user: User): void;
}
//# sourceMappingURL=UserRepository.d.ts.map