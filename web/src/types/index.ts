// User and Authentication Types
export enum UserRole {
  PUBLIC_USER = 'public_user',
  ADMIN = 'admin',
  AUTHORITY = 'authority',
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Incident Types
export enum IncidentType {
  MISSING_PERSON = 'missing_person',
  KIDNAPPING = 'kidnapping',
  STOLEN_VEHICLE = 'stolen_vehicle',
  NATURAL_DISASTER = 'natural_disaster',
}

export enum IncidentStatus {
  PENDING = 0,
  VERIFIED = 1,
  FALSE = 2,
  RESOLVED = 3,
}

export interface Location {
  address: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface Incident {
  _id: string;
  reporterId: string | User;
  type: IncidentType;
  title: string;
  description: string;
  location: Location;
  status: IncidentStatus;
  incidentHash?: string;
  blockchainTxId?: string;
  blockchainRecordId?: string;
  verifiedAt?: string;
  verifiedBy?: string | User;
  verificationNotes?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginatedResponse<T> {
  incidents: T[];
  total: number;
  page: number;
  limit: number;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

// Status Update
export interface UpdateStatusData {
  status: IncidentStatus;
  verificationNotes?: string;
}
