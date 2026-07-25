# DevBraid Frontend

React 19 + TypeScript frontend for the DevBraid platform — an evidence-backed change thread system for GitHub.

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite 8
- **Routing:** @tanstack/react-router
- **HTTP Client:** Axios (with interceptors for auth)
- **Styling:** Tailwind CSS 4 + Lucide icons
- **Form Validation:** Zod + react-hook-form
- **UI Components:** Radix UI primitives
- **Container:** Multi-stage Docker (Node 22 → nginx)

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server (Vite HMR on port 5173)
npm run dev

# TypeScript check
npx tsc --noEmit

# Production build
npm run build
```

## Docker

```bash
# Build and run
docker compose up --build -d

# Runs on http://localhost:3000
# API URL: http://localhost:8080/api/v1 (configurable via VITE_API_BASE_URL)
```

## Project Structure

```
src/
├── api/           # Axios client + token management
├── components/    # Reusable UI components
├── context/       # React context providers (AuthContext)
├── hooks/         # Custom hooks (useAuth)
├── pages/         # Route pages (Login, Register, Dashboard)
├── services/      # API service layer
├── types/         # TypeScript type definitions
└── lib/           # Utility functions
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_BASE_URL` | `http://localhost:8080/api/v1` | Backend API base URL |

## Auth Endpoints Consumed

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/register` | Store registration (Redis pending) |
| POST | `/auth/otp/send` | Request OTP code |
| POST | `/auth/otp/verify` | Verify OTP → finalizes registration |
| POST | `/auth/login` | Login → JWT pair |
| GET | `/auth/me` | Get user profile |
| POST | `/auth/refresh` | Refresh token pair |
| POST | `/auth/logout` | Revoke refresh token |

## Documentation

- **`API.md`** — Full API integration guide with component references
- **`README.md`** — This file

## Sprint Status

- ✅ **Sprint 1:** Auth module complete (register, OTP, login, token management, Docker)
- ⏸️ **Sprint 2:** GitHub PAT connection (upcoming)
