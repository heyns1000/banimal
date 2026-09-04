# Banimal — Store Integration Platform

Banimal is a full-stack integration platform built on Mocha that powers WooCommerce storefronts with multi-tier brand management, order fulfillment, and ecosystem-wide configuration. It combines a React frontend (TypeScript), Cloudflare Workers backend, WordPress plugin connector, and a unified Brand Guide system for consistent visual and operational rules across the ecosystem.

## Stack

- **Languages:** TypeScript (80.4%), PHP (8.9%), HTML, JavaScript, Python, CSS
- **Frontend:** React 19 + React Router 7, Vite build system, Tailwind CSS
- **Backend:** Hono 4.13 on Cloudflare Workers (TypeScript), Cloudflare D1 database, R2 storage
- **Plugin:** WordPress plugin (PHP) — `banimal-ecosystem-connector` v5.1.0
- **Notable libraries:** Zod (validation), Chart.js (analytics), Lucide icons, Mocha platform integration (@getmocha/vite-plugins, @getmocha/users-service)

## How it's organized

```
src/
  react-app/         React frontend (TypeScript) — multi-page store UI
    pages/           Route handlers (Home, Api Docs, Integrations, Ecosystem, etc.)
    components/      Reusable UI components
    contexts/        React Context providers
  worker/            Cloudflare Workers backend (TypeScript)
    index.ts         Main Hono app with API routes
    routes/          Handler modules (licenses, auth, delivery, orders, wp-bridge, brand-guide, etc.)
  shared/            Shared types and utilities across front/back
wordpress-plugin/
  banimal-ecosystem-connector/    WordPress plugin (PHP) v5.1.0
    includes/        Plugin core logic, brand alignment module (class-brand-guide.php)
    bin/             Build scripts
    readme.txt       Plugin metadata
docs/
  brand/ci-guide.html           Sam Fox™ Core CI Guide (verified palette, fox-head rules, typography)
  brand/banimal-connector-icons.html   Fox icon renders across all 9 palette colors
  atlas/seedwave-atlas.html     Ecosystem index of all systems, workers, plugins
  manual/user-manual.html       Step-by-step setup, API reference, roadmap
test/                Unit tests (Vitest)
migrations/          Database schema (D1)
scripts/             Dev utilities (brand verification, palette generation)
```

**How it fits together:**  
The React app loads at `https://banimal.vercel.app` and communicates with the Cloudflare Worker backend at `/api/*`. The Worker routes requests to domain-specific handlers: `/api/wp` bridges signed events from the WordPress plugin (which never calls Paystack/BobGo/GitHub directly), `/api/orders` syncs WooCommerce orders, `/api/brand-guide` serves the single-source-of-truth Brand Guide to the WordPress plugin's CSS custom properties module and any other brand consumers. The Worker also manages license issuance, authentication, analytics, and notification delivery. The Sam Fox™ CI Guide (core brand rules) is machine-readable at `/api/brand-guide` and human-readable in `docs/brand/ci-guide.html`.

## How to run it

**Development:**
```bash
npm install
npm run dev       # Start Vite dev server (http://localhost:5173)
```

**Build and deploy:**
```bash
npm run build              # TypeScript + Vite build (produces dist/)
npm run check              # Type check + build + dry-run Worker deploy
wrangler deploy            # Deploy Worker to Cloudflare
```

**Scripts:**
```bash
npm run lint                        # ESLint
npm test                            # Vitest (unit tests)
npm run test:watch                  # Vitest watch mode
npm run brand:verify                # Verify brand alignment against CI Guide
npm run brand:generate-palette      # Generate palette assets
npm run plugin:verify-version       # Verify WordPress plugin version
npm run plugin:build                # Build WordPress plugin zip
npm run cf-typegen                  # Generate Cloudflare Worker types
```

**Environment:**  
Copy `.dev.vars.example` to `.dev.vars` and fill in secrets (Paystack API keys, BobGo credentials, etc.). The Worker binds to D1 database and R2 storage via `wrangler.json`.

## Key features

- **Multi-tier brand management:** Organize brands by system and tier; webhook ingestion at `/api/webhook/brands`
- **Order fulfillment:** WooCommerce ↔ Worker sync via signed plugin events
- **License vault:** Secure license issuance and validation
- **Authentication:** JWT-based auth routes
- **Analytics & reporting:** Charts and ecosystem dashboard
- **Brand Guide automation:** Machine-readable CI rules pull into WordPress theme as CSS custom properties
- **Global deployment:** Vercel frontend + Cloudflare Worker edge

## Try asking

- What pages and routes are included in the React app, and which one serves as the integration entry point?
- How does the WordPress plugin communicate with the Worker, and why is the `/api/wp` bridge the only path the plugin has into it?
- Where is the Sam Fox™ Brand Guide defined in code, and how is it served to brand consumers like the WordPress plugin?
