import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { UserRole } from "../models/User.js";

export interface AuthenticatedUser {
    userId: string;
    role: UserRole;
}

declare global{
    namespace Express{
        interface Request{
           auth?: AuthenticatedUser;
        }
    }
}

export function createAuthMiddleware(jwtSecret: string){
return  (req: Request , res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        res.status(401).json({error: 'Authentication required'});
        return;
    }
    const token =  authHeader.split(' ')[1];
    if(!token){
        res.status(401).json({error: 'Authentication required'});
        return;
    }

    try{
        const decoded = jwt.verify(token , jwtSecret , {algorithms: ['HS256'],});

        if (
            typeof decoded !== 'object' || decoded === null 
        ){
            res.status(401).json({error: 'Invalid token payloaded'});
            return;
        }

        // || typeof (decoded as Record<string,unknown>).sub !== 'string' || 
            // !['user','admin'].includes((decoded as Record<string, unknown>).role as string)
        const payload = decoded as Record<string,unknown>;

        if(
            typeof payload.sub !== 'string' || typeof payload.role !== 'string' || !['user', 'admin'].includes(payload.role)
        ){
            res.status(401).json({ error: 'Invalid token payload '});
            return;
        }

        req.auth = {
            userId: payload.sub,
            role: payload.role as UserRole,
        };

        next();
    }catch (err){
        res.status(401).json({error: 'Invalid or expired token'});
    }
};
}
