import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layers, Shield, Menu, X, ArrowUpRight, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-corporate-border transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-18 py-3">
          {/* Logo Branding */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-corporate-navy flex items-center justify-center text-white shadow-card group-hover:bg-corporate-blue transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-corporate-deep block leading-tight">
                FOCUS <span className="text-corporate-blue">ENGINEERING</span>
              </span>
              <span className="text-xs text-corporate-mutedText tracking-wider uppercase font-medium">
                Portfolio Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm font-medium text-corporate-text hover:text-corporate-blue transition-colors"
            >
              Platform Overview
            </Link>
            <a
              href="/#directory"
              className="text-sm font-medium text-corporate-text hover:text-corporate-blue transition-colors"
            >
              Public Directory
            </a>

            {/* Quick links to sample portfolios (admin preview only) */}
            {isAuthenticated && (
              <>
                <div className="h-4 w-px bg-corporate-border"></div>
                <div className="flex items-center space-x-2 text-xs font-semibold text-corporate-mutedText">
                  <span>Samples (Preview):</span>
                  <Link
                    to="/manoj"
                    className="px-2 py-1 rounded bg-corporate-secBg hover:bg-corporate-lightBlue text-corporate-navy transition-colors"
                  >
                    /manoj
                  </Link>
                  <Link
                    to="/dj"
                    className="px-2 py-1 rounded bg-corporate-secBg hover:bg-corporate-lightBlue text-corporate-navy transition-colors"
                  >
                    /dj
                  </Link>
                </div>
              </>
            )}
          </div>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <Link
                  to="/admin"
                  className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg bg-corporate-navy text-white text-sm font-medium hover:bg-corporate-deep transition-all shadow-subtle"
                >
                  <Shield className="w-4 h-4" />
                  <span>Admin Console</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-medium text-corporate-mutedText hover:text-red-600 transition-colors"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-lg border border-corporate-border bg-white text-corporate-navy text-sm font-medium hover:bg-corporate-secBg transition-colors"
              >
                <User className="w-4 h-4" />
                <span>Admin Portal</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-corporate-mutedText" />
              </Link>
            )}
          </div>

          {/* Mobile Hamburger Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-corporate-mutedText hover:text-corporate-text hover:bg-corporate-secBg focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-corporate-border bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-corporate-text hover:text-corporate-blue"
          >
            Platform Overview
          </Link>
          <a
            href="/#directory"
            onClick={() => setMobileMenuOpen(false)}
            className="block py-2 text-base font-medium text-corporate-text hover:text-corporate-blue"
          >
            Public Directory
          </a>

          {/* Sample portfolios in mobile drawer (admin preview only) */}
          {isAuthenticated && (
            <div className="py-2 border-t border-corporate-border">
              <p className="text-xs font-semibold text-corporate-mutedText mb-2 uppercase tracking-wider">
                Sample Portfolios (Preview)
              </p>
              <div className="flex space-x-2">
                <Link
                  to="/manoj"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded bg-corporate-secBg text-sm font-medium text-corporate-navy"
                >
                  Manoj (Corporate)
                </Link>
                <Link
                  to="/dj"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2 rounded bg-corporate-secBg text-sm font-medium text-corporate-navy"
                >
                  DJ (Modern)
                </Link>
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-corporate-border">
            {isAuthenticated ? (
              <div className="space-y-2">
                <Link
                  to="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center block py-2.5 rounded-lg bg-corporate-navy text-white font-medium text-sm"
                >
                  Admin Console ({user?.name})
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="w-full text-center block py-2 rounded-lg border border-red-200 text-red-600 text-sm font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <Link
                to="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center block py-2.5 rounded-lg bg-corporate-navy text-white font-medium text-sm"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};
