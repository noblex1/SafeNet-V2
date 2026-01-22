import { Response, NextFunction } from 'express';
import { body } from 'express-validator';
import { AuthRequest } from '../middleware/auth';
import { AuthService } from '../services/authService';
import { CustomError } from '../middleware/errorHandler';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary';
import logger from '../utils/logger';

export class AuthController {
  static registerValidations = [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('firstName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name is required (max 50 characters)'),
    body('lastName')
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name is required (max 50 characters)'),
    body('phone')
      .trim()
      .isLength({ min: 1 })
      .withMessage('Phone number is required'),
  ];

  static async register(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password, firstName, lastName, phone } = req.body;

      const result = await AuthService.register({
        email,
        password,
        firstName,
        lastName,
        phone,
      });

      const userObject = result.user.toObject();
      const { password: _, ...userWithoutPassword } = userObject;

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: {
          user: userWithoutPassword,
          tokens: result.tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static loginValidations = [
    body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address'),
    body('password')
      .notEmpty()
      .withMessage('Password is required'),
  ];

  static async login(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, password } = req.body;

      const result = await AuthService.login({ email, password });

      const userObject = result.user.toObject();
      const { password: _, ...userWithoutPassword } = userObject;

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user: userWithoutPassword,
          tokens: result.tokens,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static refreshTokenValidations = [
    body('refreshToken')
      .notEmpty()
      .withMessage('Refresh token is required'),
  ];

  static async refreshToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        throw new CustomError('Refresh token is required', 400);
      }

      const result = await AuthService.refreshToken(refreshToken);

      res.status(200).json({
        success: true,
        message: 'Token refreshed successfully',
        data: {
          accessToken: result.accessToken,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async getCurrentUser(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new CustomError('User not authenticated', 401);
      }

      const user = await AuthService.getCurrentUser(req.user.userId);

      if (!user) {
        throw new CustomError('User not found', 404);
      }

      const userObject = user.toObject();
      const { password: _, ...userWithoutPassword } = userObject;

      res.status(200).json({
        success: true,
        data: {
          user: userWithoutPassword,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static updateProfileValidations = [
    body('firstName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('First name must be between 1 and 50 characters'),
    body('lastName')
      .optional()
      .trim()
      .isLength({ min: 1, max: 50 })
      .withMessage('Last name must be between 1 and 50 characters'),
    body('phone')
      .optional()
      .trim()
      .isLength({ min: 1 })
      .withMessage('Phone number is required'),
  ];

  static async updateProfile(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new CustomError('User not authenticated', 401);
      }

      const { firstName, lastName, phone } = req.body;
      const updatedUser = await AuthService.updateProfile(req.user.userId, {
        firstName,
        lastName,
        phone,
      });

      const userObject = updatedUser.toObject();
      const { password: _, ...userWithoutPassword } = userObject;

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: {
          user: userWithoutPassword,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  static async uploadProfilePicture(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user) {
        throw new CustomError('User not authenticated', 401);
      }

      if (!req.file) {
        throw new CustomError('No image file provided', 400);
      }

      // Get current user to check for existing profile picture
      const currentUser = await AuthService.getCurrentUser(req.user.userId);
      const oldProfilePicture = currentUser?.profilePicture;

      // Upload new profile picture to Cloudinary
      const uploadResult = await uploadToCloudinary(
        req.file.buffer,
        'safenet/profiles',
        true // isProfilePicture flag
      );

      // Update user with new profile picture URL
      const updatedUser = await AuthService.updateProfile(req.user.userId, {
        profilePicture: uploadResult.secure_url,
      });

      // Delete old profile picture from Cloudinary if it exists
      if (oldProfilePicture) {
        try {
          // Extract public_id from old URL if possible
          const urlParts = oldProfilePicture.split('/');
          const publicIdWithExt = urlParts.slice(-2).join('/').split('.')[0];
          const publicId = `safenet/profiles/${publicIdWithExt}`;
          await deleteFromCloudinary(publicId);
        } catch (deleteError) {
          // Log but don't fail if deletion fails
          logger.warn('Failed to delete old profile picture:', deleteError);
        }
      }

      const userObject = updatedUser.toObject();
      const { password: _, ...userWithoutPassword } = userObject;

      res.status(200).json({
        success: true,
        message: 'Profile picture uploaded successfully',
        data: {
          user: userWithoutPassword,
        },
      });
    } catch (error) {
      next(error);
    }
  }
}
