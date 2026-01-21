import { Request, Response } from 'express';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/jwt';

export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password } = req.body;

        // Validate input
        if (!username || !password) {
            res.status(400).json({ error: 'Username and password are required' });
            return;
        }

        // Find user
        const user = await User.findOne({ username });
        if (!user) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Check password
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ error: 'Invalid credentials' });
            return;
        }

        // Generate tokens
        const accessToken = generateAccessToken({
            userId: user._id.toString(),
            username: user.username,
            role: user.role,
        });

        const refreshToken = generateRefreshToken({
            userId: user._id.toString(),
            username: user.username,
            role: user.role,
        });

        // Set HTTP-only cookies
        const isDevelopment = process.env.NODE_ENV === 'development';

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: !isDevelopment, // true in production
            sameSite: isDevelopment ? 'lax' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            domain: process.env.COOKIE_DOMAIN,
        });

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: !isDevelopment,
            sameSite: isDevelopment ? 'lax' : 'strict',
            maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
            domain: process.env.COOKIE_DOMAIN,
        });

        // Send user data (without password)
        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        // Clear cookies
        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ error: 'Unauthorized' });
            return;
        }

        const user = await User.findById(req.user.userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({
            id: user._id,
            username: user.username,
            role: user.role,
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
