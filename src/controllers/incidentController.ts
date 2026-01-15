import { Response, NextFunction } from 'express';
import { body, query, param } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { IncidentService } from '../services/incidentService';
import { IncidentType, IncidentStatus } from '../types';
import { CustomError } from '../middleware/errorHandler';
import { uploadToCloudinary } from '../config/cloudinary';
import logger from '../utils/logger';

export class IncidentController {
  static createIncidentValidations = [
    body('type')
      .isIn(Object.values(IncidentType))
      .withMessage('Invalid incident type'),
    body('title')
      .trim()
      .isLength({ min: 5, max: 200 })
      .withMessage('Title must be between 5 and 200 characters'),
    body('description')
      .trim()
      .isLength({ min: 20, max: 2000 })
      .withMessage('Description must be between 20 and 2000 characters'),
    body('location.address')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Location address is required'),
    body('location.coordinates.lat')
      .optional()
      .isFloat({ min: -90, max: 90 })
      .withMessage('Latitude must be between -90 and 90'),
    body('location.coordinates.lng')
      .optional()
      .isFloat({ min: -180, max: 180 })
      .withMessage('Longitude must be between -180 and 180'),
  ];

  static async createIncident(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new CustomError('User not authenticated', 401);
      }

      // Handle both JSON and form-data requests
      let type, title, description, location, metadata;
      const images: string[] = [];

      // Check if this is a multipart/form-data request (has files)
      if (req.files && Array.isArray(req.files) && req.files.length > 0) {
        // Form-data request - parse string fields
        type = req.body.type;
        title = req.body.title;
        description = req.body.description;
        location = typeof req.body.location === 'string' ? JSON.parse(req.body.location) : req.body.location;
        metadata = req.body.metadata ? (typeof req.body.metadata === 'string' ? JSON.parse(req.body.metadata) : req.body.metadata) : undefined;
        
        // Upload images to Cloudinary
        try {
          const uploadPromises = req.files.map((file: Express.Multer.File) => {
            if (!file.buffer) {
              throw new CustomError('File buffer is missing', 400);
            }
            return uploadToCloudinary(file.buffer);
          });

          const uploadResults = await Promise.all(uploadPromises);
          images.push(...uploadResults.map((result) => result.secure_url));
          
          logger.info(`Uploaded ${images.length} images to Cloudinary for incident`, {
            userId: req.user.userId,
            imageCount: images.length,
          });
        } catch (uploadError: any) {
          logger.error('Error uploading images to Cloudinary:', uploadError);
          throw new CustomError(
            uploadError.message || 'Failed to upload images',
            500
          );
        }
      } else {
        // JSON request - use body directly
        ({ type, title, description, location, metadata } = req.body);
      }

      const incident = await IncidentService.createIncident({
        reporterId: req.user.userId,
        type,
        title,
        description,
        location,
        images,
        metadata,
      });

      res.status(201).json({
        success: true,
        message: 'Incident reported successfully',
        data: {
          incident,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static getIncidentValidations = [
    param('id')
      .isMongoId()
      .withMessage('Invalid incident ID'),
  ];

  static async getIncident(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { id } = req.params;
      const userId = req.user?.userId;

      const incident = await IncidentService.getIncidentById(id, userId);

      if (!incident) {
        throw new CustomError('Incident not found', 404);
      }

      // Public users can only see verified incidents (unless it's their own)
      if (
        req.user &&
        req.user.role === 'public_user' &&
        incident.reporterId.toString() !== req.user.userId &&
        incident.status !== IncidentStatus.VERIFIED
      ) {
        throw new CustomError('Access denied', 403);
      }

      res.status(200).json({
        success: true,
        data: {
          incident,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static getIncidentsValidations = [
    query('status')
      .optional()
      .isInt({ min: 0, max: 3 })
      .withMessage('Status must be 0 (Pending), 1 (Verified), 2 (False), or 3 (Resolved)'),
    query('type')
      .optional()
      .isIn(Object.values(IncidentType))
      .withMessage('Invalid incident type'),
    query('page')
      .optional()
      .isInt({ min: 1 })
      .withMessage('Page must be a positive integer'),
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 })
      .withMessage('Limit must be between 1 and 100'),
  ];

  static async getIncidents(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user?.userId;
      const { status, type, page, limit } = req.query;

      const filters: any = {
        page: page ? parseInt(page as string, 10) : undefined,
        limit: limit ? parseInt(limit as string, 10) : undefined,
      };

      // Public users can only see verified incidents (unless filtering by their own)
      if (req.user && req.user.role === 'public_user') {
        if (userId && req.query.reporterId === userId) {
          filters.reporterId = userId;
        } else {
          filters.status = IncidentStatus.VERIFIED;
        }
      } else {
        // Admin/Authority can see all
        if (status !== undefined) {
          filters.status = parseInt(status as string, 10);
        }
        if (type) {
          filters.type = type as IncidentType;
        }
        if (req.query.reporterId) {
          filters.reporterId = req.query.reporterId as string;
        }
      }

      const result = await IncidentService.getIncidents(filters);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }

  static updateStatusValidations = [
    param('id')
      .isMongoId()
      .withMessage('Invalid incident ID'),
    body('status')
      .isInt({ min: 1, max: 3 })
      .withMessage('Status must be 1 (Verified), 2 (False), or 3 (Resolved)'),
    body('verificationNotes')
      .optional()
      .trim()
      .isLength({ max: 500 })
      .withMessage('Verification notes must not exceed 500 characters'),
  ];

  static async updateStatus(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new CustomError('User not authenticated', 401);
      }

      const { id } = req.params;
      const { status, verificationNotes } = req.body;

      const incident = await IncidentService.updateIncidentStatus({
        incidentId: id,
        status: parseInt(status, 10) as IncidentStatus,
        verifiedBy: req.user.userId,
        verificationNotes,
      });

      res.status(200).json({
        success: true,
        message: 'Incident status updated successfully',
        data: {
          incident,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getVerifiedAlerts(_req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const alerts = await IncidentService.getVerifiedAlerts();

      res.status(200).json({
        success: true,
        data: {
          alerts,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
