import type { UserRole } from '../types/user.js';

const roleHierarchy : Record<UserRole, number> = {
    user: 1,
    moderator: 2,
    admin: 3
};

export function hasMinimumRole(actualRole:UserRole,
    requiredRole: UserRole,
): boolean {
    return roleHierarchy[actualRole] >= roleHierarchy[requiredRole];
}