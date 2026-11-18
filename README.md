# FOCUS Engineering — Premium Multi-User Portfolio Platform

A complete, production-ready, multi-user portfolio management web application for **FOCUS Engineering**.

The platform allows an administrator to manage multiple professional engineering portfolios from a centralized dashboard. Every team member has an individual, publicly accessible portfolio via a dynamic URL path without manual frontend pages, folders, or redeployments.

---

## Example Dynamic URLs

- **Main Website / Talent Directory**: `https://portfolio.focusengineeringapp.com/` (or `http://localhost:5173/`)
- **Manoj's Portfolio** (Classic Corporate Template): `https://portfolio.focusengineeringapp.com/manoj`
- **DJ's Portfolio** (Modern Professional Template): `https://portfolio.focusengineeringapp.com/dj`
- **Admin Management Console**: `https://portfolio.focusengineeringapp.com/admin`

---

## Visual Identity & Color Palette

- **Primary Navy**: `#123B7A`
- **Primary Blue**: `#2563EB`
- **Deep Navy**: `#0B1F3A`
- **Light Blue**: `#DBEAFE`
- **Background**: `#FFFFFF`
- **Secondary Background**: `#F5F8FC`
- **Primary Text**: `#172B4D`
- **Secondary Text**: `#64748B`
- **Borders**: `#E2E8F0`

---

## Key Features

1. **Dynamic URL Routing (`/:slug`)**:
   - Normalized, lowercase, URL-safe slugs with unique database indexing.
   - Reserved route protection (`admin`, `api`, `login`, `register`, `assets`, etc.).
   - Slug history tracking for automatic 301/client-side redirects when a slug is renamed.

2. **Dual Portfolio Templates**:
   - **Template A — Classic Corporate**: White background, bold navy headings, structured experience & education timelines, designed for technical leads and executives (e.g., Manoj).
   - **Template B — Modern Professional**: Expressive hero, modern project showcase cards, interactive skill filters, services capabilities, designed for full-stack and mobile developers (e.g., DJ).
   - Seamless template toggling without duplicating or altering profile data.

3. **Centralized Admin Dashboard**:
   - Real database statistics (total, published, draft, disabled, inquiries).
   - Search by name, role, or slug.
   - Status filters, sorting, and pagination.
   - Quick one-click publish/unpublish toggling.
   - One-click copy of public URL to clipboard with live toast feedback.
   - Delete confirmation dialog.

4. **Interactive Portfolio Builder**:
   - Multi-step structured tab navigation:
     1. Basic & Personal Identity (name, title, category, bio, contact).
     2. Company Affiliation & Media (file uploads via Multer or direct URLs).
     3. Skills Matrix (with category and proficiency level tags).
     4. Career Experience & Education (bulleted responsibilities, dates, current role).
     5. Projects Showcase (technologies tags, live links, repository links).
     6. Template selection & publication controls.

5. **Security & Production Hardening**:
   - Secure HTTP-only SameSite cookies + JWT bearer support.
   - Password hashing with bcrypt.
   - Zod request validation across all endpoints.
   - Login rate limiting and contact form rate limiting (`express-rate-limit`).
   - HTTP security headers with Helmet.
   - Sanitized public serializers (`toPublicJSON()`) that never leak sensitive administrative data.

---

## Project Structure

```
profile/
├── client/                     # Frontend (React 18, Vite, TypeScript, Tailwind)
│   ├── src/
│   │   ├── components/common/  # Navbar, Footer, ProtectedRoute, DynamicMeta
│   │   ├── context/            # AuthContext
│   │   ├── features/portfolio/ # ClassicCorporateTemplate, ModernProfessionalTemplate, ContactSection
│   │   ├── pages/              # LandingPage, DynamicPortfolioPage, Admin pages
│   │   ├── routes/             # AppRoutes
│   │   ├── services/           # Axios api client
│   │   ├── types/              # TypeScript interfaces
│   │   └── index.css           # Tailwind directives & design tokens
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── server/                     # Backend (Node.js, Express, TypeScript, Mongoose)
│   ├── src/
│   │   ├── config/             # Environment & MongoDB connection
│   │   ├── controllers/        # Auth, Portfolio, Public, Stats, Upload controllers
│   │   ├── middleware/         # Auth, Upload (Multer), Error handling
│   │   ├── models/             # Admin, Portfolio, Inquiry schemas
│   │   ├── routes/             # Versioned REST API (/api/v1)
│   │   ├── services/           # Database seed service
│   │   ├── utils/              # Slug normalization & reserved words
│   │   ├── validators/         # Zod schemas
│   │   └── server.ts           # Server entry point
│   ├── uploads/                # Local uploaded media storage
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   ├── DEPLOYMENT.md           # Ubuntu VPS, Nginx, PM2 & SSL runbook
│   ├── API.md                  # REST API specification
│   └── nginx-portfolio.conf    # Production Nginx reverse-proxy configuration
├── ecosystem.config.js         # PM2 cluster configuration
├── package.json                # Root monorepo workspace scripts
└── README.md
```

---

## Quick Start (Local Development)

### 1. Prerequisites
- Node.js 18+ or 20+
- MongoDB installed and running on `localhost:27017`

### 2. Install Dependencies
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Seed Database & Run
```bash
# In the server directory:
npm run seed     # Seeds superadmin and sample portfolios (dj & manoj)
npm run dev      # Starts Express server on http://localhost:5000

# In another terminal (client directory):
npm run dev      # Starts Vite dev server on http://localhost:5173
```

---

## Pre-Configured Administrator Credentials

- **Email**: `admin@focusengineering.com`
- **Password**: `AdminSecure2026!`
- **Role**: `superadmin`
- **Login URL**: `http://localhost:5173/admin/login`

---

## Production Deployment Runbook

See [docs/DEPLOYMENT.md](file:///c:/Users/Prasanna/Desktop/profile/docs/DEPLOYMENT.md) for complete Ubuntu VPS, Nginx, SSL Certbot, PM2, and backup instructions.
