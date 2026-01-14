/**
 * Authentication Service
 */

import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';
import { storeTokens, clearTokens } from '../utils/storage';
import { User, AuthTokens, LoginCredentials } from '../types';

export interface AuthResponse {
  user: User;
  tokens: AuthTokens;
}

class AuthService {
  /**
   * Login user
   */
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const response = await apiService.post<AuthResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    
    storeTokens(response.tokens);
    
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
  logout(): void {
    clearTokens();
  }
}

export const authService = new AuthService();
