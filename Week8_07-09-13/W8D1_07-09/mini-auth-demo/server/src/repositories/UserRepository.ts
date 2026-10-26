import type {User} from '../models/User.js'
export interface IUserRepository{
    findByEmail(email: string): Promise < User | null >;
    findById(id: string) : Promise<User |null>;
}