# DevBraid Frontend

React 19 + TypeScript SPA for the DevBraid platform — capturing **why** code changes happen.

## Prerequisites

- **Node.js 22+** and npm
- **Docker** (optional, for containerized deployment)
- Backend running on `http://localhost:8080`

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (Vite HMR on port 5173)
npm run dev

# Build for production
npm run build

# Lint
npm run lint
```

## Tech Stack

| Component | Technology |
|-----------|-----------|
| UI Library | React 19.2 |
| Language | TypeScript 5.8 |
| Build Tool | Vite 8 |
| Routing | TanStack Router 1.170 (file-based) |
| Server State | TanStack React Query 5.101 |
| HTTP Client | Axios 1.7 (interceptors, auto-refresh) |
| Styling | Tailwind CSS 4.2 + DaisyUI 5.7 |
| Components | shadcn/ui 4.16 + Radix UI primitives |
| Forms | React Hook Form 7.71 + Zod 3.25 |
| Animations | Framer Motion 12.43 |
| Charts | Recharts 2.15 |
| Icons | Lucide React 0.575 |
| Notifications | Sonner 2.0 |

## Project Structure

```
src/
├── api/
│   ├── axios.ts          # Axios instance + request/response interceptors
│   └── token.ts          # In-memory token storage (XSS-safe)
├── services/
│   ├── auth.service.ts   # Auth API (login, register, OTP, profile, password)
│   ├── github.service.ts # GitHub API (connect, repos, branches)
│   └── thread.service.ts # Threads + Notes + Briefs API
├── context/
│   └── AuthContext.tsx    # Auth state provider (bootstrap, login, logout)
├── hooks/
│   └── useAuth.ts        # Auth hook
├── types/
│   ├── api.ts            # ApiResponse<T>
│   ├── auth.ts           # User, LoginRequest, RegisterRequest
│   ├── github.ts         # GitHubStatusResponse, GitRepository, Branch
│   ├── thread.ts         # ChangeThread, DecisionNote, ThreadStatus
│   └── brief.ts          # Brief types
├── components/
│   ├── ui/               # shadcn/ui primitives (Button, Card, Dialog, etc.)
│   └── devbraid/         # App components (AppShell, AuthShell, etc.)
├── routes/
│   ├── __root.tsx        # Root layout
│   ├── auth.login.tsx    # Login
│   ├── auth.register.tsx # Register
│   ├── auth.verify.tsx   # OTP verification
│   ├── dashboard.tsx     # Dashboard (stats, recent threads)
│   ├── threads.tsx       # Threads layout
│   ├── threads.$id.tsx   # Thread detail + actions + notes
│   ├── briefs.tsx        # Briefs layout
│   ├── briefs.$id.tsx    # Brief detail
│   ├── notes.tsx         # All decision notes
│   ├── connections.tsx   # GitHub connection management
│   └── settings.tsx      # Profile, password, preferences
├── lib/utils.ts          # cn() class utility
└── routeTree.gen.ts      # Auto-generated route tree
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Marketing homepage → redirect to `/dashboard` |
| `/auth/login` | Login form |
| `/auth/register` | Registration form |
| `/auth/verify` | OTP verification (auto-submit at 6 digits) |
| `/dashboard` | Stats cards, recent threads, quick actions |
| `/threads` | Thread list with search + status filter |
| `/threads/$id` | Thread detail with Refresh, Analyze, Generate Brief, Publish |
| `/briefs` | Brief list |
| `/briefs/$id` | Brief detail (markdown render) |
| `/notes` | All decision notes |
| `/connections` | GitHub PAT connect/disconnect/validate |
| `/settings` | Profile update, password change |

## Auth Flow

```
Register → OTP Send → OTP Verify → Login → JWT pair
                                          ↓
                              Auto-refresh on 401
                              Redirect to /auth/login?expired=true on failure
```

Tokens stored in-memory (not localStorage) to prevent XSS exfiltration.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1` | Backend API base URL |

## Docker

```bash
docker compose up --build -d    # Runs on http://localhost:3000
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Vite dev server (HMR) |
| `npm run build` | Production build |
| `npm run build:dev` | Development build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint |
| `npm run format` | Prettier |

## Project Docs

- `docs/PROJECT_DOCUMENTATION.md` — Complete consolidated documentation
- `docs/reports/2026-07-29-e2e-test-report.md` — E2E test report
