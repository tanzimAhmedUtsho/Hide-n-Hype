# HIDE N HYPE ⚡

Welcome to the official repository of **HIDE N HYPE** (Est. 2026), a premium, high-performance e-commerce platform custom-built for modern streetwear and lifestyle fashion branding.

## 🎨 Core Architecture & User Experience (UX)

Designed via precision prototyping and engineered for seamless interaction:

- **Premium Dark Aesthetics:** A sleek, high-end dark-themed visual layout optimized for modern apparel.
- **Intelligent Navigation & Hover Micro-interactions:**
- **Dynamic Hover Dropdowns:** Interactive desktop navigation links (`Men`, `Women`, `Kids`, `Accessories`, `Leather Items`) that trigger smoothly upon hover and auto-collapse on cursor departure.

## 🛠️ Tech Stack & Engineering

### Frontend Ecosystem

- **Core Framework:** React 18+ (TypeScript architecture)
- **Build Pipeline:** Vite (Next-generation compilation engine)
- **Styling Runtime:** Tailwind CSS (Utility-first styling grid)
- **Motion Graphics:** Framer Motion (`motion/react`) for production-grade fluid interface transitions

### Core Architecture Utilities

- **State Engines & Libraries:** Lucide React (Icon graph primitives), React Slick (Carousel controllers), Recharts (Data visualization graphs)
- **Package Architecture:** Monorepo/Workspace compliant driven by `pnpm`

## 💻 Local Development Setup

Get your server up and running locally in less than a minute.

### 1. Prerequisites

Ensure you have Node.js and **pnpm** installed globally. If you don't have `pnpm`, run:

```bash
npm install -g pnpm

  ## Running the code

 pnpm run dev

```

## CMS Admin (Next.js)

The existing public storefront remains on Vite + React + TypeScript. A separate Next.js App Router application lives in `admin/` and runs alongside it.

1. Install the repository dependencies with `pnpm install`.
2. Run `pnpm.cmd admin:dev`. On first run, a setup prompt asks for your MongoDB Atlas URI (hidden while typing), verifies it, and saves it to the ignored `admin/.env.local`. It also creates an owner login if one is not already configured.
3. Open `http://localhost:3000/admin` and sign in with the email and password you entered. Later starts only need `pnpm.cmd admin:dev`.
4. To run the public storefront at the same time, open a second terminal and run `pnpm.cmd dev`. For newsletter and order forms, copy root `.env.example` to `.env.local`; keep `VITE_CMS_API_URL=http://localhost:3000` locally. For deployment, set this to the reachable CMS URL and set `STOREFRONT_ORIGIN` in `admin/.env.local` to the storefront's exact origin.

The admin includes a dashboard, searchable and paginated content tables, CRUD forms for catalog/content/commerce collections, image uploads (JPG/PNG/WebP/GIF, 5 MB maximum), subscriber CSV export, session-protected API routes, and admin sign-in. Passwords use salted scrypt hashes. CMS records are stored in MongoDB Atlas and uploaded images in GridFS. The initial owner is created from the environment values when the database is empty; additional active admin accounts can be created in the panel with owner, editor, or orders manager roles. Role checks are enforced by the server API. Legacy JSON records are imported automatically on first database startup. An existing local SQLite database is imported once when the CMS starts.

The homepage newsletter form now saves subscriptions to the CMS database. The bag panel submits product enquiries, which appear as pending orders in the admin. The storefront currently has no cart checkout or payment processor, so an enquiry is not a paid or confirmed order. The Vite site calls `VITE_CMS_API_URL` (see root `.env.example`); set this to the reachable CMS URL for local or deployed use. Set `STOREFRONT_ORIGIN` in `admin/.env.local` to the public site's origin for cross-origin form requests. Newsletter and order endpoints validate inputs, limit request rates, and restrict browser origins.

Keep `admin/.env.local` private; it contains the MongoDB connection string and admin session secret. The storefront reads published products from the CMS public API, and newsletter subscriptions and order enquiries are saved to the same MongoDB database.

### Deploying the CMS alongside the Vercel storefront

The storefront and CMS are separate applications. `render.yaml` defines a Render web service for the Next.js CMS. Create a Render Blueprint from this repository and provide `DATABASE_URL` using your MongoDB Atlas application user, plus `ADMIN_EMAIL` and `ADMIN_PASSWORD_HASH`. Generate a password hash locally with `node admin/scripts/hash-password.mjs "your-password"` (use a password of at least 12 characters). Render generates `ADMIN_SESSION_SECRET` for the service. Use an Atlas user restricted to read/write access on the `hidenhype` database and allow the Render service to connect in Atlas Network Access.

After the CMS service is live, set `VITE_CMS_API_URL` in the Vercel storefront production environment to the Render service URL, then redeploy the storefront. Sign in at the Render service `/admin` address and add products there. Local and hosted MongoDB data are separate; an existing local SQLite database is imported once when the CMS starts against the configured Atlas database.
