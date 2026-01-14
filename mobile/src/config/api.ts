/**
 * API Configuration
 * Base URL for the SafeNet backend API
 * Update this to match your backend server URL
 */

// For development - update with your actual backend URL
// For Android emulator: use 'http://10.0.2.2:3000'
// For iOS simulator: use 'http://localhost:3000'
// For physical device: use your computer's IP address (e.g., 'http://192.168.1.100:3000')
export const API_BASE_URL = __DEV__
  ? 'http://10.221.252.34:3000' // Updated for physical device - change if your IP changes
  : 'https://api.safenet.app'; // Production URL

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
