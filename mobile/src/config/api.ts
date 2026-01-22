/**
 * API Configuration
 * Base URL for the SafeNet backend API
 * Automatically detects platform and uses appropriate URL
 */

import { Platform } from 'react-native';
import Constants from 'expo-constants';

/**
 * Extract IP address from Expo dev server host
 * Automatically detects the correct IP for emulators and physical devices
 */
const getDevServerIP = (): string => {
  // Try multiple sources to get the dev server IP
  const hostUri = 
    Constants.expoConfig?.hostUri || 
    Constants.debuggerHost ||
    (Constants.manifest2?.extra?.expoGo as any)?.debuggerHost;
  
  if (hostUri) {
    // Extract IP from hostUri (format: "192.168.1.100:8081" or "10.0.2.2:8081" or "exp://192.168.1.100:8081")
    const cleanUri = hostUri.replace(/^exp:\/\//, '').replace(/^http:\/\//, '');
    const ipMatch = cleanUri.match(/^([^:]+)/);
    if (ipMatch && ipMatch[1]) {
      const ip = ipMatch[1];
      // Use the IP if it's not localhost (physical device)
      if (ip !== 'localhost' && ip !== '127.0.0.1') {
        return ip;
      }
    }
  }

  // Fallback based on platform
  if (Platform.OS === 'android') {
    // Android emulator uses special IP to access host machine
    return '10.0.2.2';
  }

  // iOS simulator uses localhost
  return 'localhost';
};

// Get the appropriate base URL based on platform
const getBaseURL = (): string => {
  if (!__DEV__) {
    return 'https://api.safenet.app'; // Production URL
  }

  // For web (Expo web), use localhost
  if (Platform.OS === 'web') {
    return 'http://localhost:3000';
  }

  // For native platforms, dynamically detect the dev server IP
  const devServerIP = getDevServerIP();
  return `http://${devServerIP}:3000`;
};

export const API_BASE_URL = getBaseURL();

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    ME: '/api/auth/me',
    UPDATE_PROFILE: '/api/auth/profile',
    UPLOAD_PROFILE_PICTURE: '/api/auth/profile/picture',
  },
  // Incident endpoints
  INCIDENTS: {
    BASE: '/api/incidents',
    VERIFIED_ALERTS: '/api/incidents/alerts/verified',
    BY_ID: (id: string) => `/api/incidents/${id}`,
    UPDATE_STATUS: (id: string) => `/api/incidents/${id}/status`,
  },
} as const;

// Request timeout in milliseconds
export const REQUEST_TIMEOUT = 30000;
