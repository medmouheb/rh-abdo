import { Request, Response } from 'express';
import { User } from '../models/User';

// Create user (RH only)
export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, password, role } = req.body;
        console.log('Create user request body:', req.body);

        // Validate input
        if (!username || !password || !role) {
            res.status(400).json({ error: 'Username, password, and role are required' });
            return;
        }

        // Validate role
        if (!['rh', 'manager', 'directeur','co'].includes(role)) {
            res.status(400).json({ error: 'Invalid role. Must be rh, manager, or directeur' });
            return;
        }

        // Check if user already exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            res.status(409).json({ error: 'Username already exists' });
            return;
        }

        // Create user
        const user = new User({
            username,
            password,
            role,
        });

        await user.save();

        res.status(201).json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Create user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all users (RH only)
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const users = await User.find().select('-password');
        res.json({ success: true, users });
    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get user by ID (RH only)
export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select('-password');
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ success: true, user });
    } catch (error) {
        console.error('Get user by ID error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update user (RH only)
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { username, password, role } = req.body;

        const user = await User.findById(id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Update fields
        if (username) user.username = username;
        if (password) user.password = password; // Will be hashed by pre-save hook
        if (role) {
            if (!['rh', 'manager', 'directeur','co'].includes(role)) {
                res.status(400).json({ error: 'Invalid role. Must be rh, manager, or directeur' });
                return;
            }
            user.role = role;
        }

        await user.save();

        res.json({
            success: true,
            user: {
                id: user._id,
                username: user.username,
                role: user.role,
            },
        });
    } catch (error) {
        console.error('Update user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete user (RH only)
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const user = await User.findByIdAndDelete(id);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
