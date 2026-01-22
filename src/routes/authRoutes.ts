import { Router } from 'express';
import { AuthController } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { authRateLimiter } from '../middleware/rateLimiter';
import { uploadProfilePicture } from '../middleware/upload';

const router = Router();

// Public routes
router.post(
  '/register',
  authRateLimiter,
  validate(AuthController.registerValidations),
  AuthController.register
);

router.post(
  '/login',
  authRateLimiter,
  validate(AuthController.loginValidations),
  AuthController.login
);

router.post(
  '/refresh-token',
  validate(AuthController.refreshTokenValidations),
  AuthController.refreshToken
);

// Protected routes
router.get(
  '/me',
  authenticate,
  AuthController.getCurrentUser
);

router.patch(
  '/profile',
  authenticate,
  validate(AuthController.updateProfileValidations),
  AuthController.updateProfile
);

router.post(
  '/profile/picture',
  authenticate,
  uploadProfilePicture,
  AuthController.uploadProfilePicture
);

export default router;
