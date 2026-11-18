export type PortfolioStatus = 'draft' | 'published' | 'disabled';
export type PortfolioTemplate = 'classic-corporate' | 'modern-professional';

export interface ISkill {
  _id?: string;
  name: string;
  category: string;
  proficiencyLabel?: string;
  displayOrder?: number;
}

export interface IExperience {
  _id?: string;
  jobTitle: string;
  company: string;
  employmentType?: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description?: string;
  responsibilities?: string[];
}

export interface IEducation {
  _id?: string;
  institution: string;
  qualification: string;
  fieldOfStudy?: string;
  startDate: string;
  endDate?: string;
  description?: string;
}

export interface IProject {
  _id?: string;
  title: string;
  description: string;
  coverImage?: string;
  technologies: string[];
  projectUrl?: string;
  repoUrl?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
  displayOrder?: number;
  isFeatured?: boolean;
}

export interface ICertification {
  _id?: string;
  title: string;
  issuer: string;
  issueDate?: string;
  expiryDate?: string;
  credentialId?: string;
  credentialUrl?: string;
}

export interface IService {
  _id?: string;
  title: string;
  description: string;
  icon?: string;
}

export interface ICompanyInfo {
  companyName?: string;
  companyLogo?: string;
  companyWebsite?: string;
  department?: string;
  jobTitle?: string;
  employmentType?: string;
  startDate?: string;
  endDate?: string;
  isCurrent?: boolean;
  publicContactInfo?: string;
}

export interface ISocialLinks {
  linkedin?: string;
  twitter?: string;
  website?: string;
  dribbble?: string;
  behance?: string;
  youtube?: string;
  email?: string;
}

export interface IPortfolio {
  _id: string;
  fullName: string;
  slug: string;
  slugHistory?: string[];
  professionalTitle: string;
  shortIntro: string;
  bio?: string;
  profilePhoto?: string;
  coverImage?: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  location?: string;
  professionalRole: string;
  status: PortfolioStatus;
  selectedTemplate: PortfolioTemplate;
  isFeatured: boolean;
  showInDirectory: boolean;
  resumeUrl?: string;
  contactEnabled: boolean;
  company?: ICompanyInfo;
  skills: ISkill[];
  experience: IExperience[];
  education: IEducation[];
  projects: IProject[];
  certifications?: ICertification[];
  services?: IService[];
  socialLinks?: ISocialLinks;
  createdAt: string;
  updatedAt: string;
}

export interface IAdminUser {
  id: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin';
}

export interface IDashboardStats {
  total: number;
  published: number;
  draft: number;
  disabled: number;
  totalInquiries: number;
  recentCreated: Array<{
    _id: string;
    fullName: string;
    slug: string;
    professionalTitle: string;
    status: PortfolioStatus;
    createdAt: string;
    profilePhoto?: string;
  }>;
  recentUpdated: Array<{
    _id: string;
    fullName: string;
    slug: string;
    professionalTitle: string;
    status: PortfolioStatus;
    updatedAt: string;
    profilePhoto?: string;
  }>;
}

export interface IPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
