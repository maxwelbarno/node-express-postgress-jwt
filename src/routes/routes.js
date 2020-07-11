import { Router } from 'express';
import { register, login, displayUsers } from '../controllers/users';
import { authMiddleware } from '../middleware/auth';

const route = Router();

route.post('/auth/register', register);
route.post('/auth/login', login);
route.get('/users', authMiddleware, displayUsers);

export default route;
