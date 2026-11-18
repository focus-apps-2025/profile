import mongoose, { Schema, HydratedDocument } from 'mongoose';
import { IPortfolio } from '../types';

// ✅ Use HydratedDocument instead of extending Document
export type IPortfolioDocument = HydratedDocument<IPortfolio> & {
  toPublicJSON(): any;
};

const SkillSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, default: 'General' },
    proficiencyLabel: { type: String, trim: true },
    displayOrder: { type: Number, default: 0 },
  },
  { _id: true }
);

const ExperienceSchema = new Schema(
  {
    jobTitle: { type: String, required: true, trim: true },
    company: { type: String, required: true, trim: true },
    employmentType: { type: String, trim: true, default: 'Full-time' },
    startDate: { type: String, required: true },
    endDate: { type: String },
    isCurrent: { type: Boolean, default: false },
    description: { type: String, trim: true },
    responsibilities: [{ type: String, trim: true }],
  },
  { _id: true }
);

const EducationSchema = new Schema(
  {
    institution: { type: String, required: true, trim: true },
    qualification: { type: String, required: true, trim: true },
    fieldOfStudy: { type: String, trim: true },
    startDate: { type: String, required: true },
    endDate: { type: String },
    description: { type: String, trim: true },
  },
  { _id: true }
);

const ProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    coverImage: { type: String, trim: true },
    technologies: [{ type: String, trim: true }],
    projectUrl: { type: String, trim: true },
    repoUrl: { type: String, trim: true },
    role: { type: String, trim: true },
    startDate: { type: String },
    endDate: { type: String },
    displayOrder: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
  },
  { _id: true }
);

const CertificationSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    issuer: { type: String, required: true, trim: true },
    issueDate: { type: String },
    expiryDate: { type: String },
    credentialId: { type: String, trim: true },
    credentialUrl: { type: String, trim: true },
  },
  { _id: true }
);

const ServiceSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, trim: true },
  },
  { _id: true }
);

const CompanyInfoSchema = new Schema(
  {
    companyName: { type: String, trim: true },
    companyLogo: { type: String, trim: true },
    companyWebsite: { type: String, trim: true },
    department: { type: String, trim: true },
    jobTitle: { type: String, trim: true },
    employmentType: { type: String, trim: true },
    startDate: { type: String },
    endDate: { type: String },
    isCurrent: { type: Boolean, default: true },
    publicContactInfo: { type: String, trim: true },
  },
  { _id: false }
);

const SocialLinksSchema = new Schema(
  {
    linkedin: { type: String, trim: true },
    twitter: { type: String, trim: true },
    website: { type: String, trim: true },
    dribbble: { type: String, trim: true },
    behance: { type: String, trim: true },
    youtube: { type: String, trim: true },
    email: { type: String, trim: true },
  },
  { _id: false }
);

const PortfolioSchema = new Schema<IPortfolio>(
  {
    fullName: { type: String, required: [true, 'Full name is required'], trim: true, index: true },
    slug: { type: String, required: [true, 'Slug is required'], unique: true, lowercase: true, trim: true, index: true },
    slugHistory: [{ type: String, lowercase: true, trim: true }],
    professionalTitle: { type: String, required: [true, 'Professional title is required'], trim: true },
    shortIntro: { type: String, required: [true, 'Short introduction is required'], trim: true },
    bio: { type: String, trim: true },
    profilePhoto: { type: String, trim: true },
    coverImage: { type: String, trim: true },
    email: { type: String, required: [true, 'Email is required'], trim: true },
    phone: { type: String, trim: true },
    whatsapp: { type: String, trim: true },
    location: { type: String, trim: true },
    professionalRole: { type: String, required: [true, 'Professional role is required'], trim: true, index: true },
    status: { type: String, enum: ['draft', 'published', 'disabled'], default: 'draft', index: true },
    selectedTemplate: { type: String, enum: ['classic-corporate', 'modern-professional'], default: 'classic-corporate' },
    isFeatured: { type: Boolean, default: false, index: true },
    showInDirectory: { type: Boolean, default: true, index: true },
    resumeUrl: { type: String, trim: true },
    contactEnabled: { type: Boolean, default: true },
    company: CompanyInfoSchema,
    skills: [SkillSchema],
    experience: [ExperienceSchema],
    education: [EducationSchema],
    projects: [ProjectSchema],
    certifications: [CertificationSchema],
    services: [ServiceSchema],
    socialLinks: SocialLinksSchema,
  },
  { timestamps: true }
);

// Slug history handling before saving
PortfolioSchema.pre('save', function (next) {
  const doc = this as any;
  if (doc.isModified('slug')) {
    if (!doc.slugHistory) doc.slugHistory = [];
    const pastSlug = doc.get('slug', null, { getters: false });
    if (pastSlug && pastSlug !== doc.slug && !doc.slugHistory.includes(pastSlug)) {
      doc.slugHistory.push(pastSlug);
    }
  }
  next();
});

// Sanitized public object
PortfolioSchema.methods.toPublicJSON = function (): any {
  const obj: any = this.toObject();
  return {
    _id: obj._id?.toString?.() ?? obj._id,
    fullName: obj.fullName,
    slug: obj.slug,
    professionalTitle: obj.professionalTitle,
    shortIntro: obj.shortIntro,
    bio: obj.bio,
    profilePhoto: obj.profilePhoto,
    coverImage: obj.coverImage,
    email: obj.email,
    phone: obj.phone,
    whatsapp: obj.whatsapp,
    location: obj.location,
    professionalRole: obj.professionalRole,
    status: obj.status,
    selectedTemplate: obj.selectedTemplate,
    isFeatured: obj.isFeatured,
    resumeUrl: obj.resumeUrl,
    contactEnabled: obj.contactEnabled,
    company: obj.company,
    skills: obj.skills || [],
    experience: obj.experience || [],
    education: obj.education || [],
    projects: obj.projects || [],
    certifications: obj.certifications || [],
    services: obj.services || [],
    socialLinks: obj.socialLinks || {},
    createdAt: obj.createdAt,
    updatedAt: obj.updatedAt,
  };
};

// ✅ Serialize _id → string everywhere, and drop __v
PortfolioSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_doc, ret: any) => {
    ret._id = ret._id?.toString?.() ?? ret._id;
    ['skills', 'experience', 'education', 'projects', 'certifications', 'services'].forEach((k) => {
      if (Array.isArray(ret[k])) {
        ret[k].forEach((item: any) => {
          if (item?._id) item._id = item._id.toString?.() ?? item._id;
        });
      }
    });
    return ret;
  },
});

export const Portfolio = mongoose.model<IPortfolio>('Portfolio', PortfolioSchema);