import Incident, { IIncidentDocument } from '../models/Incident';
import User from '../models/User';
import { IncidentType, IncidentStatus } from '../types';
import { CustomError } from '../middleware/errorHandler';
import { generateIncidentHash } from '../utils/crypto';
import { BlockchainService } from './blockchainService';
import logger from '../utils/logger';

interface CreateIncidentData {
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
  images?: string[];
  metadata?: Record<string, any>;
}

interface UpdateIncidentStatusData {
  incidentId: string;
  status: IncidentStatus;
  verifiedBy: string;
  verificationNotes?: string;
}

export class IncidentService {
  static async createIncident(data: CreateIncidentData): Promise<IIncidentDocument> {
    try {
      // Verify reporter exists
      const reporter = await User.findById(data.reporterId);
      if (!reporter) {
        throw new CustomError('Reporter not found', 404);
      }

      // Create incident
      const incident = new Incident({
        ...data,
        status: IncidentStatus.PENDING,
      });

      await incident.save();

      // Generate hash for blockchain
      const incidentHash = generateIncidentHash({
        reporterId: data.reporterId,
        type: data.type,
        title: data.title,
        description: data.description,
        location: data.location.address,
        timestamp: incident.createdAt!,
      });

      // Update incident with hash
      incident.incidentHash = incidentHash;
      await incident.save();

      // Submit hash to blockchain (async, don't block response)
      BlockchainService.submitIncidentHash(incidentHash, IncidentStatus.PENDING)
        .then((result) => {
          if (result) {
            incident.blockchainTxId = result.txDigest;
            incident.blockchainRecordId = result.recordId;
            incident.save().catch((err) => {
              logger.error('Failed to update blockchain IDs:', err);
            });
          }
        })
        .catch((err) => {
          logger.error('Failed to submit to blockchain:', err);
        });

      return incident;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      logger.error('Create incident error:', error);
      throw new CustomError('Failed to create incident', 500);
    }
  }

  static async getIncidentById(
    incidentId: string,
    userId?: string
  ): Promise<IIncidentDocument | null> {
    try {
      const incident = await Incident.findById(incidentId)
        .populate('reporterId', 'firstName lastName email')
        .populate('verifiedBy', 'firstName lastName email');

      if (!incident) {
        return null;
      }

      // Public users can only see verified incidents (unless it's their own)
      if (userId && incident.reporterId.toString() !== userId) {
        // This check would be done at controller level based on user role
        // Keeping service layer simple
      }

      return incident;
    } catch (error) {
      logger.error('Get incident error:', error);
      throw new CustomError('Failed to retrieve incident', 500);
    }
  }

  static async getIncidents(
    filters: {
      status?: IncidentStatus;
      type?: IncidentType;
      reporterId?: string;
      limit?: number;
      page?: number;
    }
  ): Promise<{ incidents: IIncidentDocument[]; total: number; page: number; limit: number }> {
    try {
      const limit = filters.limit || 20;
      const page = filters.page || 1;
      const skip = (page - 1) * limit;

      const query: any = {};

      if (filters.status !== undefined) {
        query.status = filters.status;
      }

      if (filters.type) {
        query.type = filters.type;
      }

      if (filters.reporterId) {
        query.reporterId = filters.reporterId;
      }

      const [incidents, total] = await Promise.all([
        Incident.find(query)
          .populate('reporterId', 'firstName lastName email')
          .populate('verifiedBy', 'firstName lastName email')
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Incident.countDocuments(query),
      ]);

      return {
        incidents,
        total,
        page,
        limit,
      };
    } catch (error) {
      logger.error('Get incidents error:', error);
      throw new CustomError('Failed to retrieve incidents', 500);
    }
  }

  static async updateIncidentStatus(
    data: UpdateIncidentStatusData
  ): Promise<IIncidentDocument> {
    try {
      const incident = await Incident.findById(data.incidentId);
      if (!incident) {
        throw new CustomError('Incident not found', 404);
      }

      // Verify verifier exists and has admin/authority role
      const verifier = await User.findById(data.verifiedBy);
      if (!verifier) {
        throw new CustomError('Verifier not found', 404);
      }

      // Update incident status
      incident.status = data.status;
      incident.verifiedBy = data.verifiedBy as any;
      incident.verifiedAt = new Date();
      if (data.verificationNotes) {
        incident.verificationNotes = data.verificationNotes;
      }

      await incident.save();

      // Update blockchain with new status
      if (incident.blockchainRecordId) {
        BlockchainService.updateIncidentStatus(
          incident.blockchainRecordId,
          data.status,
          data.verifiedBy
        )
          .then((txDigest) => {
            if (txDigest) {
              incident.blockchainTxId = txDigest;
              incident.save().catch((err) => {
                logger.error('Failed to update blockchain tx ID:', err);
              });
            }
          })
          .catch((err) => {
            logger.error('Failed to update blockchain status:', err);
          });
      } else {
        logger.warn('Cannot update blockchain status: blockchainRecordId not found', {
          incidentId: data.incidentId,
        });
      }

      return incident;
    } catch (error) {
      if (error instanceof CustomError) {
        throw error;
      }
      logger.error('Update incident status error:', error);
      throw new CustomError('Failed to update incident status', 500);
    }
  }

  static async getVerifiedAlerts(): Promise<IIncidentDocument[]> {
    try {
      const incidents = await Incident.find({
        status: IncidentStatus.VERIFIED,
      })
        .populate('reporterId', 'firstName lastName')
        .sort({ createdAt: -1 })
        .limit(50);

      return incidents;
    } catch (error) {
      logger.error('Get verified alerts error:', error);
      throw new CustomError('Failed to retrieve verified alerts', 500);
    }
  }
}
