# DevBraid Frontend — API Integration Guide

> **Version:** v1.0 (Sprint 1)
> **Last Updated:** 2026-07-25
> **Framework:** React 19 + TypeScript + Vite
> **Router:** @tanstack/react-router
> **Build Tool:** Vite 8

---

## Table of Contents

1. [Project Structure](#1-project-structure)
2. [Authentication Flow](#2-authentication-flow)
3. [API Client Configuration](#3-api-client-configuration)
4. [Auth Components](#4-auth-components)
5. [Token Management](#5-token-management)
6. [Docker Setup](#6-docker-setup)
7. [Changelog (Sprint 1)](#7-changelog-sprint-1)

---

## 1. Project Structure

```
devbraid-frontend/
├── src/
│   ├── api/
│   │   ├── axios.ts          # Axios instance with interceptors
│   │   └── token.ts          # Token storage (access + refresh)
│   ├── components/
│   │   └── devbraid/
│   │       ├── auth-shell.tsx      # Split-pane layout with brand pane
│   │       ├── auth-form.tsx       # Reusable form components
│   │       ├── password-input.tsx  # Password visibility toggle
│   │       └── otp-input.tsx       # 6-digit OTP input
│   ├── context/
│   │   └── AuthContext.tsx    # Auth state management
│   ├── hooks/
│   │   └── useAuth.ts        # Auth hook
│   ├── pages/
│   │   ├── LoginPage.tsx     # Login page
│   │   ├── RegisterPage.tsx  # Registration with OTP flow
│   │   └── DashboardPage.tsx # Post-login dashboard
│   ├── services/
│   │   └── auth.service.ts   # API calls for auth endpoints
│   ├── types/
│   │   └── auth/             # TypeScript interfaces
│   └── lib/
│       └── utils.ts          # Utility functions (cn)
├── Dockerfile                # Multi-stage Node 22 → nginx
└── docker-compose.yml        # Standalone frontend deployment
```

---

## 2. Authentication Flow

### 2.1 Registration Flow

The frontend implements a 2-step registration flow:

```
Step 1: Fill Form
├── Fields: Full Name, Email, Password, Confirm Password
├── Client-side validation:
│   ├── Name: required, max 80 chars
│   ├── Email: required, valid email format
│   ├── Password: min 8 chars, strength indicator
│   └── Confirm: must match password
└── On submit:
    ├── 1. POST /api/v1/auth/register  → stores data in Redis (pending)
    ├── 2. POST /api/v1/auth/otp/send   → sends OTP email
    └── → Advances to Step 2

Step 2: Verify OTP
├── 6-digit OTP input (input-otp component)
├── On submit:
│   └── POST /api/v1/auth/otp/verify  → moves Redis → PostgreSQL
│       └── On success → redirect to /dashboard
└── On failure → error alert, retry
```

> **Note:** The registration data is sent FIRST via `/register` (stored in Redis), then the OTP is sent via `/otp/send`. When the user verifies the OTP via `/otp/verify`, the backend finalizes the registration by moving data from Redis to PostgreSQL.

### 2.2 Login Flow

```
┌─────────────┐     ┌──────────────────┐     ┌───────────────┐
│ Login Form  │────▶│ POST /auth/login │────▶│ Store Tokens  │
│ (email,     │     │                  │     │ (accessToken, │
│  password)  │     │ Returns JWT pair │     │  refreshToken)│
└─────────────┘     └──────────────────┘     └───────┬───────┘
                                                      │
                                                      ▼
                                             ┌───────────────┐
                                             │ Redirect to    │
                                             │ /dashboard     │
                                             └───────────────┘
```

### 2.3 Session Bootstrap

On page load, `AuthContext` attempts to restore the session:

```
Page Load
    │
    ├── GET /api/v1/auth/me (with stored access token)
    │   ├── 200 → session restored, render dashboard
    │   └── 401/403 → token expired
    │       │
    │       ├── POST /api/v1/auth/refresh (with stored refresh token)
    │       │   ├── 200 → new tokens stored, retry /me
    │       │   └── 400/401 → no valid session
    │       │       │
    │       │       └── Clear tokens → show login page
    │       │
    │       └── (null guards prevent unnecessary API calls when no token exists)
```

---

## 3. API Client Configuration

### 3.1 Axios Instance (`src/api/axios.ts`)

```typescript
import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1',
  headers: { 'Content-Type': 'application/json' },
});
```

**Environment variable:** `VITE_API_BASE_URL` (default: `http://localhost:8080/api/v1`)

### 3.2 Request Interceptor

Automatically attaches the access token to every request:

```typescript
apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 3.3 Response Interceptor

Handles token refresh on 401 responses:

```typescript
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const { accessToken, refreshToken } = await authService.refresh();
        error.config.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(error.config);
      } catch {
        // Refresh failed → redirect to login
      }
    }
    return Promise.reject(error);
  }
);
```

### 3.4 Auth Service Methods (`src/services/auth.service.ts`)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `sendOtp(email)` | `POST /auth/otp/send` | Request OTP code |
| `verifyOtp(email, otp)` | `POST /auth/otp/verify` | Verify OTP (finalizes registration) |
| `login(credentials)` | `POST /auth/login` | Login, stores tokens |
| `register(data)` | `POST /auth/register` | Store registration data in Redis (pending) |
| `me()` | `GET /auth/me` | Get current user profile |
| `refresh()` | `POST /auth/refresh` | Refresh token pair |
| `logout()` | `POST /auth/logout` | Revoke refresh token |

---

## 4. Auth Components

### 4.1 AuthShell (`auth-shell.tsx`)

Split-pane layout with:
- **Left pane:** Centered form content (`max-w-[420px]`, vertically centered)
- **Right pane (desktop only):** Brand showcase with 3D graphic, grid background, ambient glow
- **Header:** App logo + version badge
- **Footer:** Copyright + links

### 4.2 AuthForm Components (`auth-form.tsx`)

| Component | Purpose |
|-----------|---------|
| `FieldLabel` | Form field label with optional hint |
| `TextInput` | Styled text input with focus/error states |
| `FieldError` | Validation error message with icon |
| `FormAlert` | Success/error alert banner |
| `SubmitButton` | Loading state button with spinner |

### 4.3 OTP Input (`otp-input.tsx`)

6-digit code input using `input-otp` library. Each digit in a separate slot with focus management.

### 4.4 Password Input (`password-input.tsx`)

Password field with show/hide toggle, styled consistently with TextInput.

### 4.5 Password Strength Indicator

Built into `RegisterPage.tsx`:
- Criteria: length ≥8, uppercase, number, special char, length ≥12
- Score: 0-1 → Weak (red), 2-3 → OK (primary), 4-5 → Strong (green)
- Displayed as inline hint next to password label

---

## 5. Token Management

### 5.1 Storage Strategy

| Token | Storage | Access |
|-------|---------|--------|
| `accessToken` | `localStorage` | `getAccessToken()`, `setAccessToken()` |
| `refreshToken` | `localStorage` | `getRefreshToken()`, `setRefreshToken()` |

> **Note:** Current implementation uses `localStorage` for development. For production, HttpOnly cookies are preferred for XSS protection. The token module is abstracted behind `get/set/clear` functions so the storage backend can be swapped without changing other code.

### 5.2 Null Guards (Sprint 1 Improvement)

```typescript
// Before: called API with null refreshToken → 400 Bad Request
// After: skips API call entirely
async refresh(): Promise<LoginResponseData> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) throw new Error('No refresh token available');
  // ... API call
}

async logout(): Promise<void> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    clearTokens();
    return;
  }
  // ... API call
}
```

---

## 6. Docker Setup

### 6.1 Frontend Dockerfile

Multi-stage build:
1. **Build stage:** `node:22-alpine` → `npm install` → `npm run build`
2. **Runtime stage:** `nginx:alpine` → serves compiled output

```
docker build -t devbraid-frontend .
docker run -p 3000:80 devbraid-frontend
```

### 6.2 docker-compose.yml

```yaml
services:
  frontend:
    container_name: devbraid-frontend
    build: .
    ports:
      - "3000:80"
    environment:
      - VITE_API_BASE_URL=${VITE_API_BASE_URL:-http://localhost:8080/api/v1}
```

### 6.3 Development vs Docker Ports

| Mode | Port | Server |
|------|------|--------|
| `npm run dev` | 5173 | Vite dev server (HMR) |
| Docker | 3000 | Nginx production server |

---

## 7. Changelog (Sprint 1)

| Date | Change | Commit |
|------|--------|--------|
| 2026-07-25 | Register flow reorder: data sent before OTP, verify finalizes | `5a69b0a` |
| 2026-07-25 | Auth UI redesign: centered layout, brand pane, 3D graphic | `9e0608b` |
| 2026-07-25 | Eslint ^9.x fix, Dockerfile cleanup, removed `--legacy-peer-deps` | `0fe717a` |
| 2026-07-25 | Removed unused otpSent state from RegisterPage | `f2f4e49` |
| 2026-07-24 | Type alignment with backend, OTP signup flow | `6ac6659` |
| 2026-07-24 | Secure token management (HttpOnly cookies) | `5379a1c` |
| 2026-07-23 | Unit tests for error utils, auth service, axios, cn() | `5fc5944` |
| 2026-07-23 | Login, Register, Dashboard pages with validation | `6b55b78` |
| 2026-07-23 | Reusable auth UI components (shell, form, password input) | `105488a` |
| 2026-07-23 | AuthContext provider + useAuth hook | `5ad7d92` |
