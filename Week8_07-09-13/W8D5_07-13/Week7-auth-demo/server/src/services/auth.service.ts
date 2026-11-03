import {randomUUID, randomBytes, createHash} from 'node:crypto';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { UserRepository } from '../repos/user.repo.js';
import type { User } from '../types/user.js';

export interface RegisterInput{
    name:string;
    email:string;
    password:string;
}

export interface LoginInput{
    email: string;
    password: string;
}

export interface AuthResult{
    accessToken:string;
    refreshToken:string;
    user: PublicUser;
}

export type PublicUser = Omit<User, 'passwordHash'>;

const ACCESS_TOKEN_TIFETIME = '15m';
const REFRESH_TOKEN_LIFETIME_MS = 7 * 24 * 60 * 60 * 1000;

export class AuthService{
    constructor (
        private readonly users:UserRepository,
        private readonly jwtSecret:string,
    ){
        if(jwtSecret.length < 32){
            throw new Error ('JWT_SECRET must be at least 32 characters');
        }
    }

    private createAccessToken(user:User) : string{
        return jwt.sign({
            sub:user.id,
            role:user.role,
        },
    this.jwtSecret,{
        algorithm: 'HS256',
        expiresIn:ACCESS_TOKEN_TIFETIME,
    },);
    }

    private generateRefreshToken():string{
        return randomBytes(64).toString('hex');
    }

    private hashRefreshToken(token:string):string{
        return createHash('sha256').update(token).update(token).digest('hex');
    }

    private async saveRefreshToken(
        token:string,
        userId:string,
    ):Promise<void>{
        await this.users.saveRefreshToken({
            tokenHash:this.hashRefreshToken(token),
            userId,
            expiresAt:Date.now()+ REFRESH_TOKEN_LIFETIME_MS,
        });
    }

      private async createAuthResult(user: User): Promise<AuthResult> {
    const accessToken = this.createAccessToken(user);
    const refreshToken = this.generateRefreshToken();

    await this.saveRefreshToken(refreshToken, user.id);

    const { passwordHash: _passwordHash, ...publicUser } = user;

    return {
      accessToken,
      refreshToken,
      user: publicUser,
    };
  }

    async register(input:RegisterInput):Promise<PublicUser>{
        const name = input.name.trim();
        const email = input.email.trim().toLowerCase();

        if (!name || !email || !input.password){
            throw new Error ('Name, email, and password are required');
        }
        if(input.password.length <8){
            throw new Error ('Password must be at least 8 characters');
        }
        const existingUser = await this.users.findByEmail(email);
        if (existingUser){
            throw new Error('Email is already registered');
        }
        const passwordHash = await bcrypt.hash(input.password, 10);

        const user:User = {
            id: randomUUID(),
            name,
            email,
            role :'user',
            passwordHash,
        };

        const createdUser = await this.users.create(user);

        const {passwordHash: _passwordHash, ...publicUser} = createdUser;
        return publicUser;
    }

 async login(input: LoginInput): Promise<AuthResult> {
  const email = input.email.trim().toLowerCase();

  if (!email || !input.password) {
    throw new Error('Email and password are required');
  }

  const user = await this.users.findByEmail(email);

  if (!user) {
    throw new Error('Invalid credentials');
  }

  const passwordMatches = await bcrypt.compare(
    input.password,
    user.passwordHash,
  );

  if (!passwordMatches) {
    throw new Error('Invalid credentials');
  }
  return this.createAuthResult(user);
  
}

async refresh(refreshToken:string):Promise<AuthResult>{
    if(!refreshToken){
        throw new Error('Invalid refreshtoken');
    }

    const tokenHash = this.hashRefreshToken(refreshToken);
    const storedToken = await this.users.findRefreshToken(tokenHash);

    if(!storedToken){
        throw new Error('Invalid refresh token');
    }

    if(storedToken.expiresAt <= Date.now()){
        await this.users.deleteRefreshToken(tokenHash);
        throw new Error('Invalid refresh token');
    }

    const user = await this.users.findById(storedToken.userId);

    if(!user){
        await this.users.deleteRefreshToken(tokenHash);
        throw new Error('Invalid refresh token');
    }

    await this.users.deleteRefreshToken(tokenHash);

    return this.createAuthResult(user);
}

async logout(refreshToken:string):Promise<void>{
    if(!refreshToken){
        return;
    }
    const tokenHash = this.hashRefreshToken(refreshToken);
    await this.users.deleteRefreshToken(tokenHash);
}

async getPublicUserById(id:string): Promise<PublicUser | null > {
    const user = await this.users.findById(id);

    if (!user){
        return null;
    }

    const {passwordHash: _passwordHash, ...publicUser} = user;

    return publicUser;
}
}