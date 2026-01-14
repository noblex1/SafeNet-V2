import crypto from 'crypto';

/**
 * Generate a hash for incident data
 * This hash will be stored on the blockchain
 */
export const generateIncidentHash = (incidentData: {
  reporterId: string;
  type: string;
  title: string;
  description: string;
  location: string;
  timestamp: Date;
}): string => {
  const dataString = JSON.stringify(incidentData);
  return crypto.createHash('sha256').update(dataString).digest('hex');
};
