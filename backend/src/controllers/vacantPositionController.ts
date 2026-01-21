import { Request, Response } from 'express';
import { HiringRequest } from '../models/HiringRequest';

// Get all vacant positions (Hiring Requests with status VACANT)
export const getVacantPositions = async (req: Request, res: Response): Promise<void> => {
    try {
        // Fetch all hiring requests for now, or filter by 'VACANT' if strict
        // User asked for "post vacante", so logic suggests status='VACANT'
        // But let's return all that are not closed/filled for flexibility
        // Or simply all, and let frontend filter.
        // Given the legacy code seemingly treated them as a separate resource, I'll return HiringRequests mapped to expected "VacantPosition" structure if needed.
        // Ideally, filtering by status "VACANT" or "IN_PROGRESS" makes sense.
        
        const positions = await HiringRequest.find({
            status: { $in: ['VACANT', 'IN_PROGRESS', 'OPEN'] } // 'OPEN' is implied default in many systems, 'VACANT' is explicit here
        }).sort({ createdAt: -1 });

        // Map to frontend expected format if necessary, or just return.
        // Frontend expects: id, jobTitle, service...
        // Mongoose returns _id. Frontend components seem to handle _id/id mismatch now in some places, but let's check.
        // Candidate Create page expects: id, jobTitle, service.

        const mappedPositions = positions.map(pos => ({
            id: pos._id, // Map _id to id for frontend compatibility
            ...pos.toObject()
        }));

        res.json({ success: true, data: mappedPositions });
    } catch (error) {
        console.error('Get vacant positions error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
