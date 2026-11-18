import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Layers, Lock, Mail, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { DynamicMeta } from '../../components/common/DynamicMeta';

export const AdminLoginPage: React.FC = () => {
  const [email, setEmail] = useState('admin@focusengineering.com');
  const [password, setPassword] = useState('AdminSecure2026!');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as any)?.from?.pathname || '/admin';

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/admin', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err: any) {
      setErrorMsg(
        err.response?.data?.message || 'Invalid administrator credentials. Please check your email and password.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-corporate-secBg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <DynamicMeta title="Admin Portal Login" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-xs font-semibold text-corporate-mutedText hover:text-corporate-navy mb-6 mx-auto block w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Public Platform</span>
        </Link>

        {/* Brand Icon */}
        <div className="flex justify-center">
          <div className="w-14 h-14 rounded-2xl bg-corporate-navy flex items-center justify-center text-white shadow-card">
            <Layers className="w-7 h-7" />
          </div>
        </div>

        <h2 className="mt-4 text-center text-2xl sm:text-3xl font-extrabold text-corporate-deep tracking-tight">
          FOCUS <span className="text-corporate-blue">ENGINEERING</span>
        </h2>
        <p className="mt-1 text-center text-xs uppercase tracking-wider font-semibold text-corporate-mutedText">
          Administrative Portfolio Console
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-premium rounded-2xl border border-corporate-border">
          {errorMsg && (
            <div className="mb-6 p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-xs font-bold text-corporate-text uppercase tracking-wider mb-1">
                Admin Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@focusengineering.com"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-corporate-border text-sm text-corporate-text outline-none focus:ring-2 focus:ring-corporate-blue transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-bold text-corporate-text uppercase tracking-wider mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                <input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-corporate-border text-sm text-corporate-text outline-none focus:ring-2 focus:ring-corporate-blue transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl bg-corporate-navy text-white text-sm font-bold hover:bg-corporate-deep transition-all shadow-subtle disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Session...</span>
                </>
              ) : (
                <span>Authenticate Session</span>
              )}
            </button>
          </form>

          {/* Quick Demo Credentials Info */}
          <div className="mt-6 pt-6 border-t border-slate-100 text-center space-y-1.5">
            <p className="text-xs font-bold text-corporate-mutedText uppercase tracking-wider">
              Provisioned Demo Credentials
            </p>
            <p className="text-xs font-mono bg-corporate-secBg py-1.5 px-2 rounded text-corporate-navy select-all">
              admin@focusengineering.com / AdminSecure2026!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
