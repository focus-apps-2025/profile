import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Plus,
  Trash2,
  Upload,
  Layers,
  Building,
  User,
  GraduationCap,
  Briefcase,
  FileText,
  Sliders,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { adminApi } from '../../services/api';
import { IPortfolio, PortfolioStatus, PortfolioTemplate, ISkill, IExperience, IEducation, IProject, ICertification, IService } from '../../types';
import { DynamicMeta } from '../../components/common/DynamicMeta';

export const PortfolioBuilderPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'basic' | 'company' | 'skills' | 'experience' | 'projects' | 'settings'>('basic');
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const [slugStatus, setSlugStatus] = useState<{ checking: boolean; available?: boolean; message?: string }>({
    checking: false,
  });

  const [formData, setFormData] = useState<Partial<IPortfolio>>({
    fullName: '',
    slug: '',
    professionalTitle: '',
    professionalRole: 'Engineering Leadership',
    shortIntro: '',
    bio: '',
    profilePhoto: '',
    coverImage: '',
    email: '',
    phone: '',
    whatsapp: '',
    location: '',
    status: 'published' as PortfolioStatus,
    selectedTemplate: 'classic-corporate' as PortfolioTemplate,
    isFeatured: false,
    showInDirectory: true,
    resumeUrl: '',
    contactEnabled: true,
    company: {
      companyName: 'FOCUS Engineering',
      department: '',
      jobTitle: '',
      employmentType: 'Full-time',
      startDate: '',
      isCurrent: true,
    },
    skills: [],
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    services: [],
    socialLinks: {
      linkedin: '',
      twitter: '',
      website: '',
    },
  });

  const [newSkill, setNewSkill] = useState<ISkill>({ name: '', category: 'General', proficiencyLabel: 'Advanced' });
  const [newResp, setNewResp] = useState('');
  const [activeExpIndex, setActiveExpIndex] = useState<number | null>(null);
  const [techInput, setTechInput] = useState('');
  const [activeProjIndex, setActiveProjIndex] = useState<number | null>(null);

  useEffect(() => {
    if (isEditMode && id) {
      const loadPortfolio = async () => {
        try {
          const data = await adminApi.getPortfolio(id);
          setFormData({
            ...data,
            skills: data.skills || [],
            experience: data.experience || [],
            education: data.education || [],
            projects: data.projects || [],
            certifications: data.certifications || [],
            services: data.services || [],
            company: data.company || {},
            socialLinks: data.socialLinks || {},
          });
        } catch (e: any) {
          setErrorMessage(e.response?.data?.message || 'Failed to load portfolio.');
        } finally {
          setLoading(false);
        }
      };
      loadPortfolio();
    }
  }, [id, isEditMode]);

  const handleFullNameChange = (name: string) => {
    setFormData((prev) => {
      const updated = { ...prev, fullName: name };
      if (!isEditMode && (!prev.slug || prev.slug === '')) {
        updated.slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      }
      return updated;
    });
  };

  const checkSlugAvailability = async (slugToCheck: string) => {
    if (!slugToCheck || slugToCheck.length < 2) return;
    setSlugStatus({ checking: true });
    try {
      const res = await adminApi.checkSlug(slugToCheck, id);
      setSlugStatus({
        checking: false,
        available: res.available,
        message: res.available ? 'Slug is available!' : res.reason || 'This slug is already in use.',
      });
    } catch {
      setSlugStatus({ checking: false });
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, targetField: 'profilePhoto' | 'coverImage' | 'resumeUrl') => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const res = await adminApi.uploadFile(file);
      setFormData((prev) => ({ ...prev, [targetField]: res.url }));
      setSuccessMessage(`File uploaded: ${file.name}`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Upload failed.');
    }
  };

  const handleAddSkill = () => {
    if (!newSkill.name.trim()) return;
    setFormData((prev) => ({
      ...prev,
      skills: [...(prev.skills || []), { ...newSkill }],
    }));
    setNewSkill({ name: '', category: newSkill.category, proficiencyLabel: 'Advanced' });
  };

  const handleRemoveSkill = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      skills: (prev.skills || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleAddExperience = () => {
    const newExp: IExperience = {
      jobTitle: '',
      company: 'FOCUS Engineering',
      startDate: '2023',
      isCurrent: true,
      description: '',
      responsibilities: [],
    };
    setFormData((prev) => ({
      ...prev,
      experience: [...(prev.experience || []), newExp],
    }));
  };

  const handleRemoveExperience = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      experience: (prev.experience || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleAddEducation = () => {
    const newEdu: IEducation = {
      institution: '',
      qualification: 'Bachelor of Science (B.S.)',
      fieldOfStudy: '',
      startDate: '2016',
      endDate: '2020',
    };
    setFormData((prev) => ({
      ...prev,
      education: [...(prev.education || []), newEdu],
    }));
  };

  const handleRemoveEducation = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      education: (prev.education || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleAddProject = () => {
    const newProj: IProject = {
      title: '',
      description: '',
      technologies: [],
      isFeatured: true,
    };
    setFormData((prev) => ({
      ...prev,
      projects: [...(prev.projects || []), newProj],
    }));
  };

  const handleRemoveProject = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      projects: (prev.projects || []).filter((_, idx) => idx !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      if (isEditMode && id) {
        await adminApi.updatePortfolio(id, formData);
        setSuccessMessage('Portfolio successfully updated!');
      } else {
        const created = await adminApi.createPortfolio(formData);
        setSuccessMessage('Portfolio successfully created!');
        setTimeout(() => navigate(`/admin`), 1200);
      }
    } catch (err: any) {
      setErrorMessage(
        err.response?.data?.message || 'Failed to save portfolio. Please check that all required fields are filled out.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-corporate-secBg flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-corporate-navy animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-corporate-secBg flex flex-col pb-20">
      <DynamicMeta title={isEditMode ? `Edit Portfolio — ${formData.fullName}` : 'Create New Portfolio'} />

      {/* Header bar */}
      <header className="bg-white border-b border-corporate-border sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-auto sm:h-16 py-2 sm:py-0 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
            <Link
              to="/admin"
              className="p-2 rounded-lg text-corporate-mutedText hover:text-corporate-navy hover:bg-slate-100 transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div className="min-w-0 flex-1">
              <h1 className="text-sm sm:text-base lg:text-lg font-extrabold text-corporate-deep truncate">
                {isEditMode ? `Edit Portfolio: ${formData.fullName}` : 'Create Professional Portfolio'}
              </h1>
              <p className="text-[10px] sm:text-xs text-corporate-mutedText font-mono truncate">
                /{formData.slug || 'slug-preview'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-2 sm:space-x-3 flex-shrink-0">
            {formData.slug && (
              <Link
                to={`/${formData.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg border border-corporate-border text-xs font-semibold text-corporate-navy hover:bg-slate-50"
              >
                <span>Preview Public</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            )}

            <button
              onClick={handleSubmit}
              disabled={saving}
              className="inline-flex items-center justify-center space-x-2 px-4 sm:px-5 py-2 rounded-xl bg-corporate-navy text-white text-xs sm:text-sm font-bold hover:bg-corporate-deep transition-all shadow-subtle disabled:opacity-50 whitespace-nowrap"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 flex-shrink-0" />
                  <span className="hidden sm:inline">Save Portfolio</span>
                  <span className="sm:hidden">Save</span>
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-3 sm:px-6 lg:px-8 pt-6 sm:pt-8 flex-1 w-full space-y-6">
        {/* Feedback alerts */}
        {errorMessage && (
          <div className="p-3 sm:p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs sm:text-sm flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="break-words min-w-0">{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="p-3 sm:p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-start space-x-3">
            <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <span className="break-words min-w-0">{successMessage}</span>
          </div>
        )}

        {/* Builder Navigation Tabs */}
        <div className="flex overflow-x-auto space-x-1 bg-white p-1.5 rounded-2xl border border-corporate-border shadow-subtle scrollbar-thin">
          {[
            { id: 'basic', label: '1. Basic & Personal', icon: User },
            { id: 'company', label: '2. Company & Media', icon: Building },
            { id: 'skills', label: '3. Skills Matrix', icon: Layers },
            { id: 'experience', label: '4. Experience & Edu', icon: Briefcase },
            { id: 'projects', label: '5. Projects Showcase', icon: FileText },
            { id: 'settings', label: '6. Template & Publish', icon: Sliders },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 ${isActive
                  ? 'bg-corporate-navy text-white shadow-subtle'
                  : 'text-corporate-mutedText hover:text-corporate-text hover:bg-slate-100'
                  }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab 1: Basic & Personal Information */}
        {activeTab === 'basic' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-corporate-border shadow-subtle space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-corporate-navy">Personal & Professional Identity</h2>
              <p className="text-xs text-corporate-mutedText">Basic credentials, title, role category, and introduction.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="min-w-0">
                <label className="block text-xs font-bold text-corporate-text uppercase tracking-wider mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => handleFullNameChange(e.target.value)}
                  placeholder="e.g. Manoj Kumar"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-corporate-border text-sm outline-none focus:ring-2 focus:ring-corporate-blue"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-bold text-corporate-text uppercase tracking-wider mb-1">
                  Unique URL Slug *
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-mono">/</span>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => {
                      const clean = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
                      setFormData({ ...formData, slug: clean });
                    }}
                    onBlur={(e) => checkSlugAvailability(e.target.value)}
                    placeholder="manoj"
                    className="w-full pl-8 pr-4 py-2.5 rounded-lg border border-corporate-border font-mono text-sm outline-none focus:ring-2 focus:ring-corporate-blue"
                  />
                </div>
                {slugStatus.message && (
                  <p
                    className={`text-[11px] mt-1 font-semibold break-words ${slugStatus.available ? 'text-emerald-600' : 'text-red-500'
                      }`}
                  >
                    {slugStatus.message}
                  </p>
                )}
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-bold text-corporate-text uppercase tracking-wider mb-1">
                  Professional Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.professionalTitle}
                  onChange={(e) => setFormData({ ...formData, professionalTitle: e.target.value })}
                  placeholder="e.g. Principal Engineering Lead"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-corporate-border text-sm outline-none focus:ring-2 focus:ring-corporate-blue"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-bold text-corporate-text uppercase tracking-wider mb-1">
                  Professional Role Category *
                </label>
                <select
                  value={formData.professionalRole}
                  onChange={(e) => setFormData({ ...formData, professionalRole: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-corporate-border text-sm outline-none focus:ring-2 focus:ring-corporate-blue"
                >
                  <option value="Engineering Leadership">Engineering Leadership</option>
                  <option value="Mobile & Full Stack Development">Mobile & Full Stack Development</option>
                  <option value="UI/UX & Product Design">UI/UX & Product Design</option>
                  <option value="Cloud Architecture & DevOps">Cloud Architecture & DevOps</option>
                  <option value="Quality Inspection & Reliability">Quality Inspection & Reliability</option>
                  <option value="Data & Machine Learning">Data & Machine Learning</option>
                </select>
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-bold text-corporate-text uppercase tracking-wider mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="manoj@focusengineering.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-corporate-border text-sm outline-none focus:ring-2 focus:ring-corporate-blue"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-bold text-corporate-text uppercase tracking-wider mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+1 (555) 019-2831"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-corporate-border text-sm outline-none focus:ring-2 focus:ring-corporate-blue"
                />
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-bold text-corporate-text uppercase tracking-wider mb-1">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={formData.whatsapp || ''}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-corporate-border text-sm outline-none focus:ring-2 focus:ring-corporate-blue"
                />
                <p className="text-[11px] text-corporate-mutedText mt-1 break-words">
                  Include country code. Used for the "Chat on WhatsApp" button.
                </p>
              </div>

              <div className="min-w-0">
                <label className="block text-xs font-bold text-corporate-text uppercase tracking-wider mb-1">
                  Location / Office
                </label>
                <input
                  type="text"
                  value={formData.location || ''}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Chicago, IL & Hybrid"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-corporate-border text-sm outline-none focus:ring-2 focus:ring-corporate-blue"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-corporate-text uppercase tracking-wider mb-1">
                Short Elevator Introduction * (approx 1-2 sentences)
              </label>
              <textarea
                required
                rows={2}
                value={formData.shortIntro}
                onChange={(e) => setFormData({ ...formData, shortIntro: e.target.value })}
                placeholder="Over 14 years architecting resilient industrial software platforms and leading high-performing engineering teams..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-corporate-border text-sm outline-none focus:ring-2 focus:ring-corporate-blue"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-corporate-text uppercase tracking-wider mb-1">
                Full Executive Biography (Long form)
              </label>
              <textarea
                rows={4}
                value={formData.bio || ''}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Comprehensive professional biography detailing past achievements, strategic vision, technical philosophy..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-corporate-border text-sm outline-none focus:ring-2 focus:ring-corporate-blue"
              />
            </div>
          </div>
        )}

        {/* Tab 2: Company & Media */}
        {activeTab === 'company' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-corporate-border shadow-subtle space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-corporate-navy">Company Details & Media Assets</h2>
              <p className="text-xs text-corporate-mutedText">Profile photo, cover banner, company info, and resume file.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3 min-w-0">
                <label className="block text-xs font-bold text-corporate-text uppercase tracking-wider">
                  Profile Photo URL
                </label>
                <input
                  type="text"
                  value={formData.profilePhoto || ''}
                  onChange={(e) => setFormData({ ...formData, profilePhoto: e.target.value })}
                  placeholder="https://... or upload below"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-corporate-border text-sm"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-corporate-secBg hover:bg-slate-200 text-xs font-semibold text-corporate-navy">
                    <Upload className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Upload Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'profilePhoto')}
                      className="hidden"
                    />
                  </label>
                  {formData.profilePhoto && (
                    <span className="text-[11px] text-emerald-600 font-semibold">Photo Attached</span>
                  )}
                </div>
              </div>

              <div className="space-y-3 min-w-0">
                <label className="block text-xs font-bold text-corporate-text uppercase tracking-wider">
                  Cover Banner URL
                </label>
                <input
                  type="text"
                  value={formData.coverImage || ''}
                  onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                  placeholder="https://... or upload below"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-corporate-border text-sm"
                />
                <div className="flex flex-wrap items-center gap-2">
                  <label className="cursor-pointer inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-corporate-secBg hover:bg-slate-200 text-xs font-semibold text-corporate-navy">
                    <Upload className="w-3.5 h-3.5 flex-shrink-0" />
                    <span>Upload Cover Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, 'coverImage')}
                      className="hidden"
                    />
                  </label>
                  {formData.coverImage && (
                    <span className="text-[11px] text-emerald-600 font-semibold">Cover Attached</span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-corporate-navy mb-4 uppercase tracking-wider">
                Corporate Affiliation
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-corporate-mutedText mb-1">Company Name</label>
                  <input
                    type="text"
                    value={formData.company?.companyName || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, companyName: e.target.value },
                      })
                    }
                    placeholder="FOCUS Engineering"
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                  />
                </div>

                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-corporate-mutedText mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.company?.department || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, department: e.target.value },
                      })
                    }
                    placeholder="Platform Architecture"
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                  />
                </div>

                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-corporate-mutedText mb-1">Company Website</label>
                  <input
                    type="text"
                    value={formData.company?.companyWebsite || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        company: { ...formData.company, companyWebsite: e.target.value },
                      })
                    }
                    placeholder="https://focusengineeringapp.com"
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                  />
                </div>

                <div className="min-w-0">
                  <label className="block text-xs font-semibold text-corporate-mutedText mb-1">Resume / CV URL</label>
                  <input
                    type="text"
                    value={formData.resumeUrl || ''}
                    onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                    placeholder="https://... or upload PDF"
                    className="w-full px-3 py-2 rounded-lg border text-sm"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Skills Matrix */}
        {activeTab === 'skills' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-corporate-border shadow-subtle space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-corporate-navy">Technical Skills & Categories</h2>
              <p className="text-xs text-corporate-mutedText">
                Add skills with category grouping and optional proficiency indicators.
              </p>
            </div>

            {/* Add Skill Row */}
            <div className="p-4 bg-corporate-secBg rounded-xl border border-corporate-border flex flex-col sm:flex-row flex-wrap gap-3 sm:items-end">
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <label className="block text-xs font-semibold text-corporate-mutedText mb-1">Skill Name</label>
                <input
                  type="text"
                  value={newSkill.name}
                  onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                  placeholder="e.g. Flutter & Dart"
                  className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
                />
              </div>

              <div className="w-full sm:w-48">
                <label className="block text-xs font-semibold text-corporate-mutedText mb-1">Category</label>
                <input
                  type="text"
                  value={newSkill.category}
                  onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value })}
                  placeholder="e.g. Mobile"
                  className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
                />
              </div>

              <div className="w-full sm:w-36">
                <label className="block text-xs font-semibold text-corporate-mutedText mb-1">Proficiency</label>
                <select
                  value={newSkill.proficiencyLabel || 'Advanced'}
                  onChange={(e) => setNewSkill({ ...newSkill, proficiencyLabel: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
                >
                  <option value="Specialist">Specialist</option>
                  <option value="Expert">Expert</option>
                  <option value="Advanced">Advanced</option>
                  <option value="Proficient">Proficient</option>
                  <option value="Mastery">Mastery</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-lg bg-corporate-navy text-white text-xs font-bold hover:bg-corporate-deep flex items-center justify-center space-x-1 w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span>Add Skill</span>
              </button>
            </div>

            {/* Skill list chips */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Current Skills</h3>
              <div className="flex flex-wrap gap-2">
                {formData.skills?.map((skill, idx) => (
                  <div
                    key={idx}
                    className="inline-flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-white border border-corporate-border text-xs font-semibold text-corporate-text shadow-subtle max-w-full"
                  >
                    <span className="break-words min-w-0">{skill.name}</span>
                    <span className="text-[10px] text-corporate-blue font-bold px-1 rounded bg-corporate-secBg flex-shrink-0">
                      {skill.category}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(idx)}
                      className="text-slate-400 hover:text-red-500 flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Experience & Education */}
        {activeTab === 'experience' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-corporate-border shadow-subtle space-y-8">
            {/* Experience Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-corporate-navy">Professional Experience</h2>
                  <p className="text-xs text-corporate-mutedText">Work history, roles, companies, and responsibilities.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddExperience}
                  className="px-3.5 py-1.5 rounded-lg bg-corporate-secBg text-corporate-navy border border-slate-200 text-xs font-bold hover:bg-slate-200 flex items-center justify-center space-x-1 w-full sm:w-auto flex-shrink-0"
                >
                  <Plus className="w-4 h-4 flex-shrink-0" />
                  <span>Add Role</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.experience?.map((exp, idx) => (
                  <div key={idx} className="p-3 sm:p-4 rounded-xl border border-corporate-border bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold uppercase text-corporate-blue tracking-wider">Role #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveExperience(idx)}
                        className="text-slate-400 hover:text-red-500 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Job Title *"
                        value={exp.jobTitle}
                        onChange={(e) => {
                          const updated = [...(formData.experience || [])];
                          updated[idx].jobTitle = e.target.value;
                          setFormData({ ...formData, experience: updated });
                        }}
                        className="px-3 py-2 rounded-lg border text-sm bg-white min-w-0"
                      />
                      <input
                        type="text"
                        placeholder="Company Name *"
                        value={exp.company}
                        onChange={(e) => {
                          const updated = [...(formData.experience || [])];
                          updated[idx].company = e.target.value;
                          setFormData({ ...formData, experience: updated });
                        }}
                        className="px-3 py-2 rounded-lg border text-sm bg-white min-w-0"
                      />
                      <input
                        type="text"
                        placeholder="Start Date (e.g. 2021-06)"
                        value={exp.startDate}
                        onChange={(e) => {
                          const updated = [...(formData.experience || [])];
                          updated[idx].startDate = e.target.value;
                          setFormData({ ...formData, experience: updated });
                        }}
                        className="px-3 py-2 rounded-lg border text-sm bg-white min-w-0"
                      />
                      <div className="flex flex-wrap items-center gap-2">
                        <input
                          type="text"
                          placeholder="End Date"
                          disabled={exp.isCurrent}
                          value={exp.isCurrent ? 'Present' : exp.endDate || ''}
                          onChange={(e) => {
                            const updated = [...(formData.experience || [])];
                            updated[idx].endDate = e.target.value;
                            setFormData({ ...formData, experience: updated });
                          }}
                          className="flex-1 min-w-0 px-3 py-2 rounded-lg border text-sm bg-white disabled:bg-slate-100"
                        />
                        <label className="flex items-center space-x-1 text-xs font-semibold text-slate-600 flex-shrink-0">
                          <input
                            type="checkbox"
                            checked={exp.isCurrent}
                            onChange={(e) => {
                              const updated = [...(formData.experience || [])];
                              updated[idx].isCurrent = e.target.checked;
                              setFormData({ ...formData, experience: updated });
                            }}
                          />
                          <span>Current</span>
                        </label>
                      </div>
                    </div>

                    <textarea
                      rows={2}
                      placeholder="Role summary / impact..."
                      value={exp.description || ''}
                      onChange={(e) => {
                        const updated = [...(formData.experience || [])];
                        updated[idx].description = e.target.value;
                        setFormData({ ...formData, experience: updated });
                      }}
                      className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Education Section */}
            <div className="space-y-4 pt-6 border-t border-slate-100">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
                <div className="min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-corporate-navy">Education & Degrees</h2>
                  <p className="text-xs text-corporate-mutedText">Academic qualifications and certifications.</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddEducation}
                  className="px-3.5 py-1.5 rounded-lg bg-corporate-secBg text-corporate-navy border border-slate-200 text-xs font-bold hover:bg-slate-200 flex items-center justify-center space-x-1 w-full sm:w-auto flex-shrink-0"
                >
                  <Plus className="w-4 h-4 flex-shrink-0" />
                  <span>Add Degree</span>
                </button>
              </div>

              <div className="space-y-4">
                {formData.education?.map((edu, idx) => (
                  <div key={idx} className="p-3 sm:p-4 rounded-xl border border-corporate-border bg-slate-50/50 space-y-3">
                    <div className="flex justify-between items-start gap-2">
                      <span className="text-xs font-bold uppercase text-corporate-blue tracking-wider">Degree #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveEducation(idx)}
                        className="text-slate-400 hover:text-red-500 flex-shrink-0"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="Institution *"
                        value={edu.institution}
                        onChange={(e) => {
                          const updated = [...(formData.education || [])];
                          updated[idx].institution = e.target.value;
                          setFormData({ ...formData, education: updated });
                        }}
                        className="px-3 py-2 rounded-lg border text-sm bg-white min-w-0"
                      />
                      <input
                        type="text"
                        placeholder="Qualification (e.g. Master of Science) *"
                        value={edu.qualification}
                        onChange={(e) => {
                          const updated = [...(formData.education || [])];
                          updated[idx].qualification = e.target.value;
                          setFormData({ ...formData, education: updated });
                        }}
                        className="px-3 py-2 rounded-lg border text-sm bg-white min-w-0"
                      />
                      <input
                        type="text"
                        placeholder="Field of Study"
                        value={edu.fieldOfStudy || ''}
                        onChange={(e) => {
                          const updated = [...(formData.education || [])];
                          updated[idx].fieldOfStudy = e.target.value;
                          setFormData({ ...formData, education: updated });
                        }}
                        className="px-3 py-2 rounded-lg border text-sm bg-white min-w-0"
                      />
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Start Year"
                          value={edu.startDate}
                          onChange={(e) => {
                            const updated = [...(formData.education || [])];
                            updated[idx].startDate = e.target.value;
                            setFormData({ ...formData, education: updated });
                          }}
                          className="w-1/2 min-w-0 px-3 py-2 rounded-lg border text-sm bg-white"
                        />
                        <input
                          type="text"
                          placeholder="End Year"
                          value={edu.endDate || ''}
                          onChange={(e) => {
                            const updated = [...(formData.education || [])];
                            updated[idx].endDate = e.target.value;
                            setFormData({ ...formData, education: updated });
                          }}
                          className="w-1/2 min-w-0 px-3 py-2 rounded-lg border text-sm bg-white"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Projects Showcase */}
        {activeTab === 'projects' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-corporate-border shadow-subtle space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
              <div className="min-w-0">
                <h2 className="text-base sm:text-lg font-bold text-corporate-navy">Projects & Deliverables</h2>
                <p className="text-xs text-corporate-mutedText">Feature technical milestones, apps, and open-source contributions.</p>
              </div>
              <button
                type="button"
                onClick={handleAddProject}
                className="px-3.5 py-1.5 rounded-lg bg-corporate-navy text-white text-xs font-bold hover:bg-corporate-deep flex items-center justify-center space-x-1 w-full sm:w-auto flex-shrink-0"
              >
                <Plus className="w-4 h-4 flex-shrink-0" />
                <span>Add Project</span>
              </button>
            </div>

            <div className="space-y-6">
              {formData.projects?.map((proj, idx) => (
                <div key={idx} className="p-3 sm:p-5 rounded-xl border border-corporate-border bg-slate-50/50 space-y-4">
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-xs font-bold uppercase text-corporate-blue tracking-wider">Project #{idx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveProject(idx)}
                      className="text-slate-400 hover:text-red-500 flex-shrink-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <input
                      type="text"
                      placeholder="Project Title *"
                      value={proj.title}
                      onChange={(e) => {
                        const updated = [...(formData.projects || [])];
                        updated[idx].title = e.target.value;
                        setFormData({ ...formData, projects: updated });
                      }}
                      className="px-3 py-2 rounded-lg border text-sm bg-white min-w-0"
                    />

                    <input
                      type="text"
                      placeholder="Cover Image URL"
                      value={proj.coverImage || ''}
                      onChange={(e) => {
                        const updated = [...(formData.projects || [])];
                        updated[idx].coverImage = e.target.value;
                        setFormData({ ...formData, projects: updated });
                      }}
                      className="px-3 py-2 rounded-lg border text-sm bg-white min-w-0"
                    />

                    <input
                      type="text"
                      placeholder="Project URL (Live Demo)"
                      value={proj.projectUrl || ''}
                      onChange={(e) => {
                        const updated = [...(formData.projects || [])];
                        updated[idx].projectUrl = e.target.value;
                        setFormData({ ...formData, projects: updated });
                      }}
                      className="px-3 py-2 rounded-lg border text-sm bg-white min-w-0 sm:col-span-2"
                    />
                  </div>

                  <textarea
                    rows={2}
                    placeholder="Project description and key technical outcomes *"
                    value={proj.description}
                    onChange={(e) => {
                      const updated = [...(formData.projects || [])];
                      updated[idx].description = e.target.value;
                      setFormData({ ...formData, projects: updated });
                    }}
                    className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
                  />

                  <div>
                    <label className="block text-xs font-semibold text-corporate-mutedText mb-1">
                      Technologies (comma separated)
                    </label>
                    <input
                      type="text"
                      placeholder="React, TypeScript, Express, MongoDB"
                      value={proj.technologies?.join(', ') || ''}
                      onChange={(e) => {
                        const updated = [...(formData.projects || [])];
                        updated[idx].technologies = e.target.value
                          .split(',')
                          .map((t) => t.trim())
                          .filter(Boolean);
                        setFormData({ ...formData, projects: updated });
                      }}
                      className="w-full px-3 py-2 rounded-lg border text-sm bg-white"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 6: Template & Settings */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-2xl p-4 sm:p-6 md:p-8 border border-corporate-border shadow-subtle space-y-6">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-corporate-navy">Template Selection & Publication Status</h2>
              <p className="text-xs text-corporate-mutedText">Configure presentation layout, directory visibility, and status.</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-corporate-text uppercase tracking-wider mb-3">
                Selected Portfolio Template
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => setFormData({ ...formData, selectedTemplate: 'classic-corporate' })}
                  className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.selectedTemplate === 'classic-corporate'
                    ? 'border-corporate-navy bg-corporate-secBg/80 shadow-subtle'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-corporate-navy text-sm break-words">Template A — Classic Corporate</span>
                    {formData.selectedTemplate === 'classic-corporate' && (
                      <CheckCircle className="w-5 h-5 text-corporate-navy flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-corporate-mutedText leading-relaxed break-words">
                    White backdrop, navy headings, structured timeline grids. Ideal for engineering directors, leads, and executives.
                  </p>
                </div>

                <div
                  onClick={() => setFormData({ ...formData, selectedTemplate: 'modern-professional' })}
                  className={`p-4 sm:p-5 rounded-2xl border-2 cursor-pointer transition-all ${formData.selectedTemplate === 'modern-professional'
                    ? 'border-corporate-blue bg-blue-50/50 shadow-subtle'
                    : 'border-slate-200 hover:border-slate-300'
                    }`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <span className="font-bold text-corporate-navy text-sm break-words">Template B — Modern Professional</span>
                    {formData.selectedTemplate === 'modern-professional' && (
                      <CheckCircle className="w-5 h-5 text-corporate-blue flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-corporate-mutedText leading-relaxed break-words">
                    Deep navy expressive hero, refined blue accents, modern project cards. Ideal for mobile and full-stack developers.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="min-w-0">
                <label className="block text-xs font-bold text-corporate-text uppercase tracking-wider mb-2">
                  Publication Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as PortfolioStatus })}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-corporate-border text-sm outline-none focus:ring-2 focus:ring-corporate-blue"
                >
                  <option value="published">Published (Publicly Accessible)</option>
                  <option value="draft">Draft (Private WIP)</option>
                  <option value="disabled">Disabled (Temporarily Offline)</option>
                </select>
              </div>

              <div className="space-y-3 pt-2 sm:pt-6">
                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showInDirectory}
                    onChange={(e) => setFormData({ ...formData, showInDirectory: e.target.checked })}
                    className="w-4 h-4 text-corporate-blue rounded mt-0.5 flex-shrink-0"
                  />
                  <span className="text-xs font-semibold text-corporate-text break-words min-w-0">
                    Display profile in public engineering talent directory
                  </span>
                </label>

                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 text-corporate-blue rounded mt-0.5 flex-shrink-0"
                  />
                  <span className="text-xs font-semibold text-corporate-text break-words min-w-0">
                    Feature on main landing page spotlight
                  </span>
                </label>

                <label className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.contactEnabled}
                    onChange={(e) => setFormData({ ...formData, contactEnabled: e.target.checked })}
                    className="w-4 h-4 text-corporate-blue rounded mt-0.5 flex-shrink-0"
                  />
                  <span className="text-xs font-semibold text-corporate-text break-words min-w-0">
                    Enable direct contact & inquiry form
                  </span>
                </label>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-corporate-text uppercase tracking-wider mb-3">
                Professional Social Links
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                <input
                  type="text"
                  placeholder="LinkedIn URL (https://linkedin.com/in/...)"
                  value={formData.socialLinks?.linkedin || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, linkedin: e.target.value },
                    })
                  }
                  className="px-3 py-2 rounded-lg border text-sm min-w-0"
                />

                <input
                  type="text"
                  placeholder="Twitter / X URL (https://twitter.com/...)"
                  value={formData.socialLinks?.twitter || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, twitter: e.target.value },
                    })
                  }
                  className="px-3 py-2 rounded-lg border text-sm min-w-0"
                />
                <input
                  type="text"
                  placeholder="Personal Website URL (https://...)"
                  value={formData.socialLinks?.website || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialLinks: { ...formData.socialLinks, website: e.target.value },
                    })
                  }
                  className="px-3 py-2 rounded-lg border text-sm min-w-0 sm:col-span-2"
                />
              </div>
            </div>
          </div>
        )}

        {/* Bottom Save Action Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center sm:justify-between gap-3 bg-white p-4 rounded-2xl border border-corporate-border shadow-subtle">
          <Link
            to="/admin"
            className="px-4 py-2 rounded-lg border border-corporate-border text-xs font-semibold text-corporate-mutedText hover:text-corporate-navy hover:bg-slate-50 text-center"
          >
            Cancel & Return
          </Link>

          <button
            onClick={handleSubmit}
            disabled={saving}
            className="inline-flex items-center justify-center space-x-2 px-6 py-2.5 rounded-xl bg-corporate-navy text-white text-xs sm:text-sm font-bold hover:bg-corporate-deep transition-all shadow-subtle disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
                <span>Saving Portfolio...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4 flex-shrink-0" />
                <span>{isEditMode ? 'Save Portfolio Changes' : 'Publish New Portfolio'}</span>
              </>
            )}
          </button>
        </div>
      </main>
    </div>
  );
};