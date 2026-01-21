import { Router } from 'express';
import {
    createHiringRequest,
    getHiringRequests,
    getHiringRequestById,
    updateHiringRequest,
    deleteHiringRequest,
} from '../controllers/hiringRequestController';
import { authMiddleware } from '../middleware/auth';
import { requireRole } from '../middleware/roleCheck';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', requireRole(['rh', 'manager', 'directeur']), createHiringRequest);
router.get('/', getHiringRequests);
router.get('/:id', getHiringRequestById);
router.put('/:id', requireRole(['rh', 'manager', 'directeur']), updateHiringRequest);
router.delete('/:id', requireRole(['rh', 'manager', 'directeur']), deleteHiringRequest);

export default router;
