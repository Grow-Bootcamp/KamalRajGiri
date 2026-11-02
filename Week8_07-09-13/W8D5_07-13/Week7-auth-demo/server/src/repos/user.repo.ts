import type { User } from "../types/user.js";

export interface RefreshTokenRecord{
    tokenHash:string;
    userId: string;
    expiresAt:number;
}

export class UserRepository{
    private users = new Map<string, User> ();
    private refreshTokens = new Map<string, RefreshTokenRecord>();
// admin test 
//     async promoteToAdmin(email: string): Promise<User | null> {
//   const user = await this.findByEmail(email);

//   if (!user) {
//     return null;
//   }

//   user.role = 'admin';
//   this.users.set(user.id, { ...user });

//   return { ...user };
// }
// admin test

    async findByEmail(email:string): Promise<User | null>{
        const normalizedEmail = email.trim().toLowerCase();
        for (const user of this.users.values()){
            if(user.email === normalizedEmail){
                return {...user};
            }
        }
        return null;
    }
    async findById(id:string):Promise<User | null>{
        const user = this.users.get(id);
        return user ? {...user} : null;
    }
    async create(user:User):Promise<User>{
        this.users.set(user.id, {...user});
        return {...user};
    }

    async saveRefreshToken(record: RefreshTokenRecord,) : Promise<void>{
        this.refreshTokens.set(record.tokenHash, {...record});
    }

    async findRefreshToken(tokenHash:string,): Promise<RefreshTokenRecord | null>{
        const record = this.refreshTokens.get(tokenHash);
        return record ? {...record} : null;
    }

    async deleteRefreshToken(tokenHash:string):Promise<void>{
        this.refreshTokens.delete(tokenHash);
    }
}