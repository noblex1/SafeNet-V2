/**
 * API Configuration
 * Base URL for the SafeNet backend API
 * Automatically detects platform and uses appropriate URL
 */

import { Platform } from 'react-native';

// Get the appropriate base URL based on platform
const getBaseURL = (): string => {
  if (!__DEV__) {
    return 'https://api.safenet.app'; // Production URL
  }

  // For web (Expo web), use localhost
  if (Platform.OS === 'web') {
    return 'http://localhost:3000';
  }

  // For Android - detect if emulator or physical device
  if (Platform.OS === 'android') {
    // Try to detect if running on emulator vs physical device
    // If you're using a physical device and getting network errors,
    // change this to: return 'http://10.16.214.34:3000';
    // For Android emulator, use 10.0.2.2 (special IP that maps to host's localhost)
    return 'http://10.0.2.2:3000';
    // For physical Android device, uncomment the line below and comment the line above:
    // return 'http://10.16.214.34:3000';
  }

  // For iOS simulator, use localhost
  if (Platform.OS === 'ios') {
    return 'http://localhost:3000';
  }

  // Fallback
  return 'http://localhost:3000';
};

// NOTE: For physical devices, you may need to manually override the URL above
// Replace 'localhost' or '10.0.2.2' with your computer's IP address
// Current detected IP: 10.16.214.34
// Example for physical device: return 'http://10.16.214.34:3000';

export const API_BASE_URL = getBaseURL();

export const API_ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    REFRESH_TOKEN: '/api/auth/refresh-token',
    ME: '/api/auth/me',
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
