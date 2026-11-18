import bcrypt from 'bcryptjs';
import { IPortfolio, IAdminUser, IInquiry, PortfolioStatus } from '../types';
import { Portfolio, IPortfolioDocument } from '../models/Portfolio';
import { Admin } from '../models/Admin';
import { Inquiry } from '../models/Inquiry';
import { getDBConnectionStatus } from '../config/db';
import { config } from '../config';

// -------------------------------------------------------------
// Seed Helpers
// -------------------------------------------------------------
const PLACEHOLDER_COVER =
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1600';
const COMPANY_LOGO =
  'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?auto=format&fit=crop&q=80&w=200';

// Google Drive /view URL -> direct image (lh3 variant, more reliable than uc?export=view)
const driveImg = (id: string) => `https://lh3.googleusercontent.com/d/${id}`;

const PHOTOS = {
  vijay: driveImg('1v9MmOihHgsDAlXRRvCLiRsh-QbGLFAdm'),
  kiran: driveImg('1XCuKPrp_mbk-fRnfQ_AURm7m-56EffZ5'),
  kabir: driveImg('1npo2B8gsP0eMMJuE8A0k56hka3NepaVN'),
};

const buildSkills = (raw: string, category = 'General') =>
  raw
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((name, i) => ({
      name,
      category,
      proficiencyLabel: 'Proficient',
      displayOrder: i + 1,
    }));

const seededNow = new Date();

// -------------------------------------------------------------
// In-Memory Seeded Fallback Store
// -------------------------------------------------------------
const memoryPortfolios: IPortfolio[] = [
  // ===========================================================
  // KABIR BAWEJA
  // ===========================================================
  {
    _id: 'seed_kabir',
    fullName: 'Kabir Baweja',
    slug: 'Kabir Baweja',
    slugHistory: [],
    professionalTitle: 'Business Development Head',
    professionalRole: 'Business Development',
    shortIntro:
      'My duty is to expand and develop business strategies, specifically for sales and marketing',
    bio:
      'Work with businesses to solve growth and operational challenges through audit & technology consulting, commercial real estate strategy, and brand activation.\n\nDriven by a practical, outcome-focused approach; I help organizations improve efficiency, make informed expansion decisions, and strengthen their market presence.',
    profilePhoto: PHOTOS.kabir,
    coverImage: PLACEHOLDER_COVER,
    email: 'Sales@focusengineering.in',
    phone: '9717822680',
    location: 'Gurgaon',
    status: 'published',
    selectedTemplate: 'classic-corporate',
    isFeatured: true,
    showInDirectory: true,
    resumeUrl: '#',
    contactEnabled: true,
    company: {
      companyName: 'FOCUS Engineering',
      companyLogo: COMPANY_LOGO,
      companyWebsite: 'https://focusengineeringapp.com',
      department: 'BD',
      jobTitle: 'Business Development Head',
      employmentType: 'Full-time',
      startDate: '2022-01',
      isCurrent: true,
      publicContactInfo: 'Sales@focusengineering.in',
    },
    skills: buildSkills('Communication, Negotiation, Knowledgable'),
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    services: [],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/kabir-baweja-84b231163/',
      website: 'https://focusengineeringapp.com',
    },
    createdAt: seededNow,
    updatedAt: seededNow,
  },

  // ===========================================================
  // VIJAY DEVADAS
  // ===========================================================
  {
    _id: 'seed_vijay',
    fullName: 'Vijay Devadas',
    slug: 'Vijay Devadas',
    slugHistory: [],
    professionalTitle: 'Business Analyst & Executive Assistant to CEO',
    professionalRole:
      'Business Analysis , Sales & Business Development , Business Operations',
    shortIntro:
      'Business Analyst at Focus Engineering, responsible for data analytics, business reporting, client coordination, sales support and business development. Experienced in transforming business data into actionable insights, developing management dashboards and supporting strategic business initiatives.',
    bio:
      'I am a Business Analyst and Executive Assistant to the CEO at Focus Engineering, where I handle business analysis, sales operations, client management and business development activities.\n\n' +
      'With a background in Mechanical Engineering and experience in MIS, data analytics and business reporting, I specialize in developing data-driven solutions that support better business decisions and improve operational efficiency.\n\n' +
      'My expertise includes designing advanced Excel and Power BI dashboards, developing automated reporting systems using VBA and Macros, analysing business performance, and preparing management presentations for leading automotive OEMs and dealership networks.\n\n' +
      'Along with my analytical responsibilities, I manage client communications, coordinate business meetings, handle payment follow-ups, identify new business opportunities, and support sales and marketing initiatives.\n\n' +
      "I also work on creating AI-powered promotional videos, corporate presentations, sales pitches and marketing content to effectively showcase Focus Engineering's services and solutions.\n\n" +
      'My objective is to bridge the gap between data, business strategy and execution by leveraging technology, analytics and effective communication to drive business growth and operational excellence.',
    profilePhoto: PHOTOS.vijay,
    coverImage: PLACEHOLDER_COVER,
    email: 'vijaydevadas@focusengineering.in',
    phone: '7715055663',
    location: 'Thane, Maharashtra',
    status: 'published',
    selectedTemplate: 'classic-corporate',
    isFeatured: true,
    showInDirectory: true,
    resumeUrl: '#',
    contactEnabled: true,
    company: {
      companyName: 'FOCUS Engineering',
      companyLogo: COMPANY_LOGO,
      companyWebsite: 'https://focusengineeringapp.com',
      department: 'Sales and Marketing',
      jobTitle: 'Business Analyst & Executive Assistant to CEO',
      employmentType: 'Full-time',
      startDate: '2026-04',
      isCurrent: true,
      publicContactInfo: 'vijaydevadas@focusengineering.in',
    },
    skills: buildSkills(
      'Advanced Microsoft Excel, Power BI, Data Analysis & Visualization, Business Development & Lead Generation, AI Video Generation & Marketing Content, Client Coordination & Account Management, Project Management, Business Analysis, Sales Management, Operations Management, Python, Machine Learning, NLP, Statistical Data Analysis'
    ),
    experience: [
      {
        jobTitle: 'Business Analyst',
        company: 'Focus Group (Focus Engineering)',
        employmentType: 'Full-time',
        startDate: '2026-04',
        isCurrent: true,
        description:
          'Working across Business Analysis, Automotive Consulting, Data Analytics, Project Coordination, and Business Development.',
        responsibilities: [
          'Understanding client requirements and translating business challenges into structured project requirements and proposed solutions.',
          'Supporting business development by identifying potential clients, researching target industries and decision-makers, initiating client outreach, understanding requirements, and supporting proposal development.',
          'Coordinating automotive dealer audits, process assessments, parts inventory audits, customer surveys, and multi-location projects.',
          'Analyzing operational, audit, and survey data to identify trends, process deviations, recurring issues, and improvement opportunities.',
          'Coordinating with clients, internal teams, field auditors, consultants, and project stakeholders to ensure effective project execution.',
          'Contributing to business development initiatives across automobile OEMs, dealer groups, auto-component manufacturers, engineering companies, and MSMEs.',
        ],
      },
      {
        jobTitle: 'Operations & MIS Lead',
        company: 'Sonali Vijay & Associates',
        employmentType: 'Full-time',
        startDate: '2024-08',
        endDate: '2026-02',
        isCurrent: false,
        description:
          'Directed operational setup and MIS for a Chartered Accountancy practice.',
        responsibilities: [
          'Directed the end-to-end operational setup for a new Chartered Accountancy practice, transitioning all client financial data from manual records into a highly secure, structured digital framework.',
          'Designed custom automated Excel dashboards for SME clients, including Accounts Receivable (Ageing) trackers and Inventory TAT dashboards.',
          "Built an automated GST Input Tax Credit (ITC) reconciliation tool using advanced VLOOKUPs and conditional formatting.",
          "Managed digital marketing campaigns to acquire new ROC and GST clients; stabilized backend processes leading to the firm's strategic merger.",
        ],
      },
      {
        jobTitle: 'Deputy Manager',
        company: 'VFS Global',
        employmentType: 'Full-time',
        // location: 'Mumbai, Maharashtra, India · Hybrid',
        startDate: '2023-02',
        endDate: '2024-06',
        isCurrent: false,
        description:
          'Led end-to-end transition from legacy VIRE software to a new web-based SLA system for the Australia Mission.',
        responsibilities: [
          'Expanded compliance tracking from 8 to 112 SLA parameters with zero penalties from the foreign government.',
          'Pioneered a deployment framework that became the organizational standard across Missions.',
          'Recognized by the CEO with an Appreciation Email for delivering the mission-critical SLA project.',
          'Acted as primary liaison between software vendors, VAC managers, and senior leadership.',
          'Designed Power BI dashboards in partnership with BI teams to standardize SLA metric reporting.',
          'Conducted global training sessions for VAC representatives across multiple time zones.',
        ],
      },
      {
        jobTitle: 'Management Information System Executive',
        company: 'Infinity Cars Pvt Ltd',
        employmentType: 'Full-time',
        //location: 'Navi Mumbai, Maharashtra, India · On-site',
        startDate: '2021-11',
        endDate: '2023-02',
        isCurrent: false,
        description:
          'Designed and maintained CRM and aftersales performance reports for luxury automotive brands.',
        responsibilities: [
          'Designed, automated, and maintained CRM and aftersales performance reports in MS Excel.',
          'Analyzed Turnaround Time (TAT) for vehicle servicing and delivery, identified bottlenecks, and implemented corrective actions.',
          'Monitored and reported business KPIs for BMW, Porsche, Lamborghini, Rolls Royce dealerships.',
          'Provided data-driven insights on service revenue, parts consumption, and customer satisfaction metrics.',
          'Modernized the dealership database and reporting systems by integrating IT and data analytics solutions.',
        ],
      },
      {
        jobTitle: 'Management Information System Executive',
        company: 'Tikona Infinet Ltd. - India',
        employmentType: 'Full-time',
        // location: 'Mumbai, Maharashtra, India · On-site',
        startDate: '2018-11',
        endDate: '2020-12',
        isCurrent: false,
        description: 'Managed MIS reporting for PAN-India NNOC operations.',
        responsibilities: [
          'Managed daily compilation and distribution of NNOC performance reports for PAN-India operations.',
          'Conducted weekly utilization analysis of First Destination Nodes (FDNs).',
          'Performed detailed audits of the Capstone Portal, validating bandwidth allocation, FDN identifiers, and port details.',
          'Analyzed Frequent Disconnection APs and Event Node reports to proactively raise tickets and minimize downtime.',
        ],
      },
    ],
    education: [
      {
        institution: 'Karnataka State Open University',
        qualification: 'Bachelor of Technology - BTech',
        fieldOfStudy: 'Mechanical Engineering',
        startDate: '2011',
        endDate: '2015-05',
      },
      {
        institution: 'ExcelR Solutions',
        qualification: 'Data Science and Machine Learning',
        fieldOfStudy: 'Data Scientist',
        startDate: '2020',
        endDate: '2021',
        description:
          'Python Programming & Data Science, Predictive Analytics and Statistical Analysis, Text Analysis and NLP, Data Mining, Regressions, Deep Learning.',
      },
    ],
    projects: [
      {
        title: 'Classification of Myocardial Infarction',
        description:
          'Machine learning classification project for detecting myocardial infarction from clinical data — one of the most challenging problems in modern medicine, with high first-year mortality.',
        technologies: ['Python', 'Machine Learning', 'Statistical Analysis'],
        role: 'Data Scientist',
        startDate: '2021-08',
        endDate: 'Present',
        isFeatured: true,
        displayOrder: 1,
      },
      {
        title: 'NLP Email Classification',
        description:
          'Built models and predictions on large datasets (~49k+ records) using advanced statistical modeling, ML, AI, and data mining; developed algorithms scalable to very large datasets.',
        technologies: ['Python', 'NLP', 'Machine Learning', 'Data Mining'],
        role: 'Data Scientist',
        startDate: '2021-05',
        endDate: '2021-07',
        isFeatured: true,
        displayOrder: 2,
      },
    ],
    certifications: [],
    services: [],
    socialLinks: {
      linkedin: 'https://www.linkedin.com/in/vijaydevadas/',
      website: 'https://focusengineeringapp.com',
    },
    createdAt: seededNow,
    updatedAt: seededNow,
  },

  // ===========================================================
  // KIRAN
  // ===========================================================
  {
    _id: 'seed_kiran',
    fullName: 'Kiran',
    slug: 'Kiran',
    slugHistory: [],
    professionalTitle: 'Business Transformation Consultant',
    professionalRole:
      'Business Transformation, Project Management, Process Consulting',
    shortIntro:
      'Business Transformation Consultant at Focus Engineering, leading process transformation and SaaS rollouts across major automotive OEM accounts including BMW, TVS, and MG Motor India.',
    bio:
      'Business Transformation Consultant at Focus Engineering, leading process transformation and SaaS rollout initiatives across multiple automotive OEM accounts (BMW, TVS, MG Motor India), functioning as Regional Manager and Project Manager on concurrent engagements.\n\n' +
      'Over 7 years of experience spanning MIS, dealer performance analytics, process mapping, SOP development, and business transformation across automotive, logistics, and BPO sectors.\n\n' +
      'Specializes in applying root-cause analysis (5 Whys, Fishbone) and structured 30-60-90 day transformation frameworks to drive measurable performance improvements.',
    profilePhoto: PHOTOS.kiran,
    coverImage: PLACEHOLDER_COVER,
    // ⚠️ TODO: email/phone not in Excel — confirm with Kiran
    email: 'kiran@focusengineering.in',
    phone: 'TODO',
    location: 'Pune District, Maharashtra, India',
    status: 'published',
    selectedTemplate: 'classic-corporate',
    isFeatured: true,
    showInDirectory: true,
    resumeUrl: '#',
    contactEnabled: true,
    company: {
      companyName: 'FOCUS Engineering',
      companyLogo: COMPANY_LOGO,
      companyWebsite: 'https://focusengineeringapp.com',
      department: 'Business Transformation',
      jobTitle: 'Business Transformation Consultant',
      employmentType: 'Full-time',
      startDate: '2025-02',
      isCurrent: true,
      publicContactInfo: 'kiran@focusengineering.in',
    },
    skills: buildSkills(
      'Proposal Development, SOP Development, Process Definition, Process Efficiency, Small Business Consulting, Stakeholder Engagement, Client Communication, KPI Dashboards, MIS Reporting, ERP / SAP S&D, Training Content Development, Execution and Delivery Management, Cross-functional Coordination, Business Planning, Strategic Documentation, Process Optimization (Manufacturing), Operations Management',
      'Consulting'
    ),
    experience: [
      {
        jobTitle: 'Business Transformation Consultant',
        company: 'Focus Group (Focus Engineering)',
        employmentType: 'Full-time',
        //  location: 'Pune District, Maharashtra, India · Hybrid',
        startDate: '2025-02',
        isCurrent: true,
        description:
          'Leading process transformation and SaaS rollout initiatives across multiple automotive OEM accounts (BMW, TVS, MG Motor India) as Regional Manager and Project Manager.',
        responsibilities: [
          'Led CitNOW SaaS rollout (video inspection & customer communication platform) across 59 branches and 100+ users for BMW & MG Motor India — end-to-end coordination from deployment to adoption.',
          "Authored the complete Bodyshop Manual for TVS's new three-wheeler (3W) product line, covering technical and process documentation.",
          'Drove process mapping and SOP-DMS alignment for MG Motor India, re-engineering workflows tracked via Gantt charts.',
          'Built SOP and governance frameworks; managed RFQs, quotations, and market research for new engagements.',
          'Applied root-cause analysis (5 Whys, Fishbone) to lift execution performance by 15%.',
        ],
      },
      {
        jobTitle: 'Independent Consultant',
        company: 'Self-Employed',
        employmentType: 'Freelance',
        // location: 'Pune District, Maharashtra, India · On-site',
        startDate: '2024-07',
        endDate: '2025-01',
        isCurrent: false,
        description:
          'Designed and applied a structured 30-60-90 day transformation framework for dealership process mapping and audit-readiness engagements.',
        responsibilities: [
          'Process Definition and Process Efficiency engagements for automotive dealerships.',
          'Audit-readiness and process-mapping consulting for dealership operations.',
        ],
      },
      {
        jobTitle: 'Management Information System Analyst',
        company: 'BMW Bavaria Motors',
        employmentType: 'Full-time',
        // location: 'Pune District, Maharashtra, India · On-site',
        startDate: '2021-12',
        endDate: '2024-07',
        isCurrent: false,
        description:
          'Owned dealer performance analytics, dashboards, and KPI framework architecture.',
        responsibilities: [
          'Raised dealer evaluation ratings by 20% through performance analytics and KPI frameworks.',
          'Mapped As-Is/To-Be SOPs to streamline dealer onboarding.',
          'Ran audits and CAPA processes aligned to global OEM standards.',
          'Rewrote technical SOPs into technician-friendly language, improving network-wide adoption.',
        ],
      },
      {
        jobTitle: 'Management Information System Analyst',
        company: 'Xpressbees (BusyBees Logistics Solutions Pvt. Ltd.)',
        employmentType: 'Full-time',
        // location: 'Pune Division, Maharashtra, India',
        startDate: '2018-09',
        endDate: '2020-12',
        isCurrent: false,
        description:
          'Drove MIS reporting and distribution performance tracking across pan-India line-haul operations.',
        responsibilities: [
          'Contributed to the LHCO project, saving approximately ₹3–4 crore/month.',
          'Mapped logistics workflows and optimized routes, raising network efficiency by 10–12%.',
        ],
      },
      {
        jobTitle: 'Customer Service Representative',
        company: 'Tech Mahindra Business Process Services',
        employmentType: 'Full-time',
        //location: 'Pune Division, Maharashtra, India',
        startDate: '2017-07',
        endDate: '2018-05',
        isCurrent: false,
        description:
          'Managed high-volume enterprise customer support operations for Vodafone processes.',
        responsibilities: [
          'Promoted to SME and Acting Team Leader for night-shift operations; delivered 90–95% SLA performance. Star Performer, Pilot Batch.',
          'Promoted to Subject Matter Expert (SME) responsible for training and mentoring new team members.',
          'Handled escalation cases and ensured customer service quality standards.',
        ],
      },
    ],
    education: [
      {
        institution: 'Bharati Vidyapeeth',
        qualification: 'Master of Business Administration - MBA',
        fieldOfStudy: 'Project Management',
        startDate: '2020-10',
        endDate: '2023-01',
        description: 'Grade: A+',
      },
      {
        institution: 'Savitribai Phule Pune University',
        qualification: 'Bachelor of Commerce - BCom',
        fieldOfStudy: 'Business/Commerce, General',
        startDate: '2014-06',
        endDate: '2018-06',
        description: 'Grade: B',
      },
    ],
    projects: [],
    certifications: [],
    services: [
      {
        title: 'Process Transformation & SOP Development',
        description:
          'End-to-end process mapping, SOP creation, and DMS alignment for automotive OEMs and dealerships.',
        icon: 'FileText',
      },
      {
        title: 'SaaS Rollout & Change Management',
        description:
          'Deployment and adoption leadership for SaaS platforms across multi-branch dealer networks.',
        icon: 'Rocket',
      },
      {
        title: 'Dealer Performance Analytics',
        description:
          'KPI framework architecture, MIS dashboards, and CAPA-driven performance improvement.',
        icon: 'BarChart3',
      },
    ],
    socialLinks: {
      // ⚠️ TODO: Kiran's LinkedIn URL not provided — add when available
      website: 'https://focusengineeringapp.com',
    },
    createdAt: seededNow,
    updatedAt: seededNow,
  },
];

const memoryAdmins: Array<IAdminUser & { passwordHash: string }> = [
  {
    _id: '66a123456789abcdef000000',
    name: config.initialAdmin.name,
    email: config.initialAdmin.email.toLowerCase(),
    role: 'superadmin',
    passwordHash: bcrypt.hashSync(config.initialAdmin.password, 10),
  },
];

const memoryInquiries: IInquiry[] = [];

// -------------------------------------------------------------
// Unified Data Services
// -------------------------------------------------------------

export const dataStore = {
  // --- Portfolio Operations ---
  async getPortfolios(filter: {
    search?: string;
    status?: string;
    role?: string;
    isFeatured?: boolean;
    showInDirectory?: boolean;
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 1 | -1;
  }): Promise<{ portfolios: IPortfolio[]; total: number }> {
    if (getDBConnectionStatus()) {
      const query: any = {};
      if (filter.search) {
        query.$or = [
          { fullName: { $regex: filter.search, $options: 'i' } },
          { professionalTitle: { $regex: filter.search, $options: 'i' } },
          { professionalRole: { $regex: filter.search, $options: 'i' } },
          { slug: { $regex: filter.search, $options: 'i' } },
        ];
      }
      if (filter.status) query.status = filter.status;
      if (filter.role) query.professionalRole = filter.role;
      if (filter.isFeatured !== undefined) query.isFeatured = filter.isFeatured;
      if (filter.showInDirectory !== undefined) query.showInDirectory = filter.showInDirectory;

      const page = filter.page || 1;
      const limit = filter.limit || 10;
      const skip = (page - 1) * limit;
      const sortBy = filter.sortBy || 'createdAt';
      const sortOrder = filter.sortOrder || -1;

      const [portfolios, total] = await Promise.all([
        Portfolio.find(query).sort({ [sortBy]: sortOrder }).skip(skip).limit(limit).lean(),
        Portfolio.countDocuments(query),
      ]);
      return { portfolios: portfolios as any, total };
    }

    // In-memory fallback
    let list = [...memoryPortfolios];

    if (filter.search) {
      const s = filter.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.fullName.toLowerCase().includes(s) ||
          p.professionalTitle.toLowerCase().includes(s) ||
          p.professionalRole.toLowerCase().includes(s) ||
          p.slug.toLowerCase().includes(s)
      );
    }
    if (filter.status) {
      list = list.filter((p) => p.status === filter.status);
    }
    if (filter.role) {
      list = list.filter((p) => p.professionalRole === filter.role);
    }
    if (filter.isFeatured !== undefined) {
      list = list.filter((p) => p.isFeatured === filter.isFeatured);
    }
    if (filter.showInDirectory !== undefined) {
      list = list.filter((p) => p.showInDirectory === filter.showInDirectory);
    }

    const total = list.length;
    const page = filter.page || 1;
    const limit = filter.limit || 10;
    const skip = (page - 1) * limit;
    const portfolios = list.slice(skip, skip + limit);

    return { portfolios, total };
  },

  async findPortfolioBySlug(slug: string): Promise<{ portfolio: IPortfolio | null; redirectedFromHistory: boolean }> {
    if (getDBConnectionStatus()) {
      let portfolio = await Portfolio.findOne({ slug });
      let redirectedFromHistory = false;
      if (!portfolio) {
        portfolio = await Portfolio.findOne({ slugHistory: slug });
        if (portfolio) redirectedFromHistory = true;
      }
      return { portfolio: portfolio ? (portfolio.toPublicJSON ? portfolio.toPublicJSON() : portfolio.toObject()) : null, redirectedFromHistory };
    }

    // In-Memory
    const direct = memoryPortfolios.find((p) => p.slug === slug);
    if (direct) return { portfolio: direct, redirectedFromHistory: false };

    const hist = memoryPortfolios.find((p) => p.slugHistory?.includes(slug));
    if (hist) return { portfolio: hist, redirectedFromHistory: true };

    return { portfolio: null, redirectedFromHistory: false };
  },

  async findPortfolioById(id: string): Promise<IPortfolio | null> {
    if (getDBConnectionStatus()) {
      const p = await Portfolio.findById(id);
      return p ? p.toObject() : null;
    }
    return memoryPortfolios.find((p) => p._id === id) || null;
  },

  async createPortfolio(data: any): Promise<IPortfolio> {
    if (getDBConnectionStatus()) {
      const p = new Portfolio(data);
      await p.save();
      return p.toObject();
    }

    const created: IPortfolio = {
      ...data,
      _id: 'mem_' + Date.now().toString(16),
      slugHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    memoryPortfolios.push(created);
    return created;
  },

  async updatePortfolio(id: string, data: any): Promise<IPortfolio | null> {
    if (getDBConnectionStatus()) {
      const p = await Portfolio.findById(id);
      if (!p) return null;
      if (data.slug && data.slug !== p.slug) {
        if (!p.slugHistory) p.slugHistory = [];
        if (!p.slugHistory.includes(p.slug)) p.slugHistory.push(p.slug);
      }
      Object.assign(p, data);
      await p.save();
      return p.toObject();
    }

    const idx = memoryPortfolios.findIndex((p) => p._id === id);
    if (idx === -1) return null;
    const existing = memoryPortfolios[idx];
    if (data.slug && data.slug !== existing.slug) {
      if (!existing.slugHistory) existing.slugHistory = [];
      if (!existing.slugHistory.includes(existing.slug)) existing.slugHistory.push(existing.slug);
    }
    const updated = { ...existing, ...data, updatedAt: new Date() };
    memoryPortfolios[idx] = updated;
    return updated;
  },

  async deletePortfolio(id: string): Promise<boolean> {
    if (getDBConnectionStatus()) {
      const res = await Portfolio.findByIdAndDelete(id);
      return !!res;
    }
    const idx = memoryPortfolios.findIndex((p) => p._id === id);
    if (idx === -1) return false;
    memoryPortfolios.splice(idx, 1);
    return true;
  },

  async checkSlugAvailable(slug: string, currentId?: string): Promise<boolean> {
    if (getDBConnectionStatus()) {
      const q: any = { slug };
      if (currentId) q._id = { $ne: currentId };
      const exists = await Portfolio.findOne(q);
      return !exists;
    }
    const exists = memoryPortfolios.some((p) => p.slug === slug && p._id !== currentId);
    return !exists;
  },

  // --- Admin Authentication Operations ---
  async findAdminByEmail(email: string): Promise<any> {
    if (getDBConnectionStatus()) {
      return Admin.findOne({ email: email.toLowerCase() }).select('+password');
    }
    const found = memoryAdmins.find((a) => a.email.toLowerCase() === email.toLowerCase());
    if (!found) return null;
    return {
      _id: found._id,
      name: found.name,
      email: found.email,
      role: found.role,
      async comparePassword(candidate: string) {
        return bcrypt.compare(candidate, found.passwordHash);
      },
      async save() { },
    };
  },

  async findAdminById(id: string): Promise<any> {
    if (getDBConnectionStatus()) {
      return Admin.findById(id).select('name email role');
    }
    const found = memoryAdmins.find((a) => a._id === id);
    if (!found) return null;
    return {
      _id: found._id,
      name: found.name,
      email: found.email,
      role: found.role,
    };
  },

  // --- Statistics Operations ---
  async getStats() {
    if (getDBConnectionStatus()) {
      const [total, published, draft, disabled, totalInquiries, recentCreated, recentUpdated] =
        await Promise.all([
          Portfolio.countDocuments(),
          Portfolio.countDocuments({ status: 'published' }),
          Portfolio.countDocuments({ status: 'draft' }),
          Portfolio.countDocuments({ status: 'disabled' }),
          Inquiry.countDocuments(),
          Portfolio.find().sort({ createdAt: -1 }).limit(5).select('fullName slug professionalTitle status createdAt profilePhoto').lean(),
          Portfolio.find().sort({ updatedAt: -1 }).limit(5).select('fullName slug professionalTitle status updatedAt profilePhoto').lean(),
        ]);
      return { total, published, draft, disabled, totalInquiries, recentCreated, recentUpdated };
    }

    const total = memoryPortfolios.length;
    const published = memoryPortfolios.filter((p) => p.status === 'published').length;
    const draft = memoryPortfolios.filter((p) => p.status === 'draft').length;
    const disabled = memoryPortfolios.filter((p) => p.status === 'disabled').length;
    const totalInquiries = memoryInquiries.length;
    const recentCreated = [...memoryPortfolios]
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime())
      .slice(0, 5);
    const recentUpdated = [...memoryPortfolios]
      .sort((a, b) => new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime())
      .slice(0, 5);

    return { total, published, draft, disabled, totalInquiries, recentCreated, recentUpdated };
  },

  // --- Inquiries Operations ---
  async createInquiry(data: { portfolioId: string; portfolioSlug: string; senderName: string; senderEmail: string; subject?: string; message: string }) {
    if (getDBConnectionStatus()) {
      const inq = new Inquiry(data);
      await inq.save();
      return inq;
    }
    const inq = {
      _id: 'inq_' + Date.now().toString(16),
      ...data,
      isRead: false,
      createdAt: new Date(),
    };
    memoryInquiries.push(inq);
    return inq;
  },
};