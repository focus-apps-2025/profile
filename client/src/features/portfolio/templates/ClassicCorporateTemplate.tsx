import React from 'react';
import { motion } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Award,
  Layers,
  MapPin,
  ExternalLink,
  Github,
  Linkedin,
  Twitter,
  Globe,
  Download,
  Calendar,
  Building,
  CheckCircle,
  FileText
} from 'lucide-react';
import { IPortfolio } from '../../../types';
import { ContactSection } from '../components/ContactSection';

export const ClassicCorporateTemplate: React.FC<{ portfolio: IPortfolio }> = ({ portfolio }) => {
  // Group skills by category
  const skillsByCategory = portfolio.skills.reduce((acc, skill) => {
    const cat = skill.category || 'Core Competencies';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(skill);
    return acc;
  }, {} as Record<string, typeof portfolio.skills>);

  return (
    <div className="bg-white text-corporate-text min-h-screen">
      {/* Cover / Header Banner */}
      <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-corporate-deep">
        {portfolio.coverImage ? (
          <img
            src={portfolio.coverImage}
            alt="Cover Header"
            className="w-full h-full object-cover opacity-60"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-corporate-deep via-corporate-navy to-[#1a4a98] opacity-90" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-transparent to-transparent" />
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-28 relative z-10 pb-20">
        {/* Profile Card Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl border border-corporate-border p-6 sm:p-10 shadow-premium"
        >
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            {/* Profile Avatar */}
            <div className="relative">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden border-4 border-white shadow-elevated bg-slate-100 flex-shrink-0">
                {portfolio.profilePhoto ? (
                  <img
                    src={portfolio.profilePhoto}
                    alt={portfolio.fullName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-corporate-navy text-white flex items-center justify-center font-bold text-4xl">
                    {portfolio.fullName.charAt(0)}
                  </div>
                )}
              </div>
              {portfolio.isFeatured && (
                <div className="absolute -bottom-2 -right-2 bg-corporate-blue text-white p-1.5 rounded-full shadow-subtle" title="Featured Profile">
                  <CheckCircle className="w-5 h-5" />
                </div>
              )}
            </div>

            {/* Profile Details */}
            <div className="flex-1 text-center md:text-left space-y-3">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2">
                <span className="badge-corporate">{portfolio.professionalRole}</span>
                {portfolio.company?.companyName && (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                    <Building className="w-3.5 h-3.5 text-corporate-mutedText" />
                    <span>{portfolio.company.companyName}</span>
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-corporate-navy tracking-tight">
                {portfolio.fullName}
              </h1>

              <p className="text-lg sm:text-xl font-semibold text-corporate-blue">
                {portfolio.professionalTitle}
              </p>

              <p className="text-corporate-mutedText text-base leading-relaxed max-w-3xl">
                {portfolio.shortIntro}
              </p>

              {/* Location & Metadata */}
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs text-corporate-mutedText pt-2">
                {portfolio.location && (
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-4 h-4 text-corporate-blue" />
                    <span>{portfolio.location}</span>
                  </div>
                )}
                {portfolio.company?.department && (
                  <div className="flex items-center space-x-1">
                    <Layers className="w-4 h-4 text-corporate-navy" />
                    <span>{portfolio.company.department}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons & Socials */}
              <div className="pt-4 flex flex-wrap items-center justify-center md:justify-start gap-3">
                {portfolio.contactEnabled && (
                  <a
                    href="#contact"
                    className="px-6 py-2.5 rounded-lg bg-corporate-navy text-white text-sm font-semibold hover:bg-corporate-deep transition-all shadow-subtle"
                  >
                    Contact Professional
                  </a>
                )}

                {portfolio.resumeUrl && portfolio.resumeUrl !== '#' && (
                  <a
                    href={portfolio.resumeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-lg border border-corporate-border bg-white text-corporate-text text-sm font-semibold hover:bg-corporate-secBg transition-colors"
                  >
                    <Download className="w-4 h-4 text-corporate-blue" />
                    <span>Download CV</span>
                  </a>
                )}

                {/* Social icons */}
                <div className="flex items-center space-x-2 pl-2">
                  {portfolio.socialLinks?.linkedin && (
                    <a
                      href={portfolio.socialLinks.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-500 hover:text-corporate-blue hover:bg-corporate-secBg transition-colors"
                      title="LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  )}

                  {portfolio.socialLinks?.twitter && (
                    <a
                      href={portfolio.socialLinks.twitter}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-500 hover:text-sky-500 hover:bg-corporate-secBg transition-colors"
                      title="Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                  )}
                  {portfolio.socialLinks?.website && (
                    <a
                      href={portfolio.socialLinks.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-slate-500 hover:text-corporate-navy hover:bg-corporate-secBg transition-colors"
                      title="Website"
                    >
                      <Globe className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Content Body Grid */}
        <div className="mt-12 space-y-16">
          {/* Section: Biography */}
          {portfolio.bio && (
            <section id="about" className="space-y-4">
              <div className="flex items-center space-x-3 border-b border-corporate-border pb-3">
                <FileText className="w-5 h-5 text-corporate-blue" />
                <h2 className="text-2xl font-bold text-corporate-navy tracking-tight">Executive Biography</h2>
              </div>
              <p className="text-corporate-text leading-relaxed text-base sm:text-lg whitespace-pre-line bg-corporate-secBg/40 p-6 rounded-xl border border-corporate-border">
                {portfolio.bio}
              </p>
            </section>
          )}

          {/* Section: Skills & Technical Expertise */}
          {portfolio.skills && portfolio.skills.length > 0 && (
            <section id="skills" className="space-y-6">
              <div className="flex items-center space-x-3 border-b border-corporate-border pb-3">
                <Layers className="w-5 h-5 text-corporate-blue" />
                <h2 className="text-2xl font-bold text-corporate-navy tracking-tight">
                  Core Competencies & Expertise
                </h2>
              </div>

              {/* ✅ Container: allow category cards to span full width */}
              <div className="grid grid-cols-1 gap-6">
                {Object.entries(skillsByCategory).map(([category, items]) => (
                  <div
                    key={category}
                    className="p-4 sm:p-6 rounded-xl border border-corporate-border bg-white shadow-subtle hover:border-corporate-blue/40 transition-colors min-w-0"
                  >
                    <h3 className="text-sm font-bold text-corporate-navy uppercase tracking-wider mb-4 border-b border-slate-100 pb-2">
                      {category}
                    </h3>

                    {/* ✅ Inner grid for skills: fills the horizontal width (1→2→3→4 cols) */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {items.map((skill, idx) => (
                        <div
                          key={idx}
                          className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-2 px-3 py-2.5 rounded-md bg-corporate-secBg border border-slate-200 text-xs font-semibold text-corporate-text min-w-0"
                        >
                          <span className="break-words leading-tight">{skill.name}</span>
                          {skill.proficiencyLabel && (
                            <span className="text-[10px] text-corporate-blue font-bold px-1.5 py-0.5 rounded bg-white border border-corporate-lightBlue whitespace-nowrap w-fit">
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

          {/* Section: Professional Experience */}
          {portfolio.experience && portfolio.experience.length > 0 && (
            <section id="experience" className="space-y-6">
              <div className="flex items-center space-x-3 border-b border-corporate-border pb-3">
                <Briefcase className="w-5 h-5 text-corporate-blue" />
                <h2 className="text-2xl font-bold text-corporate-navy tracking-tight">
                  Professional Experience
                </h2>
              </div>

              <div className="space-y-6 relative before:absolute before:inset-0 before:left-5 before:w-0.5 before:bg-corporate-border">
                {portfolio.experience.map((exp, idx) => (
                  <div key={idx} className="relative pl-12">
                    <div className="absolute left-3.5 top-1.5 w-3.5 h-3.5 rounded-full bg-corporate-navy border-4 border-white shadow" />
                    <div className="corporate-card p-6">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-corporate-navy">{exp.jobTitle}</h3>
                          <p className="text-sm font-semibold text-corporate-blue">{exp.company}</p>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-corporate-mutedText font-medium bg-corporate-secBg px-3 py-1 rounded-full w-fit">
                          <Calendar className="w-3.5 h-3.5" />
                          <span>
                            {exp.startDate} – {exp.isCurrent ? 'Present' : exp.endDate || 'N/A'}
                          </span>
                        </div>
                      </div>

                      {exp.description && (
                        <p className="mt-3 text-sm text-corporate-text leading-relaxed">
                          {exp.description}
                        </p>
                      )}

                      {exp.responsibilities && exp.responsibilities.length > 0 && (
                        <ul className="mt-4 space-y-2">
                          {exp.responsibilities.map((resp, rIdx) => (
                            <li key={rIdx} className="text-xs sm:text-sm text-slate-600 flex items-start space-x-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-corporate-blue mt-1.5 flex-shrink-0" />
                              <span>{resp}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Projects & Portfolio Work */}
          {portfolio.projects && portfolio.projects.length > 0 && (
            <section id="projects" className="space-y-6">
              <div className="flex items-center space-x-3 border-b border-corporate-border pb-3">
                <Layers className="w-5 h-5 text-corporate-blue" />
                <h2 className="text-2xl font-bold text-corporate-navy tracking-tight">
                  Selected Projects & Initiatives
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {portfolio.projects.map((proj, idx) => (
                  <div
                    key={idx}
                    className="corporate-card corporate-card-hover overflow-hidden flex flex-col"
                  >
                    {proj.coverImage && (
                      <div className="h-48 w-full overflow-hidden bg-slate-100">
                        <img
                          src={proj.coverImage}
                          alt={proj.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h3 className="text-lg font-bold text-corporate-navy">{proj.title}</h3>
                          {proj.isFeatured && (
                            <span className="badge-corporate text-[10px]">Featured</span>
                          )}
                        </div>
                        <p className="text-sm text-corporate-mutedText leading-relaxed mb-4">
                          {proj.description}
                        </p>
                      </div>

                      <div>
                        {proj.technologies && proj.technologies.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {proj.technologies.map((tech, tIdx) => (
                              <span
                                key={tIdx}
                                className="px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="flex items-center space-x-4 pt-2 border-t border-slate-100 text-xs font-semibold text-corporate-blue">
                          {proj.projectUrl && (
                            <a
                              href={proj.projectUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center space-x-1 hover:underline"
                            >
                              <span>View Project</span>
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Education — FULL WIDTH */}
          {portfolio.education && portfolio.education.length > 0 && (
            <section id="education" className="space-y-4">
              <div className="flex items-center space-x-3 border-b border-corporate-border pb-3">
                <GraduationCap className="w-5 h-5 text-corporate-blue" />
                <h2 className="text-2xl font-bold text-corporate-navy tracking-tight">Education</h2>
              </div>

              {/* ✅ Full-width grid: 1 → 2 → 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.education.map((edu, idx) => (
                  <div key={idx} className="corporate-card p-5">
                    <h3 className="text-base font-bold text-corporate-navy">{edu.qualification}</h3>
                    <p className="text-sm font-semibold text-corporate-blue">{edu.institution}</p>
                    {edu.fieldOfStudy && (
                      <p className="text-xs text-corporate-mutedText mt-1">Field: {edu.fieldOfStudy}</p>
                    )}
                    <p className="text-xs text-slate-400 mt-1">
                      {edu.startDate} – {edu.endDate || 'Present'}
                    </p>
                    {edu.description && (
                      <p className="text-xs text-slate-600 mt-2 leading-relaxed">{edu.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Certifications — FULL WIDTH (moved out of the 2-col grid) */}
          {portfolio.certifications && portfolio.certifications.length > 0 && (
            <section id="certifications" className="space-y-4">
              <div className="flex items-center space-x-3 border-b border-corporate-border pb-3">
                <Award className="w-5 h-5 text-corporate-blue" />
                <h2 className="text-2xl font-bold text-corporate-navy tracking-tight">
                  Certifications & Credentials
                </h2>
              </div>

              {/* ✅ Full-width grid: 1 → 2 → 3 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {portfolio.certifications.map((cert, idx) => (
                  <div key={idx} className="corporate-card p-5">
                    <h3 className="text-base font-bold text-corporate-navy">{cert.title}</h3>
                    <p className="text-sm font-semibold text-corporate-blue">{cert.issuer}</p>
                    {cert.credentialId && (
                      <p className="text-xs text-corporate-mutedText mt-1">Credential ID: {cert.credentialId}</p>
                    )}
                    {cert.issueDate && (
                      <p className="text-xs text-slate-400 mt-1">Issued: {cert.issueDate}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Section: Direct Contact Form */}
          {portfolio.contactEnabled && (
            <ContactSection
              portfolioSlug={portfolio.slug}
              fullName={portfolio.fullName}
              email={portfolio.email}
              phone={portfolio.phone}
              whatsapp={portfolio.whatsapp}
              location={portfolio.location}
              darkVariant={false}
            />
          )}
        </div>
      </div>
    </div>
  );
};