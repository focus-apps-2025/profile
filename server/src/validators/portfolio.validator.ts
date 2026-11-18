import { z } from 'zod';
import { RESERVED_SLUGS } from '../utils/slug';

const SkillItemSchema = z.object({
  name: z.string().min(1, 'Skill name is required'),
  category: z.string().default('General'),
  proficiencyLabel: z.string().optional(),
  displayOrder: z.number().optional().default(0),
});

const ExperienceItemSchema = z.object({
  jobTitle: z.string().min(1, 'Job title is required'),
  company: z.string().min(1, 'Company is required'),
  employmentType: z.string().optional().default('Full-time'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  isCurrent: z.boolean().default(false),
  description: z.string().optional(),
  responsibilities: z.array(z.string()).optional().default([]),
});

const EducationItemSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  qualification: z.string().min(1, 'Qualification is required'),
  fieldOfStudy: z.string().optional(),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional(),
  description: z.string().optional(),
});

const ProjectItemSchema = z.object({
  title: z.string().min(1, 'Project title is required'),
  description: z.string().min(1, 'Description is required'),
  coverImage: z.string().optional(),
  technologies: z.array(z.string()).default([]),
  projectUrl: z.string().optional(),
  repoUrl: z.string().optional(),
  role: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  displayOrder: z.number().optional().default(0),
  isFeatured: z.boolean().optional().default(false),
});

const CertificationItemSchema = z.object({
  title: z.string().min(1, 'Certification title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  issueDate: z.string().optional(),
  expiryDate: z.string().optional(),
  credentialId: z.string().optional(),
  credentialUrl: z.string().optional(),
});

const ServiceItemSchema = z.object({
  title: z.string().min(1, 'Service title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().optional(),
});

const CompanyInfoSchema = z.object({
  companyName: z.string().optional(),
  companyLogo: z.string().optional(),
  companyWebsite: z.string().optional(),
  department: z.string().optional(),
  jobTitle: z.string().optional(),
  employmentType: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  isCurrent: z.boolean().optional().default(true),
  publicContactInfo: z.string().optional(),
});

const SocialLinksSchema = z.object({
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
  website: z.string().optional(),
  dribbble: z.string().optional(),
  behance: z.string().optional(),
  youtube: z.string().optional(),
  email: z.string().optional(),
});

export const createPortfolioSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  slug: z
    .string()
    .min(2, 'Slug must be at least 2 characters')
    .max(50, 'Slug must be at most 50 characters')
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug can only contain lowercase letters, numbers, and single hyphens')
    .refine((val) => !RESERVED_SLUGS.has(val.toLowerCase()), {
      message: 'This slug is reserved for system routes',
    }),
  professionalTitle: z.string().min(2, 'Professional title is required'),
  shortIntro: z.string().min(10, 'Short introduction must be at least 10 characters'),
  bio: z.string().optional(),
  profilePhoto: z.string().optional(),
  coverImage: z.string().optional(),
  email: z.string().email('Please provide a valid email'),
  phone: z.string().optional(),
  whatsapp: z
    .string()
    .optional()
    .refine(
      (val) => !val || /^\+?[0-9\s\-()]{7,20}$/.test(val),
      'WhatsApp number must be a valid phone number (7–20 digits, optional +, spaces, dashes, parentheses)'
    ),
  location: z.string().optional(),
  professionalRole: z.string().min(2, 'Professional role category is required'),
  status: z.enum(['draft', 'published', 'disabled']).default('draft'),
  selectedTemplate: z.enum(['classic-corporate', 'modern-professional']).default('classic-corporate'),
  isFeatured: z.boolean().default(false),
  showInDirectory: z.boolean().default(true),
  resumeUrl: z.string().optional(),
  contactEnabled: z.boolean().default(true),
  company: CompanyInfoSchema.optional(),
  skills: z.array(SkillItemSchema).optional().default([]),
  experience: z.array(ExperienceItemSchema).optional().default([]),
  education: z.array(EducationItemSchema).optional().default([]),
  projects: z.array(ProjectItemSchema).optional().default([]),
  certifications: z.array(CertificationItemSchema).optional().default([]),
  services: z.array(ServiceItemSchema).optional().default([]),
  socialLinks: SocialLinksSchema.optional(),
});

export const updatePortfolioSchema = createPortfolioSchema.partial();

export const inquirySchema = z.object({
  portfolioSlug: z.string().min(1, 'Portfolio slug is required'),
  senderName: z.string().min(2, 'Your name is required'),
  senderEmail: z.string().email('Please enter a valid email address'),
  subject: z.string().optional(),
  message: z.string().min(5, 'Message must be at least 5 characters'),
});
