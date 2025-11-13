import { Router } from 'express';
import { authController } from '../controllers/auth.controller.js';
import { registerValidation, loginValidation } from '../middleware/validation.js';
import { authRateLimiter } from '../middleware/rateLimiter.js';

const router = Router();

router.post('/register', authRateLimiter, registerValidation, authController.register);
router.post('/login', authRateLimiter, loginValidation, authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);
router.get('/verify-email/:token', authController.verifyEmail);
router.post('/request-password-reset', authRateLimiter, authController.requestPasswordReset);
router.post('/reset-password/:token', authController.resetPassword);

export default router;
