import React, { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import {
  Users,
  CheckCircle,
  FileText,
  AlertOctagon,
  Plus,
  Search,
  ExternalLink,
  Edit3,
  Trash2,
  Copy,
  Check,
  ToggleLeft,
  ToggleRight,
  Shield,
  Layers,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Loader2,
  RefreshCw,
  Mail
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { IPortfolio, IDashboardStats, PortfolioStatus } from '../../types';
import { DynamicMeta } from '../../components/common/DynamicMeta';

// ✅ Smart environment detection:
// - On localhost / 127.0.0.1 / LAN IPs → use current origin (e.g. http://localhost:5173)
// - On any real HTTPS domain → force the production subdomain
const PRODUCTION_PUBLIC_BASE_URL = 'https://profile.focusengineeringapp.com';

const getPublicBaseUrl = (): string => {
  if (typeof window === 'undefined') return PRODUCTION_PUBLIC_BASE_URL;

  const { protocol, hostname, origin } = window.location;

  const isLocal =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '0.0.0.0' ||
    hostname.endsWith('.local') ||
    /^192\.168\.\d+\.\d+$/.test(hostname) ||
    /^10\.\d+\.\d+\.\d+$/.test(hostname) ||
    /^172\.(1[6-9]|2\d|3[01])\.\d+\.\d+$/.test(hostname);

  // Local dev (http) → keep current origin so links preview locally
  if (isLocal || protocol === 'http:') {
    return origin;
  }

  // Any real HTTPS deployment → use the branded subdomain
  return PRODUCTION_PUBLIC_BASE_URL;
};

export const AdminDashboardPage: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [portfolios, setPortfolios] = useState<IPortfolio[]>([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, limit: 10, totalPages: 1 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Resolved once per render — stable across the component
  const publicBaseUrl = getPublicBaseUrl();

  const loadData = async () => {
    setLoading(true);
    try {
      const [statsData, portfoliosData] = await Promise.all([
        adminApi.getStats(),
        adminApi.getPortfolios({
          page: pagination.page,
          limit: pagination.limit,
          search,
          status: statusFilter,
        }),
      ]);
      setStats(statsData);
      setPortfolios(portfoliosData.portfolios || []);
      setPagination(portfoliosData.pagination || { total: 0, page: 1, limit: 10, totalPages: 1 });
    } catch (e) {
      console.error('Failed to load dashboard data', e);
      // ✅ If not authenticated, redirect to login
      if (!user) {
        logout();
        navigate('/admin/login', { replace: true });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [pagination.page, statusFilter, user]);

  // ✅ Redirect unauthenticated users away from the dashboard
  if (!user && !loading) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination((prev) => ({ ...prev, page: 1 }));
    loadData();
  };

  const handleCopyLink = (slug: string) => {
    const url = `${publicBaseUrl}/${slug}`;
    navigator.clipboard.writeText(url);
    setCopiedSlug(slug);
    setTimeout(() => setCopiedSlug(null), 2500);
  };

  const handleTogglePublish = async (id: string) => {
    setActionLoading(id);
    try {
      await adminApi.togglePublish(id);
      await loadData();
    } catch (e) {
      console.error('Failed to toggle publish status', e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatusChange = async (id: string, newStatus: PortfolioStatus) => {
    setActionLoading(id);
    try {
      await adminApi.updateStatus(id, newStatus);
      await loadData();
    } catch (e) {
      console.error('Failed to update status', e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await adminApi.deletePortfolio(id);
      setDeleteConfirmId(null);
      await loadData();
    } catch (e) {
      console.error('Failed to delete portfolio', e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-corporate-secBg flex flex-col">
      <DynamicMeta title="Administrator Dashboard" />

      {/* Admin Top Header */}
      <header className="bg-corporate-deep text-white border-b border-corporate-navy sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-corporate-blue flex items-center justify-center text-white">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-sm sm:text-base tracking-tight">
                FOCUS <span className="text-corporate-lightBlue">ENGINEERING</span>
              </span>
              <span className="hidden sm:inline-block text-xs text-slate-400 ml-2 font-mono">
                /admin-console
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-xs text-slate-300 hover:text-white transition-colors hidden sm:inline-flex items-center space-x-1"
            >
              <span>View Public Platform</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <div className="h-4 w-px bg-slate-700 hidden sm:block" />

            <div className="flex items-center space-x-2 text-xs">
              <span className="font-semibold text-slate-300">{user?.name}</span>
              <span className="px-1.5 py-0.5 rounded bg-corporate-blue text-white text-[10px] font-bold uppercase">
                {user?.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Page Title & Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-corporate-deep tracking-tight">
              Portfolio Overview & Governance
            </h1>
            <p className="text-xs sm:text-sm text-corporate-mutedText mt-1">
              Manage professional user profiles, dynamic slug routes, and publication statuses.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={loadData}
              className="p-2.5 rounded-xl border border-corporate-border bg-white text-corporate-mutedText hover:text-corporate-navy hover:bg-slate-50 transition-colors"
              title="Refresh Data"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <Link
              to="/admin/portfolios/new"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl bg-corporate-navy text-white text-sm font-bold hover:bg-corporate-deep transition-all shadow-subtle hover:shadow-card"
            >
              <Plus className="w-4 h-4" />
              <span>Create New Portfolio</span>
            </Link>
          </div>
        </div>

        {/* Real Database Statistics Cards */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-corporate-border shadow-subtle">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-corporate-mutedText uppercase tracking-wider">Total</span>
                <Users className="w-4 h-4 text-corporate-navy" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-corporate-deep mt-2">{stats.total}</p>
              <p className="text-[11px] text-corporate-mutedText mt-1">Registered profiles</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-corporate-border shadow-subtle">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Published</span>
                <CheckCircle className="w-4 h-4 text-emerald-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 mt-2">{stats.published}</p>
              <p className="text-[11px] text-emerald-600 mt-1">Publicly accessible</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-corporate-border shadow-subtle">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">Drafts</span>
                <FileText className="w-4 h-4 text-amber-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-amber-700 mt-2">{stats.draft}</p>
              <p className="text-[11px] text-amber-600 mt-1">Unpublished WIP</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-corporate-border shadow-subtle">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-600 uppercase tracking-wider">Disabled</span>
                <AlertOctagon className="w-4 h-4 text-red-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-red-700 mt-2">{stats.disabled}</p>
              <p className="text-[11px] text-red-600 mt-1">Temporarily offline</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-corporate-border shadow-subtle col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-corporate-blue uppercase tracking-wider">Inquiries</span>
                <Mail className="w-4 h-4 text-corporate-blue" />
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-corporate-blue mt-2">{stats.totalInquiries}</p>
              <p className="text-[11px] text-corporate-mutedText mt-1">Submitted messages</p>
            </div>
          </div>
        )}

        {/* Portfolios Management Panel */}
        <div className="bg-white rounded-2xl border border-corporate-border shadow-subtle overflow-hidden">
          {/* Search & Filter Bar */}
          <div className="p-4 sm:p-6 border-b border-corporate-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                placeholder="Search by name, role, or slug..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-corporate-secBg rounded-xl border border-corporate-border text-sm outline-none focus:ring-2 focus:ring-corporate-blue text-corporate-text"
              />
            </form>

            <div className="flex items-center space-x-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-corporate-mutedText uppercase tracking-wider">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination((prev) => ({ ...prev, page: 1 }));
                }}
                className="px-3 py-2 bg-corporate-secBg rounded-xl border border-corporate-border text-xs font-semibold text-corporate-text outline-none focus:ring-2 focus:ring-corporate-blue"
              >
                <option value="">All Statuses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
          </div>

          {/* Table Container */}
          {loading ? (
            <div className="py-20 text-center">
              <Loader2 className="w-8 h-8 text-corporate-navy animate-spin mx-auto" />
              <p className="text-xs font-semibold text-corporate-mutedText mt-3">Loading portfolios from database...</p>
            </div>
          ) : portfolios.length === 0 ? (
            <div className="py-16 text-center">
              <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-corporate-navy">No Portfolios Found</h3>
              <p className="text-xs text-corporate-mutedText mt-1">
                {search || statusFilter ? 'Try modifying your search or filter.' : 'Create your first portfolio profile now.'}
              </p>
              <Link
                to="/admin/portfolios/new"
                className="mt-4 inline-flex items-center space-x-1.5 px-4 py-2 rounded-lg bg-corporate-navy text-white text-xs font-bold"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create Portfolio</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-corporate-secBg/70 text-corporate-mutedText text-[11px] uppercase font-bold tracking-wider border-b border-corporate-border">
                  <tr>
                    <th className="py-3.5 px-6">Professional Profile</th>
                    <th className="py-3.5 px-6">Public Dynamic URL</th>
                    <th className="py-3.5 px-6">Template</th>
                    <th className="py-3.5 px-6">Status</th>
                    <th className="py-3.5 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-corporate-border">
                  {portfolios.map((item) => (
                    <tr key={item._id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Title */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-xl overflow-hidden bg-corporate-secBg border border-corporate-border flex-shrink-0">
                            {item.profilePhoto ? (
                              <img src={item.profilePhoto} alt={item.fullName} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-corporate-navy text-white flex items-center justify-center font-bold text-xs">
                                {item.fullName.charAt(0)}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-corporate-navy text-sm leading-tight">{item.fullName}</p>
                            <p className="text-xs text-corporate-mutedText">{item.professionalTitle}</p>
                            <span className="text-[10px] text-corporate-blue font-semibold">{item.professionalRole}</span>
                          </div>
                        </div>
                      </td>

                      {/* Slug / Public Link */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <span className="font-mono text-xs font-bold text-corporate-deep bg-corporate-secBg px-2 py-1 rounded border border-slate-200">
                            /{item.slug}
                          </span>
                          <button
                            onClick={() => handleCopyLink(item.slug)}
                            className="p-1 rounded text-slate-400 hover:text-corporate-blue hover:bg-corporate-lightBlue/30 transition-colors"
                            title={`Copy ${publicBaseUrl}/${item.slug}`}
                          >
                            {copiedSlug === item.slug ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-1 truncate max-w-[220px]">
                          {publicBaseUrl}/{item.slug}
                        </p>
                      </td>

                      {/* Template */}
                      <td className="py-4 px-6">
                        <span className="text-xs font-medium text-slate-700 capitalize">
                          {item.selectedTemplate === 'modern-professional' ? 'Modern Professional' : 'Classic Corporate'}
                        </span>
                      </td>

                      {/* Status Toggle */}
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleTogglePublish(item._id)}
                            disabled={actionLoading === item._id}
                            className={`inline-flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-bold transition-all ${item.status === 'published'
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : item.status === 'disabled'
                                ? 'bg-red-100 text-red-800 hover:bg-red-200'
                                : 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              }`}
                            title="Click to toggle publish/draft"
                          >
                            {item.status === 'published' ? (
                              <ToggleRight className="w-4 h-4 text-emerald-600" />
                            ) : (
                              <ToggleLeft className="w-4 h-4 text-slate-500" />
                            )}
                            <span className="capitalize">{item.status}</span>
                          </button>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-6 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          {/* ✅ Live preview — env-aware base URL */}
                          <a
                            href={`${publicBaseUrl}/${item.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg text-slate-500 hover:text-corporate-blue hover:bg-corporate-secBg transition-colors"
                            title={`Open ${publicBaseUrl}/${item.slug}`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </a>

                          {/* Edit (stays inside the admin app) */}
                          <Link
                            to={`/admin/portfolios/${item._id}/edit`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-corporate-navy hover:bg-corporate-secBg transition-colors"
                            title="Edit Portfolio Profile"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Link>

                          {/* Delete */}
                          <button
                            onClick={() => setDeleteConfirmId(item._id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete Portfolio"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="p-4 border-t border-corporate-border flex items-center justify-between text-xs text-corporate-mutedText">
              <span>
                Showing page {pagination.page} of {pagination.totalPages} ({pagination.total} total records)
              </span>
              <div className="flex space-x-2">
                <button
                  disabled={pagination.page <= 1}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page - 1 }))}
                  className="px-3 py-1.5 rounded-lg border border-corporate-border bg-white text-corporate-text disabled:opacity-40 flex items-center space-x-1"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>Prev</span>
                </button>
                <button
                  disabled={pagination.page >= pagination.totalPages}
                  onClick={() => setPagination((prev) => ({ ...prev, page: prev.page + 1 }))}
                  className="px-3 py-1.5 rounded-lg border border-corporate-border bg-white text-corporate-text disabled:opacity-40 flex items-center space-x-1"
                >
                  <span>Next</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full border border-corporate-border shadow-elevated space-y-4">
            <h3 className="text-lg font-bold text-corporate-navy">Delete Portfolio?</h3>
            <p className="text-xs text-corporate-mutedText leading-relaxed">
              Are you sure you want to permanently delete this portfolio? This action cannot be undone and the URL slug will be released.
            </p>
            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-lg border border-corporate-border text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-lg bg-red-600 text-white text-xs font-semibold hover:bg-red-700 shadow-subtle"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};