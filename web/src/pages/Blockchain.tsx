/**
 * Blockchain Audit Log Viewer
 * Read-only view of blockchain transactions
 */

import { useCallback, useEffect, useState } from 'react';
import { Incident } from '../types';
import { incidentService } from '../services/incidentService';
import { apiService } from '../services/api';

export const Blockchain = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'hashed'>('hashed');

  const loadIncidents = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const response = await incidentService.getIncidents({ limit: 100 });
      let filtered = response.incidents;
      
      if (filter === 'hashed') {
        filtered = filtered.filter((inc) => inc.blockchainTxId || inc.blockchainRecordId);
      }
      
      setIncidents(filtered);
    } catch (err: unknown) {
      const errorMessage = apiService.getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    void loadIncidents();
  }, [loadIncidents]);

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-safenet-text-primary">Blockchain Audit Log</h1>
        <p className="mt-1 text-sm sn-text-tertiary">
          View blockchain transactions and hashes (Read-only)
        </p>
      </div>

      {/* Filter */}
      <div className="sn-card p-5 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
          <label className="text-sm font-semibold sn-text-secondary">Filter</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'hashed')}
            className="sn-select sm:max-w-sm"
          >
            <option value="hashed">Only with Blockchain Data</option>
            <option value="all">All Incidents</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="sn-card border-red-300/20 bg-red-500/10 text-red-200 px-4 py-3 rounded-xl mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="sn-text-tertiary">Loading blockchain data...</div>
        </div>
      ) : incidents.length === 0 ? (
        <div className="sn-card p-12 text-center">
          <p className="sn-text-tertiary">No blockchain records found</p>
        </div>
      ) : (
        <div className="sn-card overflow-hidden">
          <ul className="divide-y sn-divider">
            {incidents.map((incident) => (
              <li key={incident._id} className="px-4 py-4 sm:px-6 hover:bg-white/5 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-safenet-text-primary truncate">
                      {incident.title}
                    </p>
                    <div className="mt-2 space-y-1">
                      {incident.incidentHash && (
                        <div className="text-xs">
                          <span className="font-semibold sn-text-tertiary">Hash</span>
                          <span className="ml-2 font-mono text-safenet-text-primary break-all">
                            {incident.incidentHash}
                          </span>
                        </div>
                      )}
                      {incident.blockchainTxId && (
                        <div className="text-xs">
                          <span className="font-semibold sn-text-tertiary">Tx ID</span>
                          <span className="ml-2 font-mono text-safenet-text-primary break-all">
                            {incident.blockchainTxId}
                          </span>
                        </div>
                      )}
                      {incident.blockchainRecordId && (
                        <div className="text-xs">
                          <span className="font-semibold sn-text-tertiary">Record ID</span>
                          <span className="ml-2 font-mono text-safenet-text-primary break-all">
                            {incident.blockchainRecordId}
                          </span>
                        </div>
                      )}
                      <div className="text-xs sn-text-tertiary">
                        Created: {new Date(incident.createdAt || '').toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span
                      className={
                        incident.status === 0
                          ? 'sn-badge-pending'
                          : incident.status === 1
                          ? 'sn-badge-verified'
                          : incident.status === 2
                          ? 'sn-badge-false'
                          : 'sn-badge-resolved'
                      }
                    >
                      {incident.status === 0
                        ? 'Pending'
                        : incident.status === 1
                        ? 'Verified'
                        : incident.status === 2
                        ? 'False'
                        : 'Resolved'}
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
