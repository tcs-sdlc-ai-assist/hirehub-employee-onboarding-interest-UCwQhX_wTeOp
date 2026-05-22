# Changelog

All notable changes to the HireHub Onboarding Portal will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-01

### Added

- **Landing Page** with hero section, feature cards highlighting Innovation, Growth, Culture, and Impact, and a call-to-action section linking to the interest form.
- **Candidate Interest Form** (`/apply`) with fields for Full Name, Email, Mobile Number, and Department of Interest.
  - Client-side validation for all fields: required checks, email format, 10-digit mobile number, letters-only full name, and department selection from a predefined list.
  - Duplicate email detection to prevent repeat submissions.
  - Success banner with auto-dismiss after 4 seconds.
  - Error banners for submission failures.
- **Admin Login** (`/admin`) with hardcoded credentials (`admin` / `admin`) for demo purposes.
  - Session-scoped authentication using `sessionStorage` (cleared on tab close).
  - Login error messaging for invalid credentials.
- **Protected Admin Dashboard** accessible only after successful admin login.
  - Summary stat cards displaying total submissions, unique departments count, and latest submission date.
  - Submissions data table with columns for Full Name, Email, Mobile, Department, Submitted On, and Actions.
  - **Edit** functionality via modal dialog allowing updates to Full Name, Mobile Number, and Department (email is read-only).
  - **Delete** functionality with confirmation prompt before removal.
  - Empty state display when no submissions exist.
  - Logout button to end admin session.
- **Responsive Design** with CSS custom properties and breakpoints for tablet (768px) and mobile (480px).
  - Mobile hamburger menu toggle for header navigation.
  - Adaptive grid layouts for feature cards and stat cards.
  - Scrollable data table on smaller screens.
- **Department Badges** with color-coded styling for Engineering, Marketing, Sales, Human Resources, Finance, Operations, Design, Product, Legal, and Support.
- **localStorage Persistence** for candidate submissions using the `hirehub_submissions` key.
  - CRUD operations via `src/utils/storage.js` with graceful error handling and corrupted data recovery.
  - Unique ID generation using `nanoid`.
  - ISO timestamp generation using `dayjs`.
- **sessionStorage Authentication** for admin sessions using the `hirehub_admin_auth` key.
  - Auth utilities via `src/utils/auth.js` with graceful error handling for storage access failures.
- **Form Validation Utilities** (`src/utils/validators.js`) with exported functions for name, email, mobile, and department validation.
  - Exported `ALLOWED_DEPARTMENTS` constant with 10 department options.
- **Client-Side Routing** using React Router v6 with routes for Home (`/`), Apply (`/apply`), and Admin (`/admin`).
- **Header Component** with navigation links, active link highlighting, authentication-aware Login/Logout button, and mobile menu toggle.
- **Vercel Deployment Configuration** (`vercel.json`) with SPA rewrite rules for client-side routing support.
- **Comprehensive Test Suite** using Vitest and React Testing Library.
  - Unit tests for `validators.js` covering all validation rules and edge cases.
  - Unit tests for `storage.js` covering CRUD operations, corrupted data handling, and email duplicate detection.
  - Unit tests for `auth.js` covering login, logout, authentication checks, and storage error handling.
  - Component tests for `Header`, `InterestForm`, and `AdminDashboard` covering rendering, user interactions, and state management.