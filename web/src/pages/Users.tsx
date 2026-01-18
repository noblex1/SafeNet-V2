/**
 * Users Management Page (Basic)
 * View users - read-only for now
 */

export const Users = () => {
  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-safenet-text-primary">User Management</h1>
        <p className="mt-1 text-sm sn-text-tertiary">
          View and manage system users
        </p>
      </div>

      <div className="sn-card p-12 text-center">
        <p className="sn-text-secondary">
          User management feature coming soon. This will allow admins to view and manage user accounts.
        </p>
        <p className="text-sm sn-text-tertiary mt-2">
          Note: Backend endpoint for user listing needs to be implemented.
        </p>
      </div>
    </div>
  );
};
