import type { RefreshSession } from "../models/RefreshSession.js";

export interface IRefreshSessionRepository{
    save(session:RefreshSession): Promise<void>;
    findById(id:string): Promise<RefreshSession |null>;
    findByTokenHash(tokenHash: string):Promise<RefreshSession | null>;
    revokeById(id:string):Promise<void>;
}