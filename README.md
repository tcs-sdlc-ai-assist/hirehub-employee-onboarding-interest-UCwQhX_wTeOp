# HireHub Onboarding Portal

HireHub is a client-side onboarding interest portal built with React. It allows candidates to express their interest in joining the organization by submitting a simple form, and provides an admin dashboard for reviewing and managing submissions.

All data is stored locally in the browser — no backend or database is required.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Development](#development)
  - [Production Build](#production-build)
- [Usage](#usage)
  - [Candidate Flow](#candidate-flow)
  - [Admin Flow](#admin-flow)
- [Testing](#testing)
- [Deployment](#deployment)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## Features

- **Landing Page** with hero section, feature cards (Innovation, Growth, Culture, Impact), and call-to-action linking to the interest form.
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
- **localStorage Persistence** for candidate submissions.
- **sessionStorage Authentication** for admin sessions.
- **Comprehensive Test Suite** using Vitest and React Testing Library.

---

## Tech Stack

| Technology       | Purpose                                      |
| ---------------- | -------------------------------------------- |
| React 18+        | UI component library                         |
| Vite             | Build tool and development server             |
| React Router v6  | Client-side routing                           |
| Plain CSS        | Styling with CSS custom properties            |
| nanoid           | Unique ID generation for submissions          |
| dayjs            | Date formatting and comparison                |
| prop-types       | Runtime prop type checking for components     |
| Vitest           | Test runner                                   |
| React Testing Library | Component testing utilities              |

---

## Folder Structure

```
hirehub-onboarding-portal/
├── index.html                  # HTML entry point
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
├── vitest.config.js            # Vitest configuration
├── vercel.json                 # Vercel SPA rewrite rules
├── .env.example                # Example environment variables
├── public/
│   └── favicon.ico             # Favicon
├── src/
│   ├── main.jsx                # React DOM entry point
│   ├── App.jsx                 # Root component with routing
│   ├── App.css                 # Global styles and CSS custom properties
│   ├── components/
│   │   ├── Header.jsx          # Navigation header with mobile menu
│   │   ├── LandingPage.jsx     # Home page with hero and features
│   │   ├── InterestForm.jsx    # Candidate interest form
│   │   ├── ProtectedRoute.jsx  # Auth gate for admin routes
│   │   ├── AdminLogin.jsx      # Admin login form
│   │   ├── AdminDashboard.jsx  # Admin dashboard with stats and table
│   │   ├── SubmissionTable.jsx # Submissions data table
│   │   └── EditModal.jsx       # Edit submission modal dialog
│   ├── utils/
│   │   ├── auth.js             # Session management (sessionStorage)
│   │   ├── storage.js          # CRUD operations (localStorage)
│   │   └── validators.js       # Form validation functions
│   └── tests/
│       ├── setup.js            # Test setup (jest-dom matchers)
│       ├── auth.test.js        # Auth utility tests
│       ├── storage.test.js     # Storage utility tests
│       ├── validators.test.js  # Validator utility tests
│       ├── Header.test.jsx     # Header component tests
│       ├── InterestForm.test.jsx # Interest form component tests
│       └── AdminDashboard.test.jsx # Admin dashboard component tests
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later (bundled with Node.js)

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd hirehub-onboarding-portal
npm install
```

### Development

Start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (default Vite port).

### Production Build

Build the application for production:

```bash
npm run build
```

This generates a `dist/` directory containing the static assets ready for deployment.

To preview the production build locally:

```bash
npm run preview
```

---

## Usage

### Candidate Flow

1. Visit the **Home** page (`/`) to learn about HireHub and why to join.
2. Click **"Express Your Interest"** or navigate to **Apply** (`/apply`).
3. Fill out the form with your Full Name, Email, Mobile Number, and Department of Interest.
4. Click **Submit**. On success, a green banner confirms your submission.
5. The form resets automatically so another candidate can submit.

**Validation rules:**

| Field                  | Rules                                                        |
| ---------------------- | ------------------------------------------------------------ |
| Full Name              | Required. Letters and spaces only. Max 100 characters.       |
| Email                  | Required. Must be a valid email format. No duplicate emails. |
| Mobile Number          | Required. Exactly 10 digits.                                 |
| Department of Interest | Required. Must be one of the 10 predefined departments.      |

### Admin Flow

1. Navigate to **Admin** (`/admin`).
2. Log in with the demo credentials:
   - **Username:** `admin`
   - **Password:** `admin`
3. View the **Admin Dashboard** with summary statistics and a table of all submissions.
4. **Edit** a submission by clicking the Edit button — update Full Name, Mobile Number, or Department (email is read-only).
5. **Delete** a submission by clicking the Delete button and confirming the prompt.
6. Click **Logout** to end the admin session.

> **Note:** Admin authentication uses `sessionStorage` and is scoped to the current browser tab. Opening a new tab or closing the browser requires re-login. This is by design for demo purposes.

---

## Testing

Run the full test suite:

```bash
npm test
```

This executes all tests using [Vitest](https://vitest.dev/) with [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/) and [jsdom](https://github.com/jsdom/jsdom) as the test environment.

**Test coverage includes:**

- **Unit tests** for `validators.js` — all validation rules and edge cases.
- **Unit tests** for `storage.js` — CRUD operations, corrupted data handling, and email duplicate detection.
- **Unit tests** for `auth.js` — login, logout, authentication checks, and storage error handling.
- **Component tests** for `Header` — rendering, navigation links, auth state, and mobile menu toggle.
- **Component tests** for `InterestForm` — form rendering, validation errors, duplicate email detection, successful submission, and success banner auto-dismiss.
- **Component tests** for `AdminDashboard` — stat cards, submission table, edit modal, delete confirmation, and logout.

---

## Deployment

This project is configured for deployment to [Vercel](https://vercel.com/) as a static single-page application.

### Quick Deploy

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Import the repository into Vercel.
3. Vercel auto-detects Vite and deploys with the correct settings.

### SPA Routing

The `vercel.json` file includes a rewrite rule that serves `index.html` for all routes, ensuring client-side routing works correctly for direct navigation and page refreshes:

```json
{
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Other Platforms

| Platform                | SPA Fallback Configuration                                                    |
| ----------------------- | ----------------------------------------------------------------------------- |
| **Vercel**              | `vercel.json` with rewrites (included)                                        |
| **Netlify**             | Add `public/_redirects` file with: `/* /index.html 200`                       |
| **GitHub Pages**        | Use a custom 404.html that redirects to index.html, or use HashRouter         |
| **AWS S3 + CloudFront** | Configure CloudFront custom error response to serve `index.html` for 404s     |
| **Firebase Hosting**    | Add rewrite rule in `firebase.json`                                           |

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

---

## Environment Variables

This is a **client-side-only** application. No environment variables are required.

All application data is stored in the browser:

- **Candidate submissions** → `localStorage` (key: `hirehub_submissions`)
- **Admin session** → `sessionStorage` (key: `hirehub_admin_auth`)

An optional variable is available for customization:

| Variable         | Default   | Description                  |
| ---------------- | --------- | ---------------------------- |
| `VITE_APP_TITLE` | `HireHub` | Application title (optional) |

See [.env.example](./.env.example) for reference.

---

## License

This project is private and proprietary.