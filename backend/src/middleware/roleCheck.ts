import { Request, Response, NextFunction } from 'express';

type UserRole = 'rh' | 'manager' | 'directeur';

export const requireRole = (allowedRoles: UserRole[]) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized - User not authenticated' });
            return;
        }

        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({
                error: 'Forbidden - Insufficient permissions',
                required: allowedRoles,
                current: req.user.role,
            });
            return;
        }

        next();
    };
};

// Specific role middleware shortcuts
export const requireRH = requireRole(['rh']);
export const requireManagerOrAbove = requireRole(['rh', 'manager', 'directeur','co']);
export const requireDirecteurOrRH = requireRole(['rh', 'directeur']);
