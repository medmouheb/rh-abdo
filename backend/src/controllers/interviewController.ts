import { Request, Response } from 'express';
import { Interview } from '../models/Interview';

// Create interview
export const createInterview = async (req: Request, res: Response): Promise<void> => {
    try {
        const interview = new Interview({
            ...req.body,
            interviewerId: req.user?.userId,
        });

        await interview.save();
        await interview.populate('candidateId');
        await interview.populate('interviewerId', 'username role');

        res.status(201).json({ success: true, data: interview });
    } catch (error) {
        console.error('Create interview error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all interviews
export const getInterviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const interviews = await Interview.find()
            .populate('candidateId')
            .populate('interviewerId', 'username role')
            .sort({ scheduledAt: -1 });

        res.json({ success: true, data: interviews });
    } catch (error) {
        console.error('Get interviews error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get interview by ID
export const getInterviewById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const interview = await Interview.findById(id)
            .populate('candidateId')
            .populate('interviewerId', 'username role');

        if (!interview) {
            res.status(404).json({ error: 'Interview not found' });
            return;
        }

        res.json({ success: true, data: interview });
    } catch (error) {
        console.error('Get interview error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update interview
export const updateInterview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const interview = await Interview.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true, runValidators: true }
        )
            .populate('candidateId')
            .populate('interviewerId', 'username role');

        if (!interview) {
            res.status(404).json({ error: 'Interview not found' });
            return;
        }

        res.json({ success: true, data: interview });
    } catch (error) {
        console.error('Update interview error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete interview
export const deleteInterview = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const interview = await Interview.findByIdAndDelete(id);
        if (!interview) {
            res.status(404).json({ error: 'Interview not found' });
            return;
        }

        res.json({ success: true, message: 'Interview deleted successfully' });
    } catch (error) {
        console.error('Delete interview error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
