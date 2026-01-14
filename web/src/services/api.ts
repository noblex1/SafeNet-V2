/**
 * API Service Layer
 * Centralized API client with authentication and error handling
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import { API_BASE_URL, REQUEST_TIMEOUT } from '../config/api';
import { getAccessToken, getRefreshToken, clearTokens, storeTokens } from '../utils/storage';
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
      (config) => {
        const token = getAccessToken();
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

        // If 401 and not already retried, try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            const refreshToken = getRefreshToken();
            if (!refreshToken) {
              clearTokens();
              window.location.href = '/login';
              throw new Error('No refresh token available');
            }

            const response = await axios.post(
              `${API_BASE_URL}/api/auth/refresh-token`,
              { refreshToken }
            );

            const { accessToken } = response.data.data;
            storeTokens({
              accessToken,
              refreshToken,
            });

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            clearTokens();
            window.location.href = '/login';
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
   * Handle API errors
   */
  private handleError(error: any): void {
    if (error.response) {
      console.error('API Error:', error.response.data?.message || 'An error occurred');
    } else if (error.request) {
      console.error('Network Error: No response from server');
    } else {
      console.error('Error:', error.message);
    }
  }

  /**
   * Get error message from API error
   */
  getErrorMessage(error: any): string {
    if (error.response?.data?.message) {
      return error.response.data.message;
    }
    if (error.message) {
      return error.message;
    }
    return 'An unexpected error occurred';
  }
}

export const apiService = new ApiService();
