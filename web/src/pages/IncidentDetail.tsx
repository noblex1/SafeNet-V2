/**
 * Incident Detail Page
 * Review and verify incidents
 */

import { useState, useEffect } from 'react';
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
  const [status, setStatus] = useState<IncidentStatus>(IncidentStatus.PENDING);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (id) {
      loadIncident();
    }
  }, [id]);

  const loadIncident = async () => {
    if (!id) return;
    setLoading(true);
    setError('');
    try {
      const data = await incidentService.getIncidentById(id);
      setIncident(data);
      setStatus(data.status);
    } catch (err: any) {
      const errorMessage = apiService.getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

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
    } catch (err: any) {
      const errorMessage = apiService.getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500">Loading incident details...</div>
      </div>
    );
  }

  if (!incident) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600">Incident not found</div>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-4 text-blue-600 hover:text-blue-800"
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
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-2xl font-bold text-gray-900">{incident.title}</h1>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Incident Details */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Incident Details</h2>
            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-gray-500">Type</dt>
                <dd className="mt-1 text-sm text-gray-900">{incident.type}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    incident.status === IncidentStatus.PENDING ? 'bg-yellow-100 text-yellow-800' :
                    incident.status === IncidentStatus.VERIFIED ? 'bg-green-100 text-green-800' :
                    incident.status === IncidentStatus.FALSE ? 'bg-red-100 text-red-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {IncidentStatus[incident.status]}
                  </span>
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900 whitespace-pre-wrap">
                  {incident.description}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-gray-500">Location</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {incident.location.address}
                  {incident.location.coordinates && (
                    <span className="text-gray-500 ml-2">
                      ({incident.location.coordinates.lat}, {incident.location.coordinates.lng})
                    </span>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Reported</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {new Date(incident.createdAt || '').toLocaleString()}
                </dd>
              </div>
              {incident.verifiedAt && (
                <div>
                  <dt className="text-sm font-medium text-gray-500">Verified</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(incident.verifiedAt).toLocaleString()}
                  </dd>
                </div>
              )}
            </dl>

            {incident.metadata && Object.keys(incident.metadata).length > 0 && (
              <div className="mt-6">
                <dt className="text-sm font-medium text-gray-500 mb-2">Additional Information</dt>
                <dd className="text-sm text-gray-900">
                  <pre className="bg-gray-50 p-3 rounded text-xs overflow-auto">
                    {JSON.stringify(incident.metadata, null, 2)}
                  </pre>
                </dd>
              </div>
            )}
          </div>

          {/* Reporter Information */}
          {reporter && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Reporter Information</h2>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Name</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {reporter.firstName} {reporter.lastName}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{reporter.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Phone</dt>
                  <dd className="mt-1 text-sm text-gray-900">{reporter.phone}</dd>
                </div>
              </dl>
            </div>
          )}

          {/* Blockchain Information */}
          {(incident.blockchainTxId || incident.blockchainRecordId || incident.incidentHash) && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Blockchain Information</h2>
              <dl className="space-y-4">
                {incident.incidentHash && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Incident Hash</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono text-xs break-all">
                      {incident.incidentHash}
                    </dd>
                  </div>
                )}
                {incident.blockchainTxId && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Transaction ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono text-xs break-all">
                      {incident.blockchainTxId}
                    </dd>
                  </div>
                )}
                {incident.blockchainRecordId && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Record ID</dt>
                    <dd className="mt-1 text-sm text-gray-900 font-mono text-xs break-all">
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
          <div className="bg-white shadow rounded-lg p-6 sticky top-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Verification Actions</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Verification Notes
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={4}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm"
                  placeholder="Add notes about verification..."
                />
              </div>

              <div className="space-y-2">
                {STATUS_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleStatusUpdate(option.value)}
                    disabled={updating || incident.status === option.value}
                    className={`w-full px-4 py-2 rounded-md text-sm font-medium ${
                      option.value === IncidentStatus.VERIFIED
                        ? 'bg-green-600 text-white hover:bg-green-700'
                        : option.value === IncidentStatus.FALSE
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {updating ? 'Updating...' : option.label}
                  </button>
                ))}
              </div>

              {incident.verificationNotes && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Previous Notes</h3>
                  <p className="text-sm text-gray-600">{incident.verificationNotes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
