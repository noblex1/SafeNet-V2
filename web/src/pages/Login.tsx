/**
 * Login Page
 */

import { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { apiService } from '../services/api';

export const Login = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Redirect if already authenticated
  if (isAuthenticated) {
    navigate('/dashboard');
    return null;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: unknown) {
      const errorMessage = apiService.getErrorMessage(err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen sn-app-bg flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="sn-card p-8">
          <div className="flex items-center gap-3 justify-center">
            <div className="h-10 w-10 rounded-full bg-neon-cyan shadow-glow-cyan flex items-center justify-center text-black font-black">
              S
            </div>
            <div className="text-left">
              <div className="text-2xl font-extrabold tracking-tight text-safenet-text-primary">
                SafeNet <span className="text-neon-cyan">Admin</span>
              </div>
              <div className="text-sm sn-text-tertiary">Sign in to manage incidents</div>
            </div>
          </div>

          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="sn-card border-red-300/20 bg-red-500/10 text-red-200 px-4 py-3 rounded-xl">
              {error}
            </div>
          )}

          <div className="space-y-3">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-safenet-text-secondary mb-2">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="sn-input"
                placeholder="admin@safenet.app"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-safenet-text-secondary mb-2">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="sn-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="sn-button-primary w-full"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};
