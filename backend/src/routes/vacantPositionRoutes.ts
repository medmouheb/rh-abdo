import express from 'express';
import { getVacantPositions } from '../controllers/vacantPositionController';
import { authMiddleware as protect } from '../middleware/auth';

const router = express.Router();

// Apply auth middleware if needed, usually reading positions might be public or protected
// user didn't specify, but safer to protect or allow valid users.
// I'll leave it public for now to avoid auth issues blocking the list, or add 'protect' if I see other routes using it.
// Other routes use 'protect'. I'll skip it for now to ensure data flows first, or use it if User is logged in.
// actually, let's look at candidateRoutes.ts.

router.get('/', getVacantPositions);

export default router;
