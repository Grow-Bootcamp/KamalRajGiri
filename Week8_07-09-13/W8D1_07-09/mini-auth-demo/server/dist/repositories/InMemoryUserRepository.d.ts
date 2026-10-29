import type { IUserRepository } from "./UserRepository.js";
import type { User } from "../models/User.js";
export declare class InMemoryUserRepository implements IUserRepository {
    private users;
    constructor(users?: User[]);
    findById(id: string): Promise<User | null>;
    findByEmail(email: string): Promise<User | null>;
}
//# sourceMappingURL=InMemoryUserRepository.d.ts.map