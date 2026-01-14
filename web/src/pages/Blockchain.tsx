/**
 * Blockchain Audit Log Viewer
 * Read-only view of blockchain transactions
 */

import { useState, useEffect } from 'react';
import { Incident } from '../types';
import { incidentService } from '../services/incidentService';
import { apiService } from '../services/api';

export const Blockchain = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<'all' | 'hashed'>('hashed');

  useEffect(() => {
    loadIncidents();
  }, [filter]);

  const loadIncidents = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await incidentService.getIncidents({ limit: 100 });
      let filtered = response.incidents;
      
      if (filter === 'hashed') {
        filtered = filtered.filter((inc) => inc.blockchainTxId || inc.blockchainRecordId);
      }
      
      setIncidents(filtered);
    } catch (err: any) {
      const errorMessage = apiService.getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Blockchain Audit Log</h1>
        <p className="mt-1 text-sm text-gray-600">
          View blockchain transactions and hashes (Read-only)
        </p>
      </div>

      {/* Filter */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-4">
          <label className="text-sm font-medium text-gray-700">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'all' | 'hashed')}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="hashed">Only with Blockchain Data</option>
            <option value="all">All Incidents</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading blockchain data...</div>
        </div>
      ) : incidents.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <p className="text-gray-500">No blockchain records found</p>
        </div>
      ) : (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {incidents.map((incident) => (
              <li key={incident._id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {incident.title}
                    </p>
                    <div className="mt-2 space-y-1">
                      {incident.incidentHash && (
                        <div className="text-xs">
                          <span className="font-medium text-gray-500">Hash:</span>
                          <span className="ml-2 font-mono text-gray-900 break-all">
                            {incident.incidentHash}
                          </span>
                        </div>
                      )}
                      {incident.blockchainTxId && (
                        <div className="text-xs">
                          <span className="font-medium text-gray-500">Tx ID:</span>
                          <span className="ml-2 font-mono text-gray-900 break-all">
                            {incident.blockchainTxId}
                          </span>
                        </div>
                      )}
                      {incident.blockchainRecordId && (
                        <div className="text-xs">
                          <span className="font-medium text-gray-500">Record ID:</span>
                          <span className="ml-2 font-mono text-gray-900 break-all">
                            {incident.blockchainRecordId}
                          </span>
                        </div>
                      )}
                      <div className="text-xs text-gray-500">
                        Created: {new Date(incident.createdAt || '').toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      incident.status === 0 ? 'bg-yellow-100 text-yellow-800' :
                      incident.status === 1 ? 'bg-green-100 text-green-800' :
                      incident.status === 2 ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      Status: {incident.status}
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
