export function authorizeRole(...allowedRoles) {
    return (req, res, next) => {
        if (!req.auth) {
            res.status(401).json({ error: 'Authentication required' });
            return;
        }
        const { role } = req.auth;
        if (!allowedRoles.includes(role)) {
            res.status(403).json({ error: 'Forbidden: Insufficient Permissions' });
            return;
        }
        next();
    };
}
//# sourceMappingURL=authorizeRole.js.map