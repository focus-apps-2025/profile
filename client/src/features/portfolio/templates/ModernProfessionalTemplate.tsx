import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Code,
  Terminal,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Sparkles,
  Download,
  Smartphone,
  Monitor,
  Palette,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Building,
  Layers
} from 'lucide-react';
import { IPortfolio } from '../../../types';
import { ContactSection } from '../components/ContactSection';

export const ModernProfessionalTemplate: React.FC<{ portfolio: IPortfolio }> = ({ portfolio }) => {
  const [selectedSkillCategory, setSelectedSkillCategory] = useState<string>('all');

  const skillsByCategory = portfolio.skills.reduce((acc, skill) => {
    const cat = skill.category || 'Core Competencies';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, typeof portfolio.skills>);

  const categories = Array.from(
    new Set(portfolio.skills.map((s) => s.category || 'General'))
  );

  const filteredSkills =
    selectedSkillCategory === 'all'
      ? portfolio.skills
      : portfolio.skills.filter((s) => s.category === selectedSkillCategory);

  const renderServiceIcon = (iconName?: string) => {
    switch (iconName?.toLowerCase()) {
      case 'smartphone':
        return <Smartphone className="w-6 h-6 text-corporate-blue" />;
      case 'monitor':
        return <Monitor className="w-6 h-6 text-corporate-blue" />;
      case 'palette':
        return <Palette className="w-6 h-6 text-corporate-blue" />;
      case 'shieldcheck':
        return <ShieldCheck className="w-6 h-6 text-corporate-blue" />;
      default:
        return <Code className="w-6 h-6 text-corporate-blue" />;
    }
  };

  return (
    <div className="bg-corporate-secBg text-corporate-text min-h-screen">
      {/* Modern Expressive Hero */}
      <section className="relative bg-corporate-deep text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-corporate-blue/20 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-corporate-navy/30 blur-2xl pointer-events-none" />

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Hero Text */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-1 px-3 py-1.5 rounded-full bg-corporate-navy border border-slate-700 text-xs font-semibold text-corporate-lightBlue max-w-full"
              >
                <Sparkles className="w-3.5 h-3.5 text-corporate-lightBlue flex-shrink-0" />
                <span className="truncate">{portfolio.professionalRole}</span>
                {portfolio.company?.companyName && (
                  <>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300 truncate">{portfolio.company.companyName}</span>
                  </>
                )}
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight break-words"
              >
                {portfolio.fullName}
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-xl sm:text-2xl font-medium text-corporate-lightBlue break-words"
              >
                {portfolio.professionalTitle}
              </motion.p>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto lg:mx-0 break-words"
              >
                {portfolio.shortIntro}
              </motion.p>

              {/* Location & Quick Meta */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-x-4 gap-y-2 text-xs text-slate-400">
                {portfolio.location && (
                  <div className="flex items-center space-x-1.5 max-w-full">
                    <MapPin className="w-4 h-4 text-corporate-blue flex-shrink-0" />
                    <span className="break-words">{portfolio.location}</span>
                  </div>
                )}
                {portfolio.company?.department && (
                  <div className="flex items-center space-x-1.5 max-w-full">
                    <Building className="w-4 h-4 text-corporate-blue flex-shrink-0" />
                    <span className="break-words">{portfolio.company.department}</span>
                  </div>
                )}
              </div>

              {/* Hero CTA buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-2"
              >
                {portfolio.contactEnabled && (
                  <a
                    href="#contact"
                    className="px-6 py-3 rounded-xl bg-corporate-blue text-white font-semibold text-sm hover:bg-blue-600 transition-all shadow-subtle hover:shadow-card text-center"
                  >
                    Initiate Contact
                  </a>
                )}

                {portfolio.resumeUrl && portfolio.resumeUrl !== '#' && (
                  <a
                    href={portfolio.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center space-x-2 px-5 py-3 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm hover:bg-slate-700 transition-colors"
                  >
                    <Download className="w-4 h-4 text-corporate-lightBlue flex-shrink-0" />
                    <span>Download Resume</span>
                  </a>
                )}

                {/* Social icons */}
                <div className="flex items-center justify-center space-x-2 sm:pl-2">
                  {portfolio.socialLinks?.linkedin && (
                    <a
                      href={portfolio.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}

                  {portfolio.socialLinks?.website && (
                    <a
                      href={portfolio.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-slate-800/80 text-slate-300 hover:text-white hover:bg-slate-700 transition-all"
                      title="Website"
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Right Column: Hero Visual Avatar */}
            <div className="lg:col-span-5 flex justify-center">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                className="relative"
              >
                <div className="w-64 h-64 sm:w-72 sm:h-72 rounded-3xl overflow-hidden border-4 border-corporate-navy/80 shadow-elevated bg-slate-800">
                  {portfolio.profilePhoto ? (
                    <img
                      src={portfolio.profilePhoto}
                      alt={portfolio.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-6xl text-slate-400">
                      {portfolio.fullName.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="absolute -bottom-4 -left-2 sm:-left-4 bg-white text-corporate-text p-3 rounded-2xl shadow-premium border border-corporate-border flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-xl bg-corporate-lightBlue flex items-center justify-center text-corporate-navy flex-shrink-0">
                    <Terminal className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] uppercase font-bold text-corporate-mutedText tracking-wider">Focus Tech</p>
                    <p className="text-xs font-bold text-corporate-navy whitespace-nowrap">Senior Engineering</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Section: Biography */}
        {portfolio.bio && (
          <section id="about" className="bg-white rounded-2xl p-6 sm:p-8 border border-corporate-border shadow-subtle">
            <h2 className="text-xs font-bold uppercase tracking-wider text-corporate-blue mb-2">Professional Background</h2>
            <h3 className="text-xl sm:text-2xl font-extrabold text-corporate-navy mb-4 break-words">
              About {portfolio.fullName}
            </h3>
            <p className="text-corporate-text leading-relaxed text-base sm:text-lg whitespace-pre-line break-words">
              {portfolio.bio}
            </p>
          </section>
        )}

        {/* Section: Professional Capabilities & Services */}
        {portfolio.services && portfolio.services.length > 0 && (
          <section id="services" className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-corporate-blue">Specializations</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-corporate-navy mt-1 break-words">
                Engineering Capabilities & Services
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {portfolio.services.map((service, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-6 border border-corporate-border shadow-subtle hover:shadow-card hover:border-corporate-blue/50 transition-all group"
                >
                  <div className="w-12 h-12 rounded-xl bg-corporate-secBg group-hover:bg-corporate-lightBlue flex items-center justify-center mb-4 transition-colors">
                    {renderServiceIcon(service.icon)}
                  </div>
                  <h3 className="text-lg font-bold text-corporate-navy mb-2 break-words">{service.title}</h3>
                  <p className="text-sm text-corporate-mutedText leading-relaxed break-words">{service.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Modern Projects Showcase */}
        {portfolio.projects && portfolio.projects.length > 0 && (
          <section id="projects" className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-corporate-blue">Portfolio Work</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-corporate-navy mt-1 break-words">
                  Featured Projects & Deliverables
                </h2>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {portfolio.projects.map((project, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-2xl border border-corporate-border shadow-subtle overflow-hidden flex flex-col group hover:shadow-premium hover:border-corporate-blue/40"
                >
                  {project.coverImage ? (
                    <div className="h-48 sm:h-56 w-full overflow-hidden bg-slate-900 relative">
                      <img
                        src={project.coverImage}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 to-transparent" />
                      {project.role && (
                        <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur text-corporate-navy px-2.5 py-1 rounded text-xs font-semibold max-w-[calc(100%-1.5rem)] truncate">
                          {project.role}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="h-24 sm:h-28 bg-gradient-to-r from-corporate-deep to-corporate-navy p-4 flex items-end">
                      {project.role && (
                        <span className="bg-white/20 text-white text-xs font-semibold px-2 py-0.5 rounded truncate max-w-full">
                          {project.role}
                        </span>
                      )}
                    </div>
                  )}

                  <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex flex-wrap items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg sm:text-xl font-bold text-corporate-navy group-hover:text-corporate-blue transition-colors flex-1 min-w-0 break-words">
                          {project.title}
                        </h3>
                        {project.isFeatured && (
                          <span className="badge-corporate text-[10px] flex-shrink-0">Featured</span>
                        )}
                      </div>
                      <p className="text-sm text-corporate-mutedText leading-relaxed mb-6 break-words">
                        {project.description}
                      </p>
                    </div>

                    <div>
                      {project.technologies && project.technologies.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-6">
                          {project.technologies.map((t, tIdx) => (
                            <span
                              key={tIdx}
                              className="px-2.5 py-1 rounded-md text-xs font-medium bg-corporate-secBg text-corporate-navy border border-slate-200 break-words"
                            >
                              {t}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3 border-t border-slate-100 text-xs font-bold text-corporate-blue">
                        {project.projectUrl && (
                          <a
                            href={project.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center space-x-1 hover:underline"
                          >
                            <span>Live Product</span>
                            <ExternalLink className="w-3.5 h-3.5 flex-shrink-0" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Skills & Technical Expertise */}
        {portfolio.skills && portfolio.skills.length > 0 && (
          <section id="skills" className="space-y-6">
            <div className="flex items-center space-x-3 border-b border-corporate-border pb-3">
              <Layers className="w-5 h-5 text-corporate-blue flex-shrink-0" />
              <h2 className="text-xl sm:text-2xl font-bold text-corporate-navy tracking-tight break-words">
                Core Competencies & Expertise
              </h2>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {Object.entries(skillsByCategory).map(([category, items]) => (
                <div
                  key={category}
                  className="p-4 sm:p-6 rounded-xl border border-corporate-border bg-white shadow-subtle hover:border-corporate-blue/40 transition-colors min-w-0"
                >
                  <h3 className="text-sm font-bold text-corporate-navy uppercase tracking-wider mb-4 border-b border-slate-100 pb-2 break-words">
                    {category}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {items.map((skill, idx) => (
                      <div
                        key={idx}
                        className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2 px-3 py-2.5 rounded-md bg-corporate-secBg border border-slate-200 text-xs font-semibold text-corporate-text min-w-0"
                      >
                        <span className="break-words leading-tight flex-1 min-w-0">{skill.name}</span>
                        {skill.proficiencyLabel && (
                          <span className="text-[10px] text-corporate-blue font-bold px-1.5 py-0.5 rounded bg-white border border-corporate-lightBlue whitespace-nowrap flex-shrink-0">
                            {skill.proficiencyLabel}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Work Experience */}
        {portfolio.experience && portfolio.experience.length > 0 && (
          <section id="experience" className="space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-corporate-blue">Career History</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-corporate-navy mt-1 break-words">
                Experience & Impact
              </h2>
            </div>

            <div className="space-y-4">
              {portfolio.experience.map((exp, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-2xl p-5 sm:p-6 md:p-8 border border-corporate-border shadow-subtle"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-4">
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg sm:text-xl font-bold text-corporate-navy break-words">{exp.jobTitle}</h3>
                      <p className="text-sm font-semibold text-corporate-blue break-words">
                        {exp.company} • {exp.employmentType || 'Full-time'}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-corporate-mutedText bg-corporate-secBg px-3 py-1 rounded-full w-fit self-start whitespace-nowrap flex-shrink-0">
                      {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'N/A'}
                    </span>
                  </div>

                  {exp.description && (
                    <p className="mt-3 text-sm text-corporate-text leading-relaxed break-words">
                      {exp.description}
                    </p>
                  )}

                  {exp.responsibilities && exp.responsibilities.length > 0 && (
                    <ul className="mt-4 space-y-2">
                      {exp.responsibilities.map((resp, rIdx) => (
                        <li key={rIdx} className="text-xs sm:text-sm text-slate-600 flex items-start space-x-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                          <span className="break-words min-w-0">{resp}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Direct Contact Form (Dark Modern Variant) */}
        {portfolio.contactEnabled && (
          <ContactSection
            portfolioSlug={portfolio.slug}
            fullName={portfolio.fullName}
            email={portfolio.email}
            phone={portfolio.phone}
            whatsapp={portfolio.whatsapp}
            location={portfolio.location}
            darkVariant={true}
          />
        )}
      </div>
    </div>
  );
};