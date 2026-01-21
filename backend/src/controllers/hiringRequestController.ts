import { Request, Response } from 'express';
import { HiringRequest } from '../models/HiringRequest';

// Create hiring request
export const createHiringRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const hiringRequest = new HiringRequest({
            ...req.body,
            recruiterId: req.user?.userId,
        });

        await hiringRequest.save();
        res.status(201).json({ success: true, data: hiringRequest });
    } catch (error) {
        console.error('Create hiring request error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all hiring requests
export const getHiringRequests = async (req: Request, res: Response): Promise<void> => {
    try {
        const hiringRequests = await HiringRequest.find().populate('recruiterId', 'username role');
        res.json({ success: true, data: hiringRequests });
    } catch (error) {
        console.error('Get hiring requests error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get hiring request by ID
export const getHiringRequestById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const hiringRequest = await HiringRequest.findById(id).populate('recruiterId', 'username role');
        if (!hiringRequest) {
            res.status(404).json({ error: 'Hiring request not found' });
            return;
        }

        res.json({ success: true, data: hiringRequest });
    } catch (error) {
        console.error('Get hiring request error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update hiring request
export const updateHiringRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const hiringRequest = await HiringRequest.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true, runValidators: true }
        ).populate('recruiterId', 'username role');

        if (!hiringRequest) {
            res.status(404).json({ error: 'Hiring request not found' });
            return;
        }

        res.json({ success: true, data: hiringRequest });
    } catch (error) {
        console.error('Update hiring request error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete hiring request
export const deleteHiringRequest = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const hiringRequest = await HiringRequest.findByIdAndDelete(id);
        if (!hiringRequest) {
            res.status(404).json({ error: 'Hiring request not found' });
            return;
        }

        res.json({ success: true, message: 'Hiring request deleted successfully' });
    } catch (error) {
        console.error('Delete hiring request error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
