import { Router } from 'express';
import {
  register,
  login,
  displayUsers,
  logout,
  forgot
} from '../controllers/users';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.post('/auth/register', register);
router.post('/auth/login', login);
router.post('/auth/logout', authMiddleware, logout);
router.get('/users', authMiddleware, displayUsers);
router.post('/auth/forgot/:email', forgot);

export default router;
