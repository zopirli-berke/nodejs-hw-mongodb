import { Router } from 'express';
import { ctrlWrapper } from '../utils/index.js';
import {
  loginUserController,
  registerUserController,
  refreshUserSessionController,
  logoutUserController,
  requestResetEmailController,
} from '../controllers/auth.js';
import {
  registerSchema,
  loginSchema,
  requestResetEmailSchema,
} from '../validation/auth.js';
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

router.post('/logout', ctrlWrapper(logoutUserController));

router.post(
  '/send-reset-email',
  validateBody(requestResetEmailSchema),
  ctrlWrapper(requestResetEmailController),
);

export default router;
