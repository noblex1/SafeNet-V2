/**
 * Main App Component
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { useAuth } from './context/useAuth';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { IncidentDetail } from './pages/IncidentDetail';
import { Users } from './pages/Users';
import { Blockchain } from './pages/Blockchain';
import { UserRole } from './types';

const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen sn-app-bg flex items-center justify-center">
        <div className="sn-card px-6 py-4">
          <div className="text-sm sn-text-tertiary">Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/dashboard" replace /> : <Login />}
      />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute requireRole={[UserRole.ADMIN, UserRole.AUTHORITY]}>
            <Layout>
              <Dashboard />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/incidents/:id"
        element={
          <ProtectedRoute requireRole={[UserRole.ADMIN, UserRole.AUTHORITY]}>
            <Layout>
              <IncidentDetail />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute requireRole={[UserRole.ADMIN, UserRole.AUTHORITY]}>
            <Layout>
              <Users />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/blockchain"
        element={
          <ProtectedRoute requireRole={[UserRole.ADMIN, UserRole.AUTHORITY]}>
            <Layout>
              <Blockchain />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <NotificationProvider>
          <AppRoutes />
        </NotificationProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
