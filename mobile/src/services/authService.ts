/**
 * Authentication Service
 * Handles user authentication API calls
 */

import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';
import { storeTokens, clearTokens } from '../utils/secureStorage';
import { User, AuthTokens, LoginCredentials, RegisterData } from '../types';

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      API_ENDPOINTS.AUTH.REGISTER,
      data
    );
    
    // Store tokens securely
    await storeTokens(response.tokens);
    
    return response;
  }

  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    // Store tokens securely
    await storeTokens(response.tokens);
    
    return response;
  }

  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<User> {
    const response = await apiService.get<{ user: User }>(
      API_ENDPOINTS.AUTH.ME
    );
    return response.user;
  }

  /**
   * Logout user (clear tokens)
   */
  async logout(): Promise<void> {
    await clearTokens();
  }

  /**
   * Refresh access token
   */
  async refreshToken(): Promise<string> {
    const { getRefreshToken, storeAccessToken } = await import('../utils/secureStorage');
    const refreshToken = await getRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const response = await apiService.post<{ accessToken: string }>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN,
      { refreshToken }
    );

    await storeAccessToken(response.accessToken);

    return response.accessToken;
  }

  /**
   * Update user profile
   */
  async updateProfile(data: {
    firstName?: string;
    lastName?: string;
    phone?: string;
  }): Promise<User> {
    const response = await apiService.patch<{ user: User }>(
      API_ENDPOINTS.AUTH.UPDATE_PROFILE,
      data
    );
    return response.user;
  }

  /**
   * Upload profile picture
   */
  async uploadProfilePicture(imageUri: string): Promise<User> {
    const formData = new FormData();
    
    // Extract filename from URI
    const filename = imageUri.split('/').pop() || 'profile.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    // @ts-ignore - FormData append with file object
    formData.append('profilePicture', {
      uri: imageUri,
      type,
      name: filename,
    } as any);

    const response = await apiService.postFormData<{ user: User }>(
      API_ENDPOINTS.AUTH.UPLOAD_PROFILE_PICTURE,
      formData
    );
    return response.user;
  }
}

export const authService = new AuthService();
