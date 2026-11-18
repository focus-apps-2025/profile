import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { publicApi } from '../services/api';
import { IPortfolio, PortfolioTemplate } from '../types';
import { ClassicCorporateTemplate } from '../features/portfolio/templates/ClassicCorporateTemplate';
import { ModernProfessionalTemplate } from '../features/portfolio/templates/ModernProfessionalTemplate';
import { DynamicMeta } from '../components/common/DynamicMeta';
import { PortfolioNavbar } from '../components/common/PortfolioNavbar';
import { Footer } from '../components/common/Footer';
import {
  AlertTriangle,
  FileQuestion,
  Loader2,
  RefreshCw,
  Home,
  ShieldAlert,
  Sliders
} from 'lucide-react';

export const DynamicPortfolioPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  const [portfolio, setPortfolio] = useState<IPortfolio | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [previewTemplate, setPreviewTemplate] = useState<PortfolioTemplate | null>(null);

  const fetchPortfolio = async () => {
    if (!slug) return;
    setLoading(true);
    setErrorStatus(null);
    setErrorMessage('');

    try {
      const { portfolio: data, redirectSlug } = await publicApi.getPortfolio(slug);

      // If user navigated via an old slug recorded in slugHistory, silently redirect to current slug
      if (redirectSlug && redirectSlug !== slug) {
        navigate(`/${redirectSlug}`, { replace: true });
      }

      setPortfolio(data);
      setPreviewTemplate(data.selectedTemplate || 'classic-corporate');
    } catch (err: any) {
      const status = err.response?.status || 500;
      setErrorStatus(status);
      setErrorMessage(
        err.response?.data?.message ||
          'Unable to load the requested portfolio profile. Please check your network connection.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolio();
    window.scrollTo(0, 0);
  }, [slug]);

  // Loading Skeleton State
  if (loading) {
    return (
      <div className="min-h-screen bg-corporate-secBg flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-4">
          <Loader2 className="w-10 h-10 text-corporate-navy animate-spin" />
          <p className="text-sm font-semibold text-corporate-mutedText tracking-wide">
            Retrieving professional portfolio profile...
          </p>
        </div>
        <Footer />
      </div>
    );
  }

  // 404 Not Found State
  if (errorStatus === 404) {
    return (
      <div className="min-h-screen bg-corporate-secBg flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-700">
            <FileQuestion className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-corporate-navy">Portfolio Not Found</h1>
          <p className="text-sm text-corporate-mutedText leading-relaxed">
            {errorMessage || `The portfolio at '/${slug}' is either unpublished, disabled, or does not exist.`}
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <Link
              to="/"
              className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-corporate-navy text-white text-sm font-semibold hover:bg-corporate-deep"
            >
              <Home className="w-4 h-4" />
              <span>Back to Directory</span>
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // 403 Forbidden / Disabled State
  if (errorStatus === 403) {
    return (
      <div className="min-h-screen bg-corporate-secBg flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-red-100 flex items-center justify-center text-red-700">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-corporate-navy">Profile Deactivated</h1>
          <p className="text-sm text-corporate-mutedText leading-relaxed">
            {errorMessage || 'This engineering portfolio is currently inactive or undergoing maintenance.'}
          </p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-corporate-navy text-white text-sm font-semibold hover:bg-corporate-deep mt-2"
          >
            <Home className="w-4 h-4" />
            <span>Return to Platform Home</span>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  // General Error / Network State
  if (errorStatus || !portfolio) {
    return (
      <div className="min-h-screen bg-corporate-secBg flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center max-w-md mx-auto space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-700">
            <AlertTriangle className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold text-corporate-navy">Unable to Load Profile</h1>
          <p className="text-sm text-corporate-mutedText leading-relaxed">{errorMessage}</p>
          <button
            onClick={fetchPortfolio}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg bg-corporate-navy text-white text-sm font-semibold hover:bg-corporate-deep"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Connection</span>
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  // Active Template Selection
  const activeTemplate = previewTemplate || portfolio.selectedTemplate || 'classic-corporate';

  return (
    <div className="min-h-screen flex flex-col">
      {/* Dynamic SEO Meta */}
      <DynamicMeta
        title={`${portfolio.fullName} — ${portfolio.professionalTitle}`}
        description={portfolio.shortIntro}
        ogImage={portfolio.profilePhoto}
        canonicalUrl={`https://portfolio.focusengineeringapp.com/${portfolio.slug}`}
      />

      {/* Public Portfolio Dedicated Navbar */}
      <PortfolioNavbar portfolio={portfolio} />

      {/* Floating Preview Template Switcher */}
      <div className="fixed bottom-4 right-4 z-40 bg-white/95 backdrop-blur-md p-2 rounded-xl border border-corporate-border shadow-elevated flex items-center space-x-2 text-xs">
        <div className="flex items-center space-x-1.5 px-2 text-corporate-mutedText font-semibold">
          <Sliders className="w-3.5 h-3.5 text-corporate-blue" />
          <span>Template:</span>
        </div>
        <button
          onClick={() => setPreviewTemplate('classic-corporate')}
          className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
            activeTemplate === 'classic-corporate'
              ? 'bg-corporate-navy text-white'
              : 'bg-corporate-secBg text-slate-600 hover:bg-slate-200'
          }`}
        >
          Classic
        </button>
        <button
          onClick={() => setPreviewTemplate('modern-professional')}
          className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
            activeTemplate === 'modern-professional'
              ? 'bg-corporate-blue text-white'
              : 'bg-corporate-secBg text-slate-600 hover:bg-slate-200'
          }`}
        >
          Modern
        </button>
      </div>

      {/* Template View */}
      <main className="flex-1">
        {activeTemplate === 'modern-professional' ? (
          <ModernProfessionalTemplate portfolio={portfolio} />
        ) : (
          <ClassicCorporateTemplate portfolio={portfolio} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default DynamicPortfolioPage;
