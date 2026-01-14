import mongoose, { Schema, Document } from 'mongoose';
import { IncidentType, IncidentStatus, IIncident } from '../types';

export interface IIncidentDocument extends Omit<IIncident, '_id'>, Document {}

const IncidentSchema: Schema = new Schema(
  {
    reporterId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: Object.values(IncidentType),
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
    location: {
      address: {
        type: String,
        required: true,
        trim: true,
      },
      coordinates: {
        lat: {
          type: Number,
          min: -90,
          max: 90,
        },
        lng: {
          type: Number,
          min: -180,
          max: 180,
        },
      },
    },
    status: {
      type: Number,
      enum: Object.values(IncidentStatus).filter(
        (v) => typeof v === 'number'
      ) as number[],
      default: IncidentStatus.PENDING,
      required: true,
      index: true,
    },
    incidentHash: {
      type: String,
      trim: true,
      index: true,
    },
    blockchainTxId: {
      type: String,
      trim: true,
    },
    blockchainRecordId: {
      type: String,
      trim: true,
      index: true,
    },
    verifiedAt: {
      type: Date,
    },
    verifiedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    verificationNotes: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for efficient queries
IncidentSchema.index({ reporterId: 1, createdAt: -1 });
IncidentSchema.index({ status: 1, createdAt: -1 });
IncidentSchema.index({ type: 1, status: 1 });

export default mongoose.model<IIncidentDocument>('Incident', IncidentSchema);
