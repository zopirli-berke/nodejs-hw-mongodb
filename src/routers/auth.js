import { Router } from 'express';
import { ctrlWrapper } from '../utils/index.js';
import { registerUserController } from '../controllers/auth.js';
import { registerSchema } from '../validation/auth.js';
import { validateBody } from '../middlewares/validateBody.js';

const router = Router();

router.post(
  '/register',
  validateBody(registerSchema),
  ctrlWrapper(registerUserController),
);
