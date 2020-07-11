import { Router } from 'express';
import { register, login } from '../controllers/users';

const route = Router();

route.post('/auth/register', register);
route.post('/auth/login', login);

export default route;
