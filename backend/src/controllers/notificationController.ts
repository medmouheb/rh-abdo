import { Request, Response } from 'express';
import { Notification } from '../models/Notification';

// Create notification
export const createNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const notification = new Notification({
            ...req.body,
            createdBy: req.user?.userId,
        });

        await notification.save();
        res.status(201).json({ success: true, data: notification });
    } catch (error) {
        console.error('Create notification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get notifications for current user
export const getMyNotifications = async (req: Request, res: Response): Promise<void> => {
    try {
        const notifications = await Notification.find({ userId: req.user?.userId })
            .sort({ createdAt: -1 })
            .limit(50);

        res.json({ success: true, data: notifications });
    } catch (error) {
        console.error('Get notifications error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const notification = await Notification.findOneAndUpdate(
            { _id: id, userId: req.user?.userId },
            { isRead: true, readAt: new Date() },
            { new: true }
        );

        if (!notification) {
            res.status(404).json({ error: 'Notification not found' });
            return;
        }

        res.json({ success: true, data: notification });
    } catch (error) {
        console.error('Mark notification as read error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Mark all notifications as read
export const markAllAsRead = async (req: Request, res: Response): Promise<void> => {
    try {
        await Notification.updateMany(
            { userId: req.user?.userId, isRead: false },
            { isRead: true, readAt: new Date() }
        );

        res.json({ success: true, message: 'All notifications marked as read' });
    } catch (error) {
        console.error('Mark all as read error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const notification = await Notification.findOneAndDelete({
            _id: id,
            userId: req.user?.userId,
        });

        if (!notification) {
            res.status(404).json({ error: 'Notification not found' });
            return;
        }

        res.json({ success: true, message: 'Notification deleted successfully' });
    } catch (error) {
        console.error('Delete notification error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
