/**
 * API Service Layer
 * Centralized API client with authentication and error handling
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT } from '../config/api';
import { getAccessToken, getRefreshToken, clearTokens, storeTokens } from '../utils/secureStorage';
import { ApiResponse } from '../types';

class ApiService {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      timeout: REQUEST_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      async (config) => {
        const token = await getAccessToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor - handle token refresh
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Don't try to refresh token for auth endpoints (login, register, refresh-token)
        // These endpoints naturally return 401 for invalid credentials
        const isAuthEndpoint = originalRequest?.url?.includes('/api/auth/login') ||
                              originalRequest?.url?.includes('/api/auth/register') ||
                              originalRequest?.url?.includes('/api/auth/refresh-token');

        // If 401 and not already retried, and not an auth endpoint, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
          originalRequest._retry = true;

          try {
            const refreshToken = await getRefreshToken();
            if (!refreshToken) {
              await clearTokens();
              throw new Error('No refresh token available');
            }

            const response = await axios.post(
              `${API_BASE_URL}/api/auth/refresh-token`,
              { refreshToken }
            );

            const { accessToken } = response.data.data;
            await storeTokens({
              accessToken,
              refreshToken,
            });

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            await clearTokens();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Generic GET request
   */
  async get<T>(url: string, params?: any): Promise<T> {
    try {
      const response = await this.client.get<ApiResponse<T>>(url, { params });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Generic POST request
   */
  async post<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.post<ApiResponse<T>>(url, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Generic PATCH request
   */
  async patch<T>(url: string, data?: any): Promise<T> {
    try {
      const response = await this.client.patch<ApiResponse<T>>(url, data);
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * POST request with FormData (for file uploads)
   */
  async postFormData<T>(url: string, formData: FormData): Promise<T> {
    try {
      const token = await getAccessToken();
      const response = await this.client.post<ApiResponse<T>>(url, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });
      return response.data.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: any): void {
    // Don't log network errors during development - they're expected if backend is unreachable
    const isNetworkError = 
      error.code === 'ECONNREFUSED' ||
      error.code === 'ERR_NETWORK' ||
      error.message?.includes('Network Error') ||
      error.message?.includes('No response from server') ||
      (error.isAxiosError && !error.response && error.request);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || 'An error occurred';
      console.error('API Error:', message);
    } else if (error.request && !isNetworkError) {
      // Request made but no response (only log if not a common network error)
      console.error('Network Error: No response from server');
    } else if (!isNetworkError) {
      // Something else happened
      console.error('Error:', error.message);
    }
    // Silently ignore common network errors during development
  }

  /**
   * Get error message from API error
   */
  getErrorMessage(error: any): string {
    // Network/connection errors
    if (error.code === 'ECONNREFUSED' || error.code === 'ERR_NETWORK') {
      return 'Cannot connect to server. Please check your network connection and ensure the backend is running.';
    }
    
    if (error.message?.includes('Network Error') || error.message?.includes('timeout')) {
      return 'Network error. Please check your connection and try again.';
    }

    // Server response errors
    if (error.response?.data?.message) {
      // Handle validation errors
      if (error.response.data.errors) {
        const errors = error.response.data.errors;
        const firstError = Array.isArray(errors) ? errors[0] : Object.values(errors)[0];
        return typeof firstError === 'string' ? firstError : firstError.msg || error.response.data.message;
      }
      return error.response.data.message;
    }
    
    if (error.response?.data?.error) {
      return error.response.data.error;
    }

    // Generic error
    if (error.message) {
      return error.message;
    }
    
    return 'An unexpected error occurred. Please try again.';
  }
}

export const apiService = new ApiService();
