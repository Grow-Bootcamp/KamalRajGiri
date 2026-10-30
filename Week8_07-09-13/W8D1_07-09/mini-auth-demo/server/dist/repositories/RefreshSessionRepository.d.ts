import type { RefreshSession } from "../models/RefreshSession.js";
import type { IRefreshSessionRepository } from "./IRefreshSessionRepository.js";
export declare class RefreshSessionRepository implements IRefreshSessionRepository {
    private sessions;
    save(session: RefreshSession): Promise<void>;
    findById(id: string): Promise<RefreshSession | null>;
    findByTokenHash(tokenHash: string): Promise<RefreshSession | null>;
    revokeById(id: string): Promise<void>;
}
//# sourceMappingURL=RefreshSessionRepository.d.ts.map