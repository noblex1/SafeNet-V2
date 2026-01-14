/**
 * Incident Service
 * Handles incident-related API calls
 */

import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';
import { Incident, CreateIncidentData, PaginatedResponse, IncidentStatus } from '../types';

interface GetIncidentsParams {
  status?: IncidentStatus;
  type?: string;
  page?: number;
  limit?: number;
  reporterId?: string;
}

class IncidentService {
  /**
   * Create a new incident
   */
  async createIncident(data: CreateIncidentData): Promise<Incident> {
    const response = await apiService.post<{ incident: Incident }>(
      API_ENDPOINTS.INCIDENTS.BASE,
      data
    );
    return response.incident;
  }

  /**
   * Get incidents with optional filters
   */
  async getIncidents(params?: GetIncidentsParams): Promise<PaginatedResponse<Incident>> {
    const response = await apiService.get<PaginatedResponse<Incident>>(
      API_ENDPOINTS.INCIDENTS.BASE,
      params
    );
    return response;
  }

  /**
   * Get a single incident by ID
   */
  async getIncidentById(id: string): Promise<Incident> {
    const response = await apiService.get<{ incident: Incident }>(
      API_ENDPOINTS.INCIDENTS.BY_ID(id)
    );
    return response.incident;
  }

  /**
   * Get verified alerts (public endpoint, no auth required)
   */
  async getVerifiedAlerts(): Promise<Incident[]> {
    const response = await apiService.get<{ alerts: Incident[] }>(
      API_ENDPOINTS.INCIDENTS.VERIFIED_ALERTS
    );
    return response.alerts;
  }

  /**
   * Get user's own incidents
   */
  async getMyIncidents(page: number = 1, limit: number = 20): Promise<PaginatedResponse<Incident>> {
    return this.getIncidents({ page, limit });
  }
}

export const incidentService = new IncidentService();
