import { Router } from 'express';
import { IncidentController } from '../controllers/incidentController';
import { authenticate, authorize } from '../middleware/auth';
import { validate } from '../middleware/validator';
import { generalRateLimiter, incidentCreationRateLimiter } from '../middleware/rateLimiter';
import { uploadIncidentImages } from '../middleware/upload';
import { UserRole } from '../types';

const router = Router();

// Public route - Get verified alerts (no auth required)
router.get(
  '/alerts/verified',
  generalRateLimiter,
  IncidentController.getVerifiedAlerts
);

// Protected routes - Public users
router.post(
  '/',
  authenticate,
  authorize(UserRole.PUBLIC_USER, UserRole.ADMIN, UserRole.AUTHORITY),
  incidentCreationRateLimiter,
  uploadIncidentImages, // Handle image uploads (max 5)
  validate(IncidentController.createIncidentValidations),
  IncidentController.createIncident
);

router.get(
  '/',
  authenticate,
  authorize(UserRole.PUBLIC_USER, UserRole.ADMIN, UserRole.AUTHORITY),
  generalRateLimiter,
  validate(IncidentController.getIncidentsValidations),
  IncidentController.getIncidents
);

router.get(
  '/:id',
  authenticate,
  authorize(UserRole.PUBLIC_USER, UserRole.ADMIN, UserRole.AUTHORITY),
  generalRateLimiter,
  validate(IncidentController.getIncidentValidations),
  IncidentController.getIncident
);

// Admin/Authority only routes
router.patch(
  '/:id/status',
  authenticate,
  authorize(UserRole.ADMIN, UserRole.AUTHORITY),
  generalRateLimiter,
  validate(IncidentController.updateStatusValidations),
  IncidentController.updateStatus
);

export default router;
