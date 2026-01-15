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
   * Create a new incident with optional images
   */
  async createIncident(data: CreateIncidentData, images?: string[]): Promise<Incident> {
    // If images are provided, use FormData for multipart/form-data
    if (images && images.length > 0) {
      const formData = new FormData();
      
      // Add text fields
      formData.append('type', data.type);
      formData.append('title', data.title);
      formData.append('description', data.description);
      
      // Send location as nested object structure for validation
      formData.append('location[address]', data.location.address);
      if (data.location.coordinates) {
        formData.append('location[coordinates][lat]', data.location.coordinates.lat.toString());
        formData.append('location[coordinates][lng]', data.location.coordinates.lng.toString());
      }
      
      if (data.metadata) {
        formData.append('metadata', JSON.stringify(data.metadata));
      }
      
      // Add images
      images.forEach((imageUri, index) => {
        const filename = imageUri.split('/').pop() || `image-${index}.jpg`;
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : `image/jpeg`;
        
        formData.append('images', {
          uri: imageUri,
          type,
          name: filename,
        } as any);
      });
      
      const response = await apiService.postFormData<{ incident: Incident }>(
        API_ENDPOINTS.INCIDENTS.BASE,
        formData
      );
      return response.incident;
    } else {
      // No images, use regular JSON
      const response = await apiService.post<{ incident: Incident }>(
        API_ENDPOINTS.INCIDENTS.BASE,
        data
      );
      return response.incident;
    }
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
