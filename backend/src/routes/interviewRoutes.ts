import { Router } from 'express';
import {
    createInterview,
    getInterviews,
    getInterviewById,
    updateInterview,
    deleteInterview,
} from '../controllers/interviewController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', createInterview);
router.get('/', getInterviews);
router.get('/:id', getInterviewById);
router.put('/:id', updateInterview);
router.delete('/:id', deleteInterview);

export default router;
