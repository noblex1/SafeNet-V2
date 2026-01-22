import jwt from 'jsonwebtoken';
import User, { IUserDocument } from '../models/User';
import { UserRole, JwtPayload } from '../types';
import { CustomError } from '../middleware/errorHandler';
import logger from '../utils/logger';

interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role?: UserRole;
}

interface LoginData {
  email: string;
  password: string;
}

interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  private static generateAccessToken(payload: JwtPayload): string {
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '15m';

    if (!secret) {
      throw new CustomError('JWT_SECRET not configured', 500);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return jwt.sign(payload, secret, { expiresIn } as any);
  }

  private static generateRefreshToken(payload: JwtPayload): string {
    const secret = process.env.JWT_REFRESH_SECRET;
    const expiresIn = process.env.JWT_REFRESH_EXPIRES_IN || '7d';

    if (!secret) {
      throw new CustomError('JWT_REFRESH_SECRET not configured', 500);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return jwt.sign(payload, secret, { expiresIn } as any);
  }

  static async register(data: RegisterData): Promise<{ user: IUserDocument; tokens: TokenPair }> {
    try {
      // Check if user already exists
      const existingUser = await User.findOne({ email: data.email.toLowerCase() });
      if (existingUser) {
        throw new CustomError('Email already registered', 400);
      }

      // Create new user
      const user = new User({
        email: data.email.toLowerCase(),
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        role: data.role || UserRole.PUBLIC_USER,
      });

      await user.save();

      // Generate tokens
      const payload: JwtPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const tokens = {
        accessToken: this.generateAccessToken(payload),
        refreshToken: this.generateRefreshToken(payload),
      };

      return { user: user as IUserDocument, tokens };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      logger.error('Registration error:', error);
      throw new CustomError('Registration failed', 500);
    }
  }

  static async login(data: LoginData): Promise<{ user: IUserDocument; tokens: TokenPair }> {
    try {
      // Find user and include password for comparison
      const user = await User.findOne({ email: data.email.toLowerCase() }).select('+password');

      if (!user) {
        throw new CustomError('Invalid email or password', 401);
      }

      // Check if user is active
      if (!user.isActive) {
        throw new CustomError('Account is deactivated', 403);
      }

      // Verify password
      const isPasswordValid = await user.comparePassword(data.password);
      if (!isPasswordValid) {
        throw new CustomError('Invalid email or password', 401);
      }

      // Generate tokens
      const payload: JwtPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      const tokens = {
        accessToken: this.generateAccessToken(payload),
        refreshToken: this.generateRefreshToken(payload),
      };

      return { user: user as IUserDocument, tokens };
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      logger.error('Login error:', error);
      throw new CustomError('Login failed', 500);
    }
  }

  static async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const secret = process.env.JWT_REFRESH_SECRET;
      if (!secret) {
        throw new CustomError('JWT_REFRESH_SECRET not configured', 500);
      }

      const decoded = jwt.verify(refreshToken, secret) as JwtPayload;

      // Verify user still exists and is active
      const user = await User.findById(decoded.userId);
      if (!user || !user.isActive) {
        throw new CustomError('User not found or inactive', 401);
      }

      // Generate new access token
      const payload: JwtPayload = {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
      };

      return {
        accessToken: this.generateAccessToken(payload),
      };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        throw new CustomError('Invalid refresh token', 401);
      }
      if (error instanceof CustomError) {
        throw error;
      }
      logger.error('Token refresh error:', error);
      throw new CustomError('Token refresh failed', 500);
    }
  }

  static async getCurrentUser(userId: string): Promise<IUserDocument | null> {
    try {
      const user = await User.findById(userId);
      return user;
    } catch (error) {
      logger.error('Get user error:', error);
      throw new CustomError('Failed to retrieve user', 500);
    }
  }

  static async updateProfile(
    userId: string,
    data: { firstName?: string; lastName?: string; phone?: string }
  ): Promise<IUserDocument> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new CustomError('User not found', 404);
      }

      // Update only provided fields
      if (data.firstName !== undefined) {
        user.firstName = data.firstName.trim();
      }
      if (data.lastName !== undefined) {
        user.lastName = data.lastName.trim();
      }
      if (data.phone !== undefined) {
        user.phone = data.phone.trim();
      }

      await user.save();
      return user as IUserDocument;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      logger.error('Update profile error:', error);
      throw new CustomError('Failed to update profile', 500);
    }
  }
}
