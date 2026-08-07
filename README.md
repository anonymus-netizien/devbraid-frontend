# DevBraid Frontend

React 19 + TypeScript SPA for the DevBraid platform — capturing **why** code changes happen along a
five-step flow:

**Connect → Capture → Analyze → Reason → Publish**

A developer connects a GitHub repo (PAT), creates a Change Thread to capture commits/diffs + decision
notes, runs risk analysis, generates an AI change brief, and publishes it to a GitHub PR after human
approval. Identity and auth are handled by **Clerk**; the app consumes the Spring Boot backend at
[`/api/v1`](https://localhost:8080).

## Tech Stack

| Component        | Technology                                                        |
|------------------|-------------------------------------------------------------------|
| UI Library       | React 19 + TypeScript 5.8                                          |
| Build Tool       | Vite 8 (TanStack Start entry, `tsc -b && vite build`)             |
| Routing          | TanStack Router 1.170 (file-based, type-safe route tree)          |
| Server State     | TanStack React Query 5.101 (queries, mutations, optimistic updates) |
| HTTP Client      | Axios 1.7 (interceptors, Bearer injection, envelope unwrapping)   |
| Styling          | Tailwind CSS 4.2 + DaisyUI 5.7 (dark-only, custom tokens)         |
| Components       | shadcn/ui 4.16 + Radix UI primitives + Vaul + CMK                  |
| Forms            | React Hook Form 7.71 + Zod 3.25                                  |
| Motion           | Framer Motion 12.43 + Lenis 1.3 (smooth scroll)                   |
| Hero FX          | ogl (WebGL — `LineWaves` hero background)                        |
| Charts           | Recharts 2.15                                                      |
| Icons            | Lucide React 0.575                                                 |
| Notifications    | Sonner 2.0                                                         |
| Auth             | Clerk (`@clerk/react` + `@clerk/themes`, dark theme)             |
| API Types        | openapi-typescript (`src/api/generated/schema.d.ts`)               |
| Testing          | Vitest 4 + jsdom (unit/integration)                                |

## Quick Start

```bash
# Prereqs: Node.js 22+, npm, backend running on http://localhost:8080

npm install
cp .env.example .env   # set VITE_CLERK_PUBLISHABLE_KEY (and VITE_API_BASE_URL if non-default)

npm run dev            # Vite dev server (HMR) on http://localhost:5173
```

**Frontend:** `http://localhost:5173` · Backend: `http://localhost:8080` · pgAdmin: `http://localhost:5050`

> No Clerk account? Create a free instance at dashboard.clerk.com and put its publishable key in
> `VITE_CLERK_PUBLISHABLE_KEY`. Signup, sign-in and email OTP live in Clerk — the frontend gets the
> session token, the backend verifies it.

## Scripts

| Command             | Description                          |
| ------------------- | ------------------------------------ |
| `npm run dev`       | Vite dev server (HMR)                |
| `npm run build`     | `tsc -b` + production build          |
| `npm run preview`   | Preview production build             |
| `npm run lint`      | ESLint                               |
| `npm run format`    | Prettier                             |
| `npm run test`      | Vitest (unit/integration)            |
| `npm run api:types` | Regenerate `src/api/generated/schema.d.ts` from OpenAPI |

## Project Structure

```
src/
├── main.tsx             # App root: providers, ClerkGate, router bootstrap
├── api/                 # Axios client, interceptors, envelope helpers
│   └── generated/       # TypeScript types from backend OpenAPI spec
├── services/            # Domain services (auth, github, thread) → backend endpoints
├── context/             # Auth context (Clerk) + NoopAuthProvider fallback
├── hooks/               # Custom hooks (useAuth, useMotion) + query hooks
├── store/               # Global state (client-side)
├── routes/              # File-based TanStack Router routes
│   ├── __root.tsx       # Root layout (auth guards, page shells)
│   ├── index.tsx        # Marketing homepage
│   ├── auth.login*.tsx  # Sign-in (incl. splat for Clerk step paths)
│   └── *.tsx            # Marketing + app-shell pages (threads, briefs, notes…)
├── components/
│   ├── ui/              # Design-system primitives
│   ├── devbraid/        # Feature components (app shell, thread panels, note cards…)
│   └── marketing/       # Landing page blocks (hero, features, docs, pricing…)
├── lib/                 # cn(), formatting, platform helpers
├── types/               # Runtime-shape DTO types (mirror of API DTOs)
└── routeTree.gen.ts     # Auto-generated route tree
```

## Routes

| Route                | Purpose                                                        |
| -------------------- | -------------------------------------------------------------- |
| `/`                  | Marketing landing page                                          |
| `/features`, `/pricing`, `/how-it-works`, `/docs`, `/about` | Marketing sections |
| `/auth/login`        | Clerk sign-in (email OTP)                                      |
| `/auth/register`     | Clerk sign-up                                                  |
| `/dashboard`         | Stats, recent threads, quick actions                           |
| `/threads`           | Change Thread list (search + status filters)                   |
| `/threads/:id`       | Thread detail — Refresh, Analyze, Generate Brief, Publish     |
| `/notes`             | Decision notes across threads                                  |
| `/briefs`            | Change Brief list                                              |
| `/briefs/:id`        | Brief detail (Markdown render)                                 |
| `/connections`       | GitHub PAT connect/disconnect                                  |
| `/settings`          | Profile update                                                 |

## Auth Flow

Clerk owns identity end-to-end (social/email OTP sign-in, sign-up, session).

```
ClerkProvider (isLoaded) → ClerkGate mounts router → queries fire with Bearer session token
        │
        └─ 401 (expired/bounced) → in-SPA redirect to /auth/login?redirect=<current> (no reload)
```

The session token is fetched at request time from Clerk and attached by the Axios request interceptor.
It is never persisted to `localStorage` — nothing sensitive to XSS-exfiltrate.

## Environment Variables

| Variable                     | Default                           | Description                           |
| ---------------------------- | --------------------------------- | ------------------------------------- |
| `VITE_API_BASE_URL`          | `http://localhost:3000/api`       | Backend base URL                        |
| `VITE_APP_ENV`               | `development`                     | App environment flag                    |
| `VITE_CLERK_PUBLISHABLE_KEY` | —                                | Clerk publishable key (matches backend) |

## Docker

```bash
docker compose up --build -d   # nginx-served production build on :3000
```

## Project Docs

- [`API.md`](API.md) — Detailed implementation: architecture, routing, auth plumbing, API client,
  state, components, design system, deployment.