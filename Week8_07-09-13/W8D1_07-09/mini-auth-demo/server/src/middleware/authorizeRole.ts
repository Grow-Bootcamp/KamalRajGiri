import type { Request, Response, NextFunction } from "express";
import type { UserRole } from "../models/User.js";

export function authorizeRole ( ...allowedRoles: UserRole[]){
    return (req:Request, res:Response, next : NextFunction) : void => {
        if(!req.auth){
            res.status(401).json({error: 'Authentication required'});
            return;
        }
        const {role} = req.auth;

        if(!allowedRoles.includes(role)){
            res.status(403).json({error: 'Forbidden: Insufficient Permissions'});
            return;
        }

        next();
    };
}