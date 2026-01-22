/**
 * Authentication Context
 * Manages global authentication state
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';
import { authService } from '../services/authService';
import { isAuthenticated as checkAuth } from '../utils/secureStorage';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateProfile: (data: { firstName?: string; lastName?: string; phone?: string }) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await checkAuth();
      if (authenticated) {
        try {
          await refreshUser();
        } catch (refreshError: any) {
          // Network errors during startup shouldn't block the app
          // Suppress network-related errors (they're expected if backend is unreachable)
          const isNetworkError = 
            refreshError?.code === 'ECONNREFUSED' ||
            refreshError?.code === 'ERR_NETWORK' ||
            refreshError?.message?.includes('Network Error') ||
            refreshError?.message?.includes('No response from server') ||
            (refreshError?.isAxiosError && !refreshError?.response);
          
          if (!isNetworkError) {
            console.error('Error refreshing user:', refreshError);
          }
          // Clear tokens if refresh fails (token might be invalid)
          await clearTokens();
          setUser(null);
        }
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      // Set loading to false even on error so app can continue
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const register = async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
  }) => {
    try {
      const response = await authService.register(data);
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const refreshUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error: any) {
      // Suppress network errors - they're expected if backend is unreachable
      const isNetworkError = 
        error?.code === 'ECONNREFUSED' ||
        error?.code === 'ERR_NETWORK' ||
        error?.message?.includes('Network Error') ||
        error?.message?.includes('No response from server') ||
        (error?.isAxiosError && !error?.response);
      
      if (!isNetworkError) {
        console.error('Error refreshing user:', error);
      }
      setUser(null);
    }
  };

  const updateProfile = async (data: { firstName?: string; lastName?: string; phone?: string }) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    login,
    register,
    logout,
    refreshUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
