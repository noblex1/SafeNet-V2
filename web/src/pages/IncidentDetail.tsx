/**
 * Incident Detail Page
 * Review and verify incidents
 */

import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Incident, IncidentStatus } from '../types';
import { incidentService } from '../services/incidentService';
import { apiService } from '../services/api';

const STATUS_OPTIONS = [
  { value: IncidentStatus.VERIFIED, label: 'Verify' },
  { value: IncidentStatus.FALSE, label: 'Mark as False' },
  { value: IncidentStatus.RESOLVED, label: 'Resolve' },
];

export const IncidentDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [notes, setNotes] = useState('');

  const loadIncident = useCallback(async () => {
    if (!id) {
      setIncident(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError('');
    try {
      const data = await incidentService.getIncidentById(id);
      setIncident(data);
    } catch (err: unknown) {
      const errorMessage = apiService.getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    void loadIncident();
  }, [loadIncident]);

  const handleStatusUpdate = async (newStatus: IncidentStatus) => {
    if (!id) return;
    setUpdating(true);
    setError('');
    setSuccess('');

    try {
      await incidentService.updateStatus(id, {
        status: newStatus,
        verificationNotes: notes || undefined,
      });
      setSuccess('Incident status updated successfully');
      await loadIncident();
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    } catch (err: unknown) {
      const errorMessage = apiService.getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadgeClass = (s: IncidentStatus) => {
    switch (s) {
      case IncidentStatus.PENDING:
        return 'sn-badge-pending';
      case IncidentStatus.VERIFIED:
        return 'sn-badge-verified';
      case IncidentStatus.FALSE:
        return 'sn-badge-false';
      case IncidentStatus.RESOLVED:
        return 'sn-badge-resolved';
      default:
        return 'sn-badge-resolved';
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="sn-text-tertiary">Loading incident details...</div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="text-center py-12">
        <div className="text-red-200">Incident not found</div>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-neon-cyan hover:text-neon-cyan/80 font-semibold"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const reporter = typeof incident.reporterId === 'object' 
    ? incident.reporterId 
    : null;

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <button
          onClick={() => navigate('/dashboard')}
          className="text-neon-cyan hover:text-neon-cyan/80 mb-4 font-semibold"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-extrabold tracking-tight text-safenet-text-primary">{incident.title}</h1>
      </div>

      {error && (
        <div className="sn-card border-red-300/20 bg-red-500/10 text-red-200 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="sn-card border-neon-cyan/20 bg-safenet-status-verified text-neon-cyan px-4 py-3 rounded-xl mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incident Details */}
          <div className="sn-card p-6">
            <h2 className="text-lg font-extrabold tracking-tight text-safenet-text-primary mb-4">Incident Details</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-semibold sn-text-tertiary">Type</dt>
                <dd className="mt-1 text-sm text-safenet-text-primary">{incident.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-semibold sn-text-tertiary">Status</dt>
                <dd className="mt-1">
                  <span className={getStatusBadgeClass(incident.status)}>
                    {IncidentStatus[incident.status]}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-semibold sn-text-tertiary">Description</dt>
                <dd className="mt-1 text-sm text-safenet-text-primary whitespace-pre-wrap">
                  {incident.description}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-semibold sn-text-tertiary">Location</dt>
                <dd className="mt-1 text-sm text-safenet-text-primary">
                  {incident.location.address}
                  {incident.location.coordinates && (
                    <span className="sn-text-tertiary ml-2">
                      ({incident.location.coordinates.lat}, {incident.location.coordinates.lng})
                    </span>
                  )}
                </dd>
              </div>
              {incident.images && incident.images.length > 0 && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-semibold sn-text-tertiary mb-2">Images</dt>
                  <dd className="mt-1">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {incident.images.map((imageUrl, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={imageUrl}
                            alt={`Incident image ${index + 1}`}
                            className="w-full h-48 object-cover rounded-2xl border border-safenet-glass-border cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => window.open(imageUrl, '_blank')}
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg flex items-center justify-center">
                            <svg
                              className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                              />
                            </svg>
                          </div>
                        </div>
                      ))}
                    </div>
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm font-semibold sn-text-tertiary">Reported</dt>
                <dd className="mt-1 text-sm text-safenet-text-primary">
                  {new Date(incident.createdAt || '').toLocaleString()}
                </dd>
              </div>
              {incident.verifiedAt && (
                <div>
                  <dt className="text-sm font-semibold sn-text-tertiary">Verified</dt>
                  <dd className="mt-1 text-sm text-safenet-text-primary">
                    {new Date(incident.verifiedAt).toLocaleString()}
                  </dd>
                </div>
              )}
            </dl>

            {incident.metadata && Object.keys(incident.metadata).length > 0 && (
              <div className="mt-6">
                <dt className="text-sm font-semibold sn-text-tertiary mb-2">Additional Information</dt>
                <dd className="text-sm text-safenet-text-primary">
                  <pre className="bg-white/5 border border-safenet-glass-border p-3 rounded-xl text-xs overflow-auto">
                    {JSON.stringify(incident.metadata, null, 2)}
                  </pre>
                </dd>
              </div>
            )}
          </div>

          {/* Reporter Information */}
          {reporter && (
            <div className="sn-card p-6">
              <h2 className="text-lg font-extrabold tracking-tight text-safenet-text-primary mb-4">Reporter Information</h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-semibold sn-text-tertiary">Name</dt>
                  <dd className="mt-1 text-sm text-safenet-text-primary">
                    {reporter.firstName} {reporter.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold sn-text-tertiary">Email</dt>
                  <dd className="mt-1 text-sm text-safenet-text-primary">{reporter.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-semibold sn-text-tertiary">Phone</dt>
                  <dd className="mt-1 text-sm text-safenet-text-primary">{reporter.phone}</dd>
                </div>
              </dl>
            </div>
          )}

          {/* Blockchain Information */}
          {(incident.blockchainTxId || incident.blockchainRecordId || incident.incidentHash) && (
            <div className="sn-card p-6">
              <h2 className="text-lg font-extrabold tracking-tight text-safenet-text-primary mb-4">Blockchain Information</h2>
              <dl className="space-y-4">
                {incident.incidentHash && (
                  <div>
                    <dt className="text-sm font-semibold sn-text-tertiary">Incident Hash</dt>
                    <dd className="mt-1 text-sm text-safenet-text-primary font-mono text-xs break-all">
                      {incident.incidentHash}
                    </dd>
                  </div>
                )}
                {incident.blockchainTxId && (
                  <div>
                    <dt className="text-sm font-semibold sn-text-tertiary">Transaction ID</dt>
                    <dd className="mt-1 text-sm text-safenet-text-primary font-mono text-xs break-all">
                      {incident.blockchainTxId}
                    </dd>
                  </div>
                )}
                {incident.blockchainRecordId && (
                  <div>
                    <dt className="text-sm font-semibold sn-text-tertiary">Record ID</dt>
                    <dd className="mt-1 text-sm text-safenet-text-primary font-mono text-xs break-all">
                      {incident.blockchainRecordId}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          )}
        </div>

        {/* Action Panel */}
        <div className="lg:col-span-1">
          <div className="sn-card p-6 sticky top-24">
            <h2 className="text-lg font-extrabold tracking-tight text-safenet-text-primary mb-4">Verification Actions</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold sn-text-secondary mb-2">
                  Verification Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="sn-input min-h-[110px]"
                  placeholder="Add notes about verification..."
                />
              </div>

              <div className="space-y-2">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusUpdate(option.value)}
                    disabled={updating || incident.status === option.value}
                    className={
                      option.value === IncidentStatus.VERIFIED
                        ? 'sn-button-primary w-full'
                        : option.value === IncidentStatus.FALSE
                        ? 'sn-button w-full bg-red-500/20 border border-red-300/20 text-red-200 hover:bg-red-500/25'
                        : 'sn-button w-full bg-neon-blue/20 border border-neon-blue/25 text-sky-200 hover:bg-neon-blue/25'
                    }
                  >
                    {updating ? 'Updating...' : option.label}
                  </button>
                ))}
              </div>

              {incident.verificationNotes && (
                <div className="mt-4 pt-4 border-t sn-divider">
                  <h3 className="text-sm font-semibold sn-text-secondary mb-2">Previous Notes</h3>
                  <p className="text-sm sn-text-tertiary">{incident.verificationNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
