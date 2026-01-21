import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt';

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}

export const authMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    try {
        // Get token from cookies (HTTP-only cookie)
        const token = req.cookies.accessToken;

        if (!token) {
            res.status(401).json({ error: 'Unauthorized - No token provided' });
            return;
        }

        // Verify token
        const decoded = verifyToken(token);

        if (!decoded) {
            res.status(401).json({ error: 'Unauthorized - Invalid token' });
            return;
        }

        // Attach user to request
        req.user = decoded;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        res.status(401).json({ error: 'Unauthorized' });
    }
};
