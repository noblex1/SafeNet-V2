import { Router } from 'express';
import authRoutes from './authRoutes';
import incidentRoutes from './incidentRoutes';

const router = Router();

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    message: 'SafeNet API is running',
    timestamp: new Date().toISOString(),
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/incidents', incidentRoutes);

export default router;
