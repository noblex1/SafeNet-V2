export enum UserRole {
  PUBLIC_USER = 'public_user',
  ADMIN = 'admin',
  AUTHORITY = 'authority'
}

export enum IncidentType {
  MISSING_PERSON = 'missing_person',
  KIDNAPPING = 'kidnapping',
  STOLEN_VEHICLE = 'stolen_vehicle',
  NATURAL_DISASTER = 'natural_disaster'
}

export enum IncidentStatus {
  PENDING = 0,
  VERIFIED = 1,
  FALSE = 2,
  RESOLVED = 3
}

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IIncident {
  _id?: string;
  reporterId: string;
  type: IncidentType;
  title: string;
  description: string;
  location: {
    address: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  status: IncidentStatus;
  incidentHash?: string;
  blockchainTxId?: string;
  blockchainRecordId?: string; // Sui IncidentRecord object ID
  verifiedAt?: Date;
  verifiedBy?: string;
  verificationNotes?: string;
  metadata?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface JwtPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface BlockchainSubmission {
  incidentHash: string;
  status: IncidentStatus;
  verifierAddress?: string;
  timestamp: Date;
}
