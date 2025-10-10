import { Router } from 'express';
import { ctrlWrapper } from '../utils/index.js';
import {
  loginUserController,
  registerUserController,
  refreshUserSessionController,
} from '../controllers/auth.js';
import { registerSchema, loginSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerUserController),
);

router.post(
  '/login',
  validateBody(loginSchema),
  ctrlWrapper(loginUserController),
);

router.post('/refresh', ctrlWrapper(refreshUserSessionController));
