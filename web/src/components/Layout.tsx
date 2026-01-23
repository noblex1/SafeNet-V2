/**
 * Dashboard Layout Component
 */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useNotifications } from '../context/NotificationContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
  const { unreadCount } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen sn-app-bg">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 sn-glass border-x-0 border-t-0 rounded-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-neon-cyan shadow-glow-cyan flex items-center justify-center text-black font-black">
                  S
                </div>
                <div className="leading-tight">
                  <div className="text-base font-extrabold tracking-tight">
                    SafeNet <span className="text-neon-cyan">Admin</span>
                  </div>
                  <div className="text-xs sn-text-tertiary">Incident verification console</div>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-2">
                <Link
                  to="/dashboard"
                  className={[
                    "px-4 py-2 rounded-xl text-sm font-semibold transition-colors border",
                    isActive('/dashboard')
                      ? "bg-white/10 border-neon-cyan/30 text-neon-cyan shadow-glow-cyan"
                      : "bg-transparent border-transparent text-safenet-text-secondary hover:bg-white/5 hover:border-safenet-glass-border hover:text-safenet-text-primary",
                  ].join(" ")}
                >
                  Incidents
                </Link>
                <Link
                  to="/users"
                  className={[
                    "px-4 py-2 rounded-xl text-sm font-semibold transition-colors border",
                    isActive('/users')
                      ? "bg-white/10 border-neon-cyan/30 text-neon-cyan shadow-glow-cyan"
                      : "bg-transparent border-transparent text-safenet-text-secondary hover:bg-white/5 hover:border-safenet-glass-border hover:text-safenet-text-primary",
                  ].join(" ")}
                >
                  Users
                </Link>
                <Link
                  to="/blockchain"
                  className={[
                    "px-4 py-2 rounded-xl text-sm font-semibold transition-colors border",
                    isActive('/blockchain')
                      ? "bg-white/10 border-neon-cyan/30 text-neon-cyan shadow-glow-cyan"
                      : "bg-transparent border-transparent text-safenet-text-secondary hover:bg-white/5 hover:border-safenet-glass-border hover:text-safenet-text-primary",
                  ].join(" ")}
                >
                  Blockchain
                </Link>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications Icon with Badge */}
              <Link
                to="/dashboard"
                className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
                title="Notifications"
              >
                <svg
                  className="w-6 h-6 text-safenet-text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full border-2 border-safenet-bg">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>
              
              <div className="hidden md:flex flex-col items-end leading-tight">
                <div className="text-sm font-semibold text-safenet-text-primary">
                  {user?.firstName} {user?.lastName}
                </div>
                <div className="text-xs sn-text-tertiary">{user?.role}</div>
              </div>
              <button onClick={handleLogout} className="sn-button-ghost px-3 py-2">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
};
