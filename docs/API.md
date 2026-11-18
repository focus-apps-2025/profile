# FOCUS Engineering Portfolio Platform — API Documentation

Base URL: `/api/v1`

All responses follow a consistent JSON format:
```json
{
  "success": true,
  "data": {},
  "message": "Optional feedback message"
}
```

---

## 1. Authentication Endpoints

### 1.1 Admin Login
- **Endpoint**: `POST /api/v1/auth/login`
- **Rate Limit**: 10 requests / 15 minutes
- **Request Body**:
  ```json
  {
    "email": "admin@focusengineering.com",
    "password": "AdminSecure2026!"
  }
  ```
- **Response**: `200 OK`
  - Sets HTTP-only, SameSite cookie `focus_admin_token`
  - Returns user profile data and JWT token

### 1.2 Admin Logout
- **Endpoint**: `POST /api/v1/auth/logout`
- **Response**: `200 OK`
  - Clears `focus_admin_token` cookie

### 1.3 Get Current Admin Session
- **Endpoint**: `GET /api/v1/auth/me`
- **Headers**: Cookie or `Authorization: Bearer <token>`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "user": {
        "id": "64f128...",
        "email": "admin@focusengineering.com",
        "name": "FOCUS System Administrator",
        "role": "superadmin"
      }
    }
  }
  ```

---

## 2. Admin Portfolio Management Endpoints

All endpoints below require administrator authentication.

### 2.1 List Portfolios
- **Endpoint**: `GET /api/v1/admin/portfolios`
- **Query Parameters**:
  - `page` (default 1)
  - `limit` (default 10)
  - `search` (searches fullName, title, role, slug)
  - `status` (`published`, `draft`, `disabled`)
  - `role`
  - `sortBy` (default `createdAt`)
  - `sortOrder` (`asc`, `desc`)
- **Response**: `200 OK`

### 2.2 Create Portfolio
- **Endpoint**: `POST /api/v1/admin/portfolios`
- **Request Body**: Validated via Zod (`createPortfolioSchema`)
- **Response**: `201 Created`

### 2.3 Get Portfolio by ID
- **Endpoint**: `GET /api/v1/admin/portfolios/:id`
- **Response**: `200 OK` / `404 Not Found`

### 2.4 Update Portfolio
- **Endpoint**: `PATCH /api/v1/admin/portfolios/:id`
- **Response**: `200 OK` (automatically preserves old slug in `slugHistory` if slug was modified)

### 2.5 Delete Portfolio
- **Endpoint**: `DELETE /api/v1/admin/portfolios/:id`
- **Response**: `200 OK`

### 2.6 Toggle Publish Status
- **Endpoint**: `PATCH /api/v1/admin/portfolios/:id/publish`
- **Response**: `200 OK` (toggles between `published` and `draft`)

### 2.7 Update Status
- **Endpoint**: `PATCH /api/v1/admin/portfolios/:id/status`
- **Request Body**: `{ "status": "draft" | "published" | "disabled" }`
- **Response**: `200 OK`

### 2.8 Check Slug Availability
- **Endpoint**: `GET /api/v1/admin/portfolios/check-slug?slug=dj&currentId=...`
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "available": true,
      "normalized": "dj"
    }
  }
  ```

---

## 3. Media & Upload Endpoints

### 3.1 Upload File
- **Endpoint**: `POST /api/v1/admin/upload`
- **Headers**: `Content-Type: multipart/form-data`
- **Body**: `file` (JPG, PNG, WEBP, SVG, GIF, PDF max 10MB)
- **Response**: `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "filename": "profile-169839482.webp",
      "url": "/uploads/profile-169839482.webp"
    }
  }
  ```

---

## 4. Public Endpoints (Read-Only)

### 4.1 Get Public Portfolio by Slug
- **Endpoint**: `GET /api/v1/public/portfolios/:slug`
- **Response**: `200 OK` (sanitized public JSON representation)
  - Returns `404` for drafts or unknown slugs
  - Returns `403` for disabled portfolios
  - Returns `redirectSlug` if resolved via `slugHistory`

### 4.2 Get Public Directory
- **Endpoint**: `GET /api/v1/public/portfolios`
- **Query Parameters**:
  - `search`
  - `role`
  - `featured` (boolean)
- **Response**: `200 OK` (lists published profiles with `showInDirectory: true`)

### 4.3 Submit Contact Inquiry
- **Endpoint**: `POST /api/v1/public/contact`
- **Rate Limit**: 10 submissions / hour
- **Request Body**:
  ```json
  {
    "portfolioSlug": "manoj",
    "senderName": "Sarah Jenkins",
    "senderEmail": "sarah@industrial.com",
    "subject": "Platform Architecture Consulting",
    "message": "We would like to consult on our distributed monitoring pipeline."
  }
  ```
- **Response**: `201 Created`
