import { Router } from 'express';
import {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
} from '../controllers/userController';
import { authMiddleware } from '../middleware/auth';
import { requireRH } from '../middleware/roleCheck';

const router = Router();

// All routes require authentication and RH role
router.use(authMiddleware);
router.use(requireRH);

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
