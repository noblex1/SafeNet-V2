/**
 * Users Management Page (Basic)
 * View users - read-only for now
 */

import { useState, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';

export const Users = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Note: This endpoint doesn't exist yet in the backend
    // For now, we'll show a placeholder
    setLoading(false);
  }, []);

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
        <p className="mt-1 text-sm text-gray-600">
          View and manage system users
        </p>
      </div>

      <div className="bg-white shadow rounded-lg p-12 text-center">
        <p className="text-gray-500">
          User management feature coming soon. This will allow admins to view and manage user accounts.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          Note: Backend endpoint for user listing needs to be implemented.
        </p>
      </div>
    </div>
  );
};
