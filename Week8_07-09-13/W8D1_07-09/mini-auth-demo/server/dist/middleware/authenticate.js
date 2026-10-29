import jwt from "jsonwebtoken";
export function createAuthMiddleware(jwtSecret) {
    return (req, res, next) => {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const token = authHeader.split(' ')[1];
        if (!token) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        try {
            const decoded = jwt.verify(token, jwtSecret, { algorithms: ['HS256'], });
            if (typeof decoded !== 'object' || decoded === null) {
                res.status(401).json({ error: 'Invalid token payloaded' });
                return;
            }
            // || typeof (decoded as Record<string,unknown>).sub !== 'string' || 
            // !['user','admin'].includes((decoded as Record<string, unknown>).role as string)
            const payload = decoded;
            if (typeof payload.sub !== 'string' || typeof payload.role !== 'string' || !['user', 'admin'].includes(payload.role)) {
                res.status(401).json({ error: 'Invalid token payload ' });
                return;
            }
            req.auth = {
                userId: payload.sub,
                role: payload.role,
            };
            next();
        }
        catch (err) {
            res.status(401).json({ error: 'Invalid or expired token' });
        }
    };
}
//# sourceMappingURL=authenticate.js.map