import mongoose from 'mongoose';
import { Admin } from '../models/Admin';
import { Portfolio } from '../models/Portfolio';
import { config } from '../config';
import { connectDB } from '../config/db';

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

export const seedDatabase = async (): Promise<void> => {
  try {
    console.log('[Seed] Checking database initialization status...');

    // 1. Seed Initial Admin if none exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      console.log(`[Seed] Creating initial administrator: ${config.initialAdmin.email}`);
      const admin = new Admin({
        name: config.initialAdmin.name,
        email: config.initialAdmin.email,
        password: config.initialAdmin.password,
        role: 'superadmin',
      });
      await admin.save();
      console.log('[Seed] Initial administrator created successfully.');
    } else {
      console.log(`[Seed] Administrator account already exists (${adminCount} found).`);
    }

    // 2. Seed Default Portfolios if none exist
    const portfolioCount = await Portfolio.countDocuments();
    if (portfolioCount === 0) {
      console.log('[Seed] Seeding professional portfolios: "Kabir Baweja", "Vijay Devadas", "Kiran"...');

      // -------------------------------------------------------
      // Portfolio 1: Kabir Baweja (Business Development Head)
      // -------------------------------------------------------
      const kabirPortfolio = new Portfolio({
        fullName: 'Kabir Baweja',
        slug: 'Kabirbaweja',
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
        phone: '+91 9717822680',
        location: 'Gurugram, Haryana, India · Hybrid',
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
        skills: buildSkills(
          'Communication, Negotiation, Knowledgable, Problem Solving, Project Management, Data Analysis, Business Development, Working with Investors, Marketing, Presentation Skills, Relationship Building, Client Services, Economic Development, Analytical Skills, Inventory Management, Operations Management, People Management, Supply Chain Management, Real Estate Economics, Microsoft Office, Customer Service, Leadership, Sales, Social Media'
        ),
        experience: [
          {
            jobTitle: 'Sales Business Development',
            company: 'Focus Group (Focus Engineering)',
            employmentType: 'Full-time',
            location: 'Gurugram, Haryana, India · Hybrid',
            startDate: '2024-11',
            isCurrent: true,
            description:
              'Spearhead sales and corporate project delivery for a specialized automotive consulting firm, driving channel strategy, aftermarket profitability, and digital transformation for industry-leading OEMs across India and the GCC region.',
            responsibilities: [
              'Strategic Revenue Generation: Unlock new revenue streams and drive consistent cash flow for global and regional automotive groups by deploying tailor-made consulting frameworks and advanced digital tools.',
              'OEM Portfolio Management: Manage high-impact projects and align complex business outcomes for tier-1 OEMs including MG, BMW, and Maruti, directly optimizing workshop productivity and parts profitability.',
              "Ecosystem Expansion: Act as a strategic partner to corporate clients, building long-term institutional relationships while expanding the firm's commercial footprint in the evolving mobility ecosystem.",
            ],
          },
          {
            jobTitle: 'Real Estate Team Lead',
            company: 'Anaheeta homes',
            employmentType: 'Full-time',
            location: 'Gurugram, Haryana, India · Hybrid',
            startDate: '2022-10',
            endDate: '2025-07',
            isCurrent: false,
            description:
              'Led a dedicated sales team managing end-to-end residential and commercial transactions, leveraging a data-driven approach to optimize investor portfolios.',
            responsibilities: [
              'Portfolio Growth: Personally closed ₹75 Cr+ in high-value deals, managing end-to-end portfolios for HNIs and institutional investors through a prolonged relationship network.',
              'Analytical Advisory: Utilized market research software and data analytics to deliver statistically grounded investment options, resulting in substantial capital growth for clients.',
              'Key Account Management: Acted as a dedicated key account manager, securing high-value repeat business through robust follow-up systems and absolute strategic alignment with client asset goals.',
            ],
          },
          {
            jobTitle: 'Head of Operations',
            company: 'Sarthii India Logistics',
            employmentType: 'Full-time',
            location: 'Gurugram, Haryana, India · Hybrid',
            startDate: '2021-07',
            endDate: '2022-08',
            isCurrent: false,
            description:
              'Directed end-to-end supply chain operations (Point A to Point Z), eliminating efficiency gaps and engineering cross-functional systems to maximize client margins.',
            responsibilities: [
              'Efficiency Milestone: Boosted overall operational efficiency by 25% within 12 months by eliminating structural loopholes and optimizing vendor-client touchpoints.',
              'Revenue & Horizon Expansion: Scaled the client ecosystem by converting new high-value accounts and expanding wallet share from existing corporate clients.',
              'Data-Driven Logistics: Managed multi-vendor networks daily, ensuring frictionless execution, highly productive team allocation, and tight cost control.',
            ],
          },
          {
            jobTitle: 'Head of Operations',
            company: 'DBRCPL',
            employmentType: 'Permanent Full-time',
            location: 'Gurugram, Haryana, India',
            startDate: '2020-04',
            endDate: '2021-06',
            isCurrent: false,
            description:
              'Orchestrated large-scale logistics operations across diverse, high-volume industries including Automotive, FMCG, Dairy, and Infra related goods.',
            responsibilities: [
              'ROI-Driven Route Optimization: Applied advanced analytics to evaluate routes based on wear-and-tear metrics, effort, execution time, and strict financial ROI.',
              'Tailored Fleet Structuring: Developed distinct asset utilization strategies for varying industry loads, ensuring optimal truck configurations and minimal turnaround times for clients.',
              'Team Leadership: Led an 8-member operations team, managing an expansive nationwide network of manufacturers and vendors to maintain peak supply chain productivity.',
            ],
          },
        ],
        education: [
          {
            institution: 'IILM',
            qualification: 'Bachelor of Business Administration - BBA',
            fieldOfStudy: 'Business/Managerial Economics',
            startDate: '2019-08',
            endDate: '2022-06',
          },
          {
            institution: 'Goodman School of Business at Brock University',
            qualification: 'Bachelor of Business Administration - BBA',
            fieldOfStudy: 'Business/Managerial Economics',
            startDate: '2018-08',
            endDate: '2019-07',
          },
        ],
        projects: [],
        certifications: [],
        services: [],
        socialLinks: {
          linkedin: 'https://www.linkedin.com/in/kabir-baweja-84b231163/',
          website: 'https://focusengineeringapp.com',
        },
      });
      // -------------------------------------------------------
      // Portfolio 2: Vijay Devadas (Business Analyst & EA to CEO)
      // -------------------------------------------------------
      const vijayPortfolio = new Portfolio({
        fullName: 'Vijay Devadas',
        slug: 'Vijaydevadas',
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
        phone: '+91 7715055663',
        location: 'Thane, Maharashtra, India · Hybrid',
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
              'Built an automated GST Input Tax Credit (ITC) reconciliation tool using advanced VLOOKUPs and conditional formatting.',
              "Managed digital marketing campaigns to acquire new ROC and GST clients; stabilized backend processes leading to the firm's strategic merger.",
            ],
          },
          {
            jobTitle: 'Deputy Manager',
            company: 'VFS Global',
            employmentType: 'Full-time',
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
      });

      // -------------------------------------------------------
      // Portfolio 3: Kiran (Business Transformation Consultant)
      // -------------------------------------------------------
      const kiranPortfolio = new Portfolio({
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
        email: 'Sales@focusengineering.in',
        phone: '+91 9717822680',
        location: 'Pune District, Maharashtra, India · Hybrid',
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
          linkedin: 'https://www.linkedin.com/in/kiran-k-412aa2208/',

          website: 'https://focusengineeringapp.com',

        },
      });

      await kabirPortfolio.save();
      await vijayPortfolio.save();
      await kiranPortfolio.save();
      console.log('[Seed] Portfolios "Kabir Baweja", "Vijay Devadas", "Kiran" created successfully.');
    } else {
      console.log(`[Seed] Portfolios already exist (${portfolioCount} found).`);
    }

    console.log('[Seed] Database initialization complete.');
  } catch (error: any) {
    console.error(`[Seed] Error during seeding: ${error.message}`);
  }
};

// If run directly via ts-node / node
if (require.main === module) {
  (async () => {
    const connected = await connectDB();
    if (!connected) {
      console.error('\n[Seed Error] Could not connect to MongoDB at: ' + config.mongodbUri);
      console.log('--------------------------------------------------------------------------------');
      console.log('To resolve this:');
      console.log('1. If using local MongoDB: ensure the MongoDB service is running (e.g. net start MongoDB on Windows).');
      console.log('2. If using MongoDB Atlas: paste your Atlas connection URI into server/.env:');
      console.log('   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/focus_portfolios');
      console.log('--------------------------------------------------------------------------------\n');
      process.exit(1);
    }
    await seedDatabase();
    await mongoose.disconnect();
    process.exit(0);
  })();
}