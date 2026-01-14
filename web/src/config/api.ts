/**
 * API Configuration
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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

export const REQUEST_TIMEOUT = 30000;
