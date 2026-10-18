import { Router } from 'express';
import { register, login, getCurrentUser } from '../controllers/auth.controller';
import { requireAuth } from '../middleware/auth';
import { validateRequest } from '../middleware/validate';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const router = Router();

router.post('/register', validateRequest(registerSchema), register);
router.post('/login', validateRequest(loginSchema), login);
router.get('/me', requireAuth, getCurrentUser);

export default router;
