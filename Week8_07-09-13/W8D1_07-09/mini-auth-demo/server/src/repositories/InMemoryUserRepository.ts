import type { IUserRepository } from "./UserRepository.js";
import type { User } from "../models/User.js";

export class InMemoryUserRepository implements IUserRepository{
private users: User[];
constructor (users: User[]= []){
    this.users = users.map(user => ({ ...user}));
}

async findById(id: string): Promise<User | null> {
    const user = this.users.find(u => u.id === id);
    return user ? {...user} : null;
}

async findByEmail(email: string): Promise<User | null> {
    const user = this.users.find(u => u.email === email);
    return user ? {...user} : null;
}
}