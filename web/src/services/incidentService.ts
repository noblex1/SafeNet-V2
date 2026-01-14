/**
 * Incident Service
 */

import { apiService } from './api';
import { API_ENDPOINTS } from '../config/api';
import { Incident, PaginatedResponse, IncidentStatus, UpdateStatusData } from '../types';

interface GetIncidentsParams {
  status?: IncidentStatus;
  type?: string;
  page?: number;
  limit?: number;
  reporterId?: string;
}

class IncidentService {
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
   * Update incident status (Admin/Authority only)
   */
  async updateStatus(id: string, data: UpdateStatusData): Promise<Incident> {
    const response = await apiService.patch<{ incident: Incident }>(
      API_ENDPOINTS.INCIDENTS.UPDATE_STATUS(id),
      data
    );
    return response.incident;
  }
}

export const incidentService = new IncidentService();
