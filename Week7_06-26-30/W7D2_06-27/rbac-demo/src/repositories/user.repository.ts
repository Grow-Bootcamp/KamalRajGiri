import {User, UserRole} from "../models/user.model";

export interface CreateUserData{
    name : string;
    email: string;
    passwordHash: string;
    role: UserRole;
}

export class UserRepository{
    async findByEmail(email:string): Promise <User | null > {
return User.findOne({where: {email},});
    }
    async findById(id:number): Promise <User | null> {
        return User.findByPk(id);
    }
    async create(data: CreateUserData): Promise <User>{
        return User.create(data);
    }
    async findAllSafe(): Promise<User[]>{
        return User.findAll({
            attributes: [
                "id", "name", "email", "role", "createdAt", "updatedAt",
            ],
        });
    }
    async deleteById(id:number): Promise<number>{
        return User.destroy({
            where : {id},
                });
    }
}

export const userRepository = new UserRepository();