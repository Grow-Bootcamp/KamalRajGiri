import type { RefreshSession } from "../models/RefreshSession.js";
import type { IRefreshSessionRepository } from "./IRefreshSessionRepository.js";

export class RefreshSessionRepository implements IRefreshSessionRepository{
    private sessions: RefreshSession[]=[];

    public async save(session: RefreshSession): Promise<void>{
        const index = this.sessions.findIndex((s)=> s.id=== session.id);
        if(index >= 0){
            this.sessions[index]= session;
        }else {
            this.sessions.push(session);
        }
    }
    public async findById(id:string): Promise<RefreshSession | null>{
        const session = this.sessions.find((s)=> s.id === id);
        return session || null;
    }

    public async findByTokenHash (tokenHash: string): Promise<RefreshSession | null > {
        const session = this.sessions.find((s)=>s.tokenHash === tokenHash);
        return session || null ;
    }

    public async revokeById(id:string): Promise<void>{
        const session = this.sessions.find((s)=> s.id=== id);
        if(session){
            session.revoked = true;
        }
    }
}