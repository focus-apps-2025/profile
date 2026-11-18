import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck,
  Search,
  ArrowRight,
  ExternalLink,
  ChevronRight,
  UserCheck,
  Lock
} from 'lucide-react';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { DynamicMeta } from '../components/common/DynamicMeta';
import { publicApi } from '../services/api';
import { IPortfolio } from '../types';

export const LandingPage: React.FC = () => {
  const [portfolios, setPortfolios] = useState<IPortfolio[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchDirectory = async () => {
      try {
        const data = await publicApi.getDirectory();
        setPortfolios(data);
      } catch (e) {
        console.error('Failed to load public directory', e);
      } finally {
        setLoading(false);
      }
    };
    fetchDirectory();
  }, []);

  const roles = Array.from(new Set(portfolios.map((p) => p.professionalRole).filter(Boolean)));

  const filteredPortfolios = portfolios.filter((p) => {
    const matchesSearch =
      searchQuery === '' ||
      p.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.professionalTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.slug.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole = selectedRole === 'all' || p.professionalRole === selectedRole;
    return matchesSearch && matchesRole;
  });

  const featuredPortfolios = portfolios.filter((p) => p.isFeatured).slice(0, 3);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <DynamicMeta
        title="FOCUS Engineering — Multi-User Portfolio Platform"
        description="Classical corporate portfolio platform empowering technical specialists, architects, and engineering leaders with dynamic individualized portfolio URLs."
      />

      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-corporate-secBg to-white pt-16 sm:pt-24 pb-20 sm:pb-32 border-b border-corporate-border">
        {/* Visual Background Ornaments */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 rounded-full bg-corporate-lightBlue/40 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-corporate-blue/10 blur-2xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-corporate-lightBlue text-corporate-navy text-xs font-bold tracking-wide uppercase shadow-subtle"
            >
              <ShieldCheck className="w-4 h-4 text-corporate-navy" />
              <span>Enterprise Identity Platform</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-corporate-deep tracking-tight leading-tight"
            >
              Unified Engineering <span className="text-corporate-navy">Portfolios.</span>
              <br className="hidden sm:inline" /> Individual <span className="text-corporate-blue">Identities.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg sm:text-xl text-corporate-mutedText leading-relaxed"
            >
              Empower engineering leaders, architects, and technical specialists with classical,
              high-performance digital portfolios—delivered dynamically from a single centralized platform.
            </motion.p>

            {/* Hero Quick Exploration Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-4 pt-4"
            >
              <a
                href="#directory"
                className="px-6 py-3.5 rounded-xl bg-corporate-navy text-white text-sm font-semibold hover:bg-corporate-deep transition-all shadow-subtle hover:shadow-card flex items-center space-x-2"
              >
                <span>Browse Engineering Directory</span>
                <ChevronRight className="w-4 h-4" />
              </a>

              <Link
                to="/admin/login"
                className="px-6 py-3.5 rounded-xl border border-corporate-border bg-white text-corporate-text text-sm font-semibold hover:bg-corporate-secBg transition-colors flex items-center space-x-2"
              >
                <Lock className="w-4 h-4 text-corporate-blue" />
                <span>Admin Console</span>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Profiles Section */}
      {featuredPortfolios.length > 0 && (
        <section className="py-16 bg-white border-b border-corporate-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-corporate-blue">Spotlight</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-corporate-navy mt-1">
                  Featured Technical Leaders
                </h2>
              </div>
              <a
                href="#directory"
                className="text-sm font-semibold text-corporate-blue hover:underline mt-2 md:mt-0 flex items-center space-x-1"
              >
                <span>View all verified profiles</span>
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPortfolios.map((portfolio) => (
                <div
                  key={portfolio._id}
                  className="corporate-card corporate-card-hover overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6">
                    <div className="flex items-start space-x-4 mb-4">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-corporate-secBg border-2 border-white shadow-subtle flex-shrink-0">
                        {portfolio.profilePhoto ? (
                          <img
                            src={portfolio.profilePhoto}
                            alt={portfolio.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-corporate-navy text-white flex items-center justify-center font-bold text-xl">
                            {portfolio.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <span className="text-[11px] font-bold text-corporate-blue uppercase tracking-wide">
                          {portfolio.professionalRole}
                        </span>
                        <h3 className="text-lg font-bold text-corporate-navy">{portfolio.fullName}</h3>
                        <p className="text-xs font-medium text-corporate-mutedText">{portfolio.professionalTitle}</p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-corporate-text line-clamp-2 leading-relaxed mb-4">
                      {portfolio.shortIntro}
                    </p>

                    {portfolio.skills && portfolio.skills.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-2">
                        {portfolio.skills.slice(0, 3).map((s, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded text-[10px] font-semibold bg-corporate-secBg text-slate-700"
                          >
                            {s.name}
                          </span>
                        ))}
                        {portfolio.skills.length > 3 && (
                          <span className="text-[10px] font-semibold text-slate-400 self-center">
                            +{portfolio.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="px-6 py-4 bg-corporate-secBg/60 border-t border-corporate-border flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-corporate-mutedText">
                      /{portfolio.slug}
                    </span>
                    <Link
                      to={`/${portfolio.slug}`}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-corporate-navy hover:text-corporate-blue transition-colors"
                    >
                      <span>View Portfolio</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Public Engineering Directory Section */}
      <section id="directory" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-corporate-blue">Talent Directory</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-corporate-navy mt-1">
                Engineering Directory
              </h2>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="bg-corporate-secBg p-4 rounded-xl border border-corporate-border mb-8 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Search by name, role, or slug..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-white rounded-lg border border-corporate-border text-sm outline-none focus:ring-2 focus:ring-corporate-blue text-corporate-text"
              />
            </div>

            {roles.length > 0 && (
              <div className="flex items-center space-x-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setSelectedRole('all')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${selectedRole === 'all'
                      ? 'bg-corporate-navy text-white shadow-subtle'
                      : 'bg-white border border-corporate-border text-slate-600 hover:bg-slate-100'
                    }`}
                >
                  All Roles
                </button>
                {roles.map((r) => (
                  <button
                    key={r}
                    onClick={() => setSelectedRole(r)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${selectedRole === r
                        ? 'bg-corporate-navy text-white shadow-subtle'
                        : 'bg-white border border-corporate-border text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Directory Grid */}
          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin w-8 h-8 border-4 border-corporate-navy border-t-transparent rounded-full" />
              <p className="text-xs text-corporate-mutedText mt-3 font-semibold">Loading verified engineering profiles...</p>
            </div>
          ) : filteredPortfolios.length === 0 ? (
            <div className="text-center py-16 corporate-card p-8">
              <UserCheck className="w-10 h-10 text-slate-400 mx-auto mb-2" />
              <h3 className="text-base font-bold text-corporate-navy">No Profiles Found</h3>
              <p className="text-xs text-corporate-mutedText mt-1">
                No published portfolios match your search criteria.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPortfolios.map((portfolio) => (
                <Link
                  key={portfolio._id}
                  to={`/${portfolio.slug}`}
                  className="corporate-card corporate-card-hover p-6 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-corporate-secBg border border-corporate-border flex-shrink-0">
                        {portfolio.profilePhoto ? (
                          <img
                            src={portfolio.profilePhoto}
                            alt={portfolio.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full bg-corporate-navy text-white flex items-center justify-center font-bold">
                            {portfolio.fullName.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-corporate-navy group-hover:text-corporate-blue transition-colors">
                          {portfolio.fullName}
                        </h3>
                        <p className="text-xs text-corporate-mutedText">{portfolio.professionalTitle}</p>
                      </div>
                    </div>
                    <p className="text-xs text-corporate-text line-clamp-2 leading-relaxed mb-4">
                      {portfolio.shortIntro}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold">
                    <span className="font-mono text-corporate-mutedText">/{portfolio.slug}</span>
                    <span className="text-corporate-blue inline-flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                      <span>View Profile</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};
