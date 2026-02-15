import React from 'react';
import { Link, useLocation } from 'react-router';
import { useApp } from '../context/AppContext';
import { Brain, Zap, LogOut, Wifi, WifiOff } from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, lowBandwidthMode, toggleLowBandwidth } = useApp();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/40 backdrop-blur-xl border-b border-blue-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Brain className="size-8 text-blue-400 group-hover:text-blue-300 transition-colors" />
              <Zap className="size-4 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              SkillForge AI
            </span>
          </Link>

          {isAuthenticated && (
            <div className="hidden md:flex items-center gap-6">
              <NavLink to="/dashboard" active={isActive('/dashboard')}>Dashboard</NavLink>
              <NavLink to="/interactive-concept" active={isActive('/interactive-concept')}>Concept</NavLink>
              <NavLink to="/quiz" active={isActive('/quiz')}>Quiz</NavLink>
              <NavLink to="/visualizer" active={isActive('/visualizer')}>Visualizer</NavLink>
              <NavLink to="/build-mode" active={isActive('/build-mode')}>Build</NavLink>
              <NavLink to="/interview" active={isActive('/interview')}>Interview</NavLink>
              <NavLink to="/roadmap" active={isActive('/roadmap')}>Roadmap</NavLink>
              <NavLink to="/bot" active={isActive('/bot')}>Bot</NavLink>
            </div>
          )}

          <div className="flex items-center gap-4">
            {isAuthenticated && (
              <>
                <button
                  onClick={toggleLowBandwidth}
                  className="p-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors border border-blue-500/30"
                  title={lowBandwidthMode ? 'Disable Low Bandwidth Mode' : 'Enable Low Bandwidth Mode'}
                >
                  {lowBandwidthMode ? (
                    <WifiOff className="size-5 text-orange-400" />
                  ) : (
                    <Wifi className="size-5 text-blue-400" />
                  )}
                </button>
                <div className="px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-sm text-blue-300">
                  {user?.name}
                </div>
                <button
                  onClick={logout}
                  className="p-2 rounded-lg bg-red-500/10 hover:bg-red-500/20 transition-colors border border-red-500/30"
                  title="Logout"
                >
                  <LogOut className="size-5 text-red-400" />
                </button>
              </>
            )}
            {!isAuthenticated && (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg bg-blue-500/10 hover:bg-blue-500/20 transition-colors border border-blue-500/30 text-blue-300"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 transition-colors text-white"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavLink: React.FC<{ to: string; active: boolean; children: React.ReactNode }> = ({
  to,
  active,
  children,
}) => (
  <Link
    to={to}
    className={`text-sm transition-colors ${
      active
        ? 'text-blue-400 font-medium'
        : 'text-gray-400 hover:text-blue-300'
    }`}
  >
    {children}
  </Link>
);