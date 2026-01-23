/**
 * Dashboard - Incident Review
 */

import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Incident, IncidentStatus, IncidentType } from '../types';
import { incidentService } from '../services/incidentService';
import { apiService } from '../services/api';
import { useNotifications } from '../context/NotificationContext';

const STATUS_LABELS: Record<IncidentStatus, string> = {
  [IncidentStatus.PENDING]: 'Pending',
  [IncidentStatus.VERIFIED]: 'Verified',
  [IncidentStatus.FALSE]: 'False',
  [IncidentStatus.RESOLVED]: 'Resolved',
};

const STATUS_COLORS: Record<IncidentStatus, string> = {
  [IncidentStatus.PENDING]: 'sn-badge-pending',
  [IncidentStatus.VERIFIED]: 'sn-badge-verified',
  [IncidentStatus.FALSE]: 'sn-badge-false',
  [IncidentStatus.RESOLVED]: 'sn-badge-resolved',
};

const TYPE_LABELS: Record<IncidentType, string> = {
  [IncidentType.MISSING_PERSON]: 'Missing Person',
  [IncidentType.KIDNAPPING]: 'Kidnapping',
  [IncidentType.STOLEN_VEHICLE]: 'Stolen Vehicle',
  [IncidentType.NATURAL_DISASTER]: 'Natural Disaster',
};

export const Dashboard = () => {
  const { notifications } = useNotifications();
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({
    status: '' as string,
    type: '' as string,
    page: 1,
    limit: 20,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 20,
  });

  const loadIncidents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params: {
        page: number;
        limit: number;
        status?: IncidentStatus;
        type?: string;
      } = {
        page: filters.page,
        limit: filters.limit,
      };
      if (filters.status) params.status = Number(filters.status) as IncidentStatus;
      if (filters.type) params.type = filters.type;

      const response = await incidentService.getIncidents(params);
      setIncidents(response.incidents);
      setPagination({
        total: response.total,
        page: response.page,
        limit: response.limit,
      });
    } catch (err: unknown) {
      const errorMessage = apiService.getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filters.limit, filters.page, filters.status, filters.type]);

  useEffect(() => {
    void loadIncidents();
  }, [loadIncidents]);

  // Refresh incidents when a new incident is created (from notifications)
  useEffect(() => {
    const newIncidentNotification = notifications.find(
      (n) => n.type === 'incident_created' && !n.read
    );
    if (newIncidentNotification) {
      // Reload incidents to show the new one
      void loadIncidents();
    }
  }, [notifications, loadIncidents]);

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value, page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    setFilters({ ...filters, page: newPage });
  };

  const totalPages = Math.ceil(pagination.total / pagination.limit);

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-safenet-text-primary">Incident Dashboard</h1>
        <p className="mt-1 text-sm sn-text-tertiary">
          Review and verify reported incidents
        </p>
      </div>

      {/* Filters */}
      <div className="sn-card p-5 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold sn-text-secondary mb-2">
              Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="sn-select"
            >
              <option value="">All Statuses</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold sn-text-secondary mb-2">
              Type
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="sn-select"
            >
              <option value="">All Types</option>
              {Object.entries(TYPE_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => setFilters({ ...filters, status: '', type: '', page: 1 })}
              className="sn-button-ghost w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="sn-card border-red-300/20 bg-red-500/10 text-red-200 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {/* Incidents Table */}
      {loading ? (
        <div className="text-center py-12">
          <div className="sn-text-tertiary">Loading incidents...</div>
        </div>
      ) : incidents.length === 0 ? (
        <div className="sn-card p-12 text-center">
          <p className="sn-text-tertiary">No incidents found</p>
        </div>
      ) : (
        <>
          <div className="sn-card overflow-hidden">
            <ul className="divide-y sn-divider">
              {incidents.map((incident) => (
                <li key={incident._id}>
                  <Link
                    to={`/incidents/${incident._id}`}
                    className="block hover:bg-white/5 px-4 py-4 sm:px-6 relative transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0 flex items-center">
                        {incident.images && incident.images.length > 0 && (
                          <div className="flex-shrink-0 mr-4 relative">
                            <img
                              src={incident.images[0]}
                              alt="Incident"
                              className="h-16 w-16 object-cover rounded-xl border border-safenet-glass-border"
                            />
                            {incident.images.length > 1 && (
                              <div className="absolute -bottom-1 -right-1 bg-neon-cyan text-black text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                                +{incident.images.length - 1}
                              </div>
                            )}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <p className="text-sm font-semibold text-neon-cyan truncate">
                              {incident.title}
                            </p>
                            <span
                              className={`ml-3 ${STATUS_COLORS[incident.status]}`}
                            >
                              {STATUS_LABELS[incident.status]}
                            </span>
                          </div>
                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm sn-text-tertiary">
                            <span>
                              {TYPE_LABELS[incident.type]}
                            </span>
                            <span className="truncate">
                              <span className="text-safenet-text-secondary">📍</span> {incident.location.address}
                            </span>
                            <span>
                              {new Date(incident.createdAt || '').toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-5 flex-shrink-0">
                        <svg
                          className="h-5 w-5 text-safenet-text-tertiary"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="sn-card px-4 py-3 flex items-center justify-between sm:px-6 mt-4">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="sn-button-ghost px-4 py-2"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === totalPages}
                  className="sn-button-ghost px-4 py-2"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm sn-text-tertiary">
                    Showing{' '}
                    <span className="font-semibold text-safenet-text-primary">
                      {(pagination.page - 1) * pagination.limit + 1}
                    </span>{' '}
                    to{' '}
                    <span className="font-semibold text-safenet-text-primary">
                      {Math.min(pagination.page * pagination.limit, pagination.total)}
                    </span>{' '}
                    of <span className="font-semibold text-safenet-text-primary">{pagination.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-xl -space-x-px">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 1}
                      className="sn-button-ghost rounded-r-none px-3 py-2"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1)
                      .filter(
                        (page) =>
                          page === 1 ||
                          page === totalPages ||
                          (page >= pagination.page - 1 && page <= pagination.page + 1)
                      )
                      .map((page, index, array) => (
                        <React.Fragment key={page}>
                          {index > 0 && array[index - 1] !== page - 1 && (
                            <span className="relative inline-flex items-center px-4 py-2 border border-safenet-glass-border bg-safenet-glass-bg text-sm font-semibold text-safenet-text-secondary">
                              ...
                            </span>
                          )}
                          <button
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-semibold ${
                              page === pagination.page
                                ? 'z-10 bg-white/10 border-neon-cyan/30 text-neon-cyan'
                                : 'bg-safenet-glass-bg border-safenet-glass-border text-safenet-text-secondary hover:bg-white/10'
                            }`}
                          >
                            {page}
                          </button>
                        </React.Fragment>
                      ))}
                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page === totalPages}
                      className="sn-button-ghost rounded-l-none px-3 py-2"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
