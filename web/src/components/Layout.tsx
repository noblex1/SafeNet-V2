/**
 * Dashboard Layout Component
 */

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuth();
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
