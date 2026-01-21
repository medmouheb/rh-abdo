import { Request, Response } from 'express';
import { Candidate } from '../models/Candidate';
import { CandidateStatusHistory } from '../models/CandidateStatusHistory';

// Create candidate
export const createCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
        const candidate = new Candidate(req.body);
        await candidate.save();

        // Create status history entry
        await CandidateStatusHistory.create({
            candidateId: candidate._id,
            newStatus: candidate.status,
            statusLabel: 'Initial Status',
            changedBy: req.user?.userId,
        });

        res.status(201).json({ success: true, data: candidate });
    } catch (error) {
        console.error('Create candidate error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get all candidates
export const getCandidates = async (req: Request, res: Response): Promise<void> => {
    try {
        const candidates = await Candidate.find().populate('hiringRequestId');
        res.json({ success: true, data: candidates });
    } catch (error) {
        console.error('Get candidates error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get candidate by ID
export const getCandidateById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const candidate = await Candidate.findById(id).populate('hiringRequestId');
        if (!candidate) {
            res.status(404).json({ error: 'Candidate not found' });
            return;
        }

        res.json({ success: true, data: candidate });
    } catch (error) {
        console.error('Get candidate error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Update candidate
export const updateCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const oldCandidate = await Candidate.findById(id);
        if (!oldCandidate) {
            res.status(404).json({ error: 'Candidate not found' });
            return;
        }

        const candidate = await Candidate.findByIdAndUpdate(
            id,
            { ...req.body },
            { new: true, runValidators: true }
        ).populate('hiringRequestId');

        // If status changed, create history entry
        if (req.body.status && req.body.status !== oldCandidate.status) {
            await CandidateStatusHistory.create({
                candidateId: candidate!._id,
                oldStatus: oldCandidate.status,
                newStatus: req.body.status,
                statusLabel: req.body.statusLabel || req.body.status,
                changedBy: req.user?.userId,
                comments: req.body.statusComments,
                reason: req.body.statusReason,
            });
        }

        res.json({ success: true, data: candidate });
    } catch (error) {
        console.error('Update candidate error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Delete candidate
export const deleteCandidate = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const candidate = await Candidate.findByIdAndDelete(id);
        if (!candidate) {
            res.status(404).json({ error: 'Candidate not found' });
            return;
        }

        res.json({ success: true, message: 'Candidate deleted successfully' });
    } catch (error) {
        console.error('Delete candidate error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Get candidate status history
export const getCandidateStatusHistory = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;

        const history = await CandidateStatusHistory.find({ candidateId: id })
            .populate('changedBy', 'username role')
            .sort({ createdAt: -1 });

        res.json({ success: true, data: history });
    } catch (error) {
        console.error('Get candidate status history error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Upload candidate documents
export const uploadCandidateDocuments = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const { id } = req.params;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const candidate = await Candidate.findById(id);
        if (!candidate) {
            res.status(404).json({ error: 'Candidate not found' });
            return;
        }

        // Update file paths
        if (files.cv && files.cv[0]) {
            candidate.cvPath = `/uploads/${files.cv[0].filename}`;
        }
        if (files.documents && files.documents[0]) {
            candidate.documentsPath = `/uploads/${files.documents[0].filename}`;
        }

        await candidate.save();

        res.json({ success: true, data: candidate });
    } catch (error) {
        console.error('Upload candidate documents error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
