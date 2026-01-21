import { Router } from 'express';
import {
    createCandidate,
    getCandidates,
    getCandidateById,
    updateCandidate,
    deleteCandidate,
    getCandidateStatusHistory,
    uploadCandidateDocuments,
} from '../controllers/candidateController';
import { authMiddleware } from '../middleware/auth';
import { upload } from '../middleware/upload';

const router = Router();

// All routes require authentication
router.use(authMiddleware);

router.post('/', createCandidate);
router.get('/', getCandidates);
router.get('/:id', getCandidateById);
router.put('/:id', updateCandidate);
router.delete('/:id', deleteCandidate);
router.get('/:id/status-history', getCandidateStatusHistory);
router.post(
    '/:id/upload',
    upload.fields([
        { name: 'cv', maxCount: 1 },
        { name: 'documents', maxCount: 1 },
    ]),
    uploadCandidateDocuments
);

export default router;
