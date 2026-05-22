# Deployment Guide

This document covers deploying the HireHub Onboarding Portal to **Vercel** as a static single-page application (SPA).

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [Build Configuration](#build-configuration)
- [Vercel Deployment](#vercel-deployment)
  - [Option 1: Deploy from Git (Recommended)](#option-1-deploy-from-git-recommended)
  - [Option 2: Deploy via Vercel CLI](#option-2-deploy-via-vercel-cli)
- [SPA Rewrite Configuration](#spa-rewrite-configuration)
- [Environment Variables](#environment-variables)
- [CI/CD Auto-Deploy](#cicd-auto-deploy)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm v9 or later (bundled with Node.js)
- A [Vercel](https://vercel.com/) account (free tier is sufficient)
- (Optional) [Vercel CLI](https://vercel.com/docs/cli) installed globally: `npm i -g vercel`

---

## Build Configuration

The project uses **Vite** as its build tool. The relevant settings are defined in `vite.config.js`:

| Setting          | Value   |
| ---------------- | ------- |
| Build command    | `npm run build` |
| Output directory | `dist/` |
| Framework        | Vite + React |

To build locally:

```bash
# Install dependencies
npm install

# Run the production build
npm run build
```

This generates a `dist/` directory containing the static assets ready for deployment.

To preview the production build locally:

```bash
npm run preview
```

---

## Vercel Deployment

### Option 1: Deploy from Git (Recommended)

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).

2. Log in to [Vercel](https://vercel.com/) and click **"Add New Project"**.

3. Import your Git repository.

4. Vercel will auto-detect the Vite framework. Verify the following settings:

   | Setting              | Value            |
   | -------------------- | ---------------- |
   | **Framework Preset** | Vite             |
   | **Build Command**    | `npm run build`  |
   | **Output Directory** | `dist`           |
   | **Install Command**  | `npm install`    |

5. Click **"Deploy"**. Vercel will install dependencies, run the build, and deploy the static output.

6. Once complete, Vercel provides a production URL (e.g., `https://your-project.vercel.app`).

### Option 2: Deploy via Vercel CLI

1. Install the Vercel CLI globally if you haven't already:

   ```bash
   npm i -g vercel
   ```

2. From the project root, run:

   ```bash
   vercel
   ```

3. Follow the interactive prompts:
   - Link to an existing project or create a new one.
   - Confirm the build settings (build command: `npm run build`, output directory: `dist`).

4. For production deployment:

   ```bash
   vercel --prod
   ```

---

## SPA Rewrite Configuration

This project uses client-side routing via React Router. All routes (e.g., `/apply`, `/admin`) are handled in the browser — there are no server-side route handlers.

The `vercel.json` file at the project root configures Vercel to rewrite all requests to `index.html`, ensuring that deep links and page refreshes work correctly:

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

**How it works:**

- When a user navigates directly to `https://your-app.vercel.app/apply`, Vercel serves `index.html` instead of returning a 404.
- React Router then reads the URL path (`/apply`) and renders the correct component (`InterestForm`).
- Static assets (JS, CSS, images in `dist/assets/`) are served normally because Vercel resolves existing files before applying rewrites.

> **Important:** Do not remove or modify `vercel.json` unless you understand the impact on client-side routing. Without this rewrite rule, any direct navigation to a route other than `/` will result in a 404 error.

---

## Environment Variables

This is a **client-side-only** application. **No environment variables are required** for deployment.

All application data is stored in the browser:

- **Candidate submissions** → `localStorage` (key: `hirehub_submissions`)
- **Admin session** → `sessionStorage` (key: `hirehub_admin_auth`)

### Optional Variables

If you need to customize the app title or add future configuration, Vite exposes variables prefixed with `VITE_` to the client bundle via `import.meta.env`:

| Variable         | Default    | Description                  |
| ---------------- | ---------- | ---------------------------- |
| `VITE_APP_TITLE` | `HireHub`  | Application title (optional) |

To set environment variables on Vercel:

1. Go to your project's **Settings** → **Environment Variables**.
2. Add the variable name (e.g., `VITE_APP_TITLE`) and value.
3. Select the environments (Production, Preview, Development) where it should apply.
4. Redeploy for changes to take effect.

> **Note:** Since `VITE_*` variables are embedded at build time, you must redeploy after changing them. They are **not** runtime variables.

See `.env.example` for reference.

---

## CI/CD Auto-Deploy

When you deploy via Git integration (Option 1), Vercel automatically sets up CI/CD:

### Production Deploys

- Every push to the **main** (or **master**) branch triggers a production deployment.
- The production URL remains stable across deployments.

### Preview Deploys

- Every push to a **non-production branch** (e.g., feature branches) creates a unique preview deployment.
- Every **pull request** gets its own preview URL for testing.
- Preview URLs follow the pattern: `https://your-project-<hash>.vercel.app`.

### Running Tests in CI

Vercel does not run tests by default. To run tests before deployment, you can:

1. **Override the build command** in Vercel project settings:

   ```
   npm run test && npm run build
   ```

   This ensures the build fails if any tests fail.

2. **Use a separate CI pipeline** (e.g., GitHub Actions) that runs `npm run test` on every push or pull request, independent of Vercel.

   Example GitHub Actions workflow (`.github/workflows/test.yml`):

   ```yaml
   name: Tests
   on: [push, pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-node@v4
           with:
             node-version: 18
             cache: npm
         - run: npm ci
         - run: npm run test
   ```

### Branch Configuration

To change which branch triggers production deploys:

1. Go to your Vercel project **Settings** → **Git**.
2. Update the **Production Branch** field.

---

## Troubleshooting

### 404 errors on page refresh or direct navigation

**Symptom:** Navigating directly to `/apply` or `/admin` (or refreshing the page on those routes) returns a 404 page.

**Cause:** The hosting platform is looking for a file at `/apply/index.html` which doesn't exist. The app is a single-page application — all routes must be served by `/index.html`.

**Solution:** Ensure `vercel.json` is present in the project root with the SPA rewrite rule:

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

If deploying to a platform other than Vercel, configure an equivalent rewrite/fallback rule.

---

### Build fails with missing dependencies

**Symptom:** `npm run build` fails with `Cannot find module` errors.

**Solution:**

1. Delete `node_modules/` and `package-lock.json`.
2. Run `npm install` to regenerate them.
3. Run `npm run build` again.

```bash
rm -rf node_modules package-lock.json
npm install
npm run build
```

---

### Blank page after deployment

**Symptom:** The deployed site loads but shows a blank white page.

**Possible causes and solutions:**

1. **Console errors:** Open the browser developer tools (F12) and check the Console tab for JavaScript errors.

2. **Asset paths:** Ensure `vite.config.js` does not have a `base` property set incorrectly. For root-level deployment on Vercel, no `base` configuration is needed (it defaults to `/`).

3. **Missing root element:** Verify that `index.html` contains `<div id="root"></div>` and that `src/main.jsx` targets `document.getElementById('root')`.

---

### Admin login not persisting

**Symptom:** Admin session is lost when opening a new tab or after closing the browser.

**This is expected behavior.** Admin authentication uses `sessionStorage`, which is scoped to the current browser tab and cleared when the tab is closed. This is by design for demo purposes.

- **Same tab navigation:** Session persists.
- **New tab:** Requires re-login.
- **Browser close/reopen:** Requires re-login.

---

### Candidate submissions not appearing in the dashboard

**Symptom:** Submissions made on the `/apply` page don't show up in the admin dashboard.

**Possible causes:**

1. **Different browsers or devices:** Submissions are stored in `localStorage`, which is browser-specific. Submissions made in Chrome won't appear in Firefox.

2. **Cleared browser data:** If the user cleared their browsing data (including local storage), all submissions are lost.

3. **Corrupted data:** If `localStorage` data under the key `hirehub_submissions` becomes corrupted, the application automatically resets it to an empty array. Check the browser console for warning messages.

---

### Deploying to platforms other than Vercel

While this project is configured for Vercel, it can be deployed to any static hosting platform. Key requirements:

| Platform         | SPA Fallback Configuration                                                |
| ---------------- | ------------------------------------------------------------------------- |
| **Vercel**       | `vercel.json` with rewrites (included in this project)                    |
| **Netlify**      | Add `public/_redirects` file with: `/* /index.html 200`                   |
| **GitHub Pages** | Use a custom 404.html that redirects to index.html, or use HashRouter     |
| **AWS S3 + CloudFront** | Configure CloudFront custom error response to serve `index.html` for 404s |
| **Firebase Hosting** | Add rewrite rule in `firebase.json`: `"rewrites": [{"source": "**", "destination": "/index.html"}]` |

For all platforms, the build output is the `dist/` directory produced by `npm run build`.