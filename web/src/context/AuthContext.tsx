/**
 * Authentication Context
 */

import React, { useCallback, useEffect, useState, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/authService';
import { isAuthenticated as checkAuth } from '../utils/storage';
import type { AuthContextType } from './AuthContextType';
import { AuthContext } from './AuthContextInstance';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const response = await authService.login({ email, password });
    setUser(response.user);
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const refreshUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      console.error('Error refreshing user:', error);
      setUser(null);
    }
  }, []);

  const checkAuthStatus = useCallback(async () => {
    try {
      const authenticated = checkAuth();
      if (authenticated) {
        await refreshUser();
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setIsLoading(false);
    }
  }, [refreshUser]);

  useEffect(() => {
    void checkAuthStatus();
  }, [checkAuthStatus]);

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: user !== null,
    isAdmin: user?.role === UserRole.ADMIN,
    isAuthority: user?.role === UserRole.AUTHORITY || user?.role === UserRole.ADMIN,
    login,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
