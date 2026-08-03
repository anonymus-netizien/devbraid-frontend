# DevBraid Frontend — API Reference

> Complete frontend-facing contract for the DevBraid backend (Spring Boot 4.1). Source of truth: the live OpenAPI 3.1 spec served at `/v3/api-docs` (verified against the running backend — **47 paths, 59 operations**). Generated TypeScript types from the same spec land in `src/api/generated/` (regenerate with `npm run api:types` — see [Types](#types-from-openapi)).
>
> If this document and the live spec disagree, **the live spec wins** — regenerate types and fix this doc.

---

## 1. Overview

| | |
|---|---|
| Base URL (dev) | `http://localhost:8080/api/v1` |
| Base URL (docker/prod) | set via `VITE_API_BASE_URL` (prod uses `/api` context path) |
| Protocol | JSON over HTTPS; REST; RFC 7807 errors |
| Pagination | Spring `Page<T>` shape (see §4) |
| Auth | JWT bearer (30 min) + rotating refresh token (7 days), or API key (`X-API-Key`) |

### Response envelope

Every endpoint returns the same wrapper:

```json
{ "success": true, "message": "OK", "data": { ... } }
```

- `success: boolean` — request succeeded
- `message: string` — human-readable status ("OK" on success)
- `data: T | null` — payload; `null` on errors and on void success (e.g. logout, delete)

### Error contract

- Errors are HTTP status codes + the same envelope with `success: false`, `data: null` and a specific `message`
- Validation errors (Spring Bean Validation) arrive as `message` strings from the validation array — the client should surface the message directly
- Status codes in use: `400` bad request / validation, `401` unauthenticated / bad credentials, `403` forbidden (wrong scope, CSRF-protected session), `404` not found, `409` conflict (e.g. email already registered, GitHub already connected), `410` gone, `429` rate limited, `500` internal
- Never display raw stack traces — `message` is client-safe

### Auth schemes (Swagger: `bearer-jwt` + `api-key`)

| Scheme | Header | Used by |
|---|---|---|
| JWT | `Authorization: Bearer <accessToken>` | Interactive UI sessions |
| API key | `X-API-Key: <key>` | Programmatic/integration access |

Almost every endpoint accepts **either** scheme; the exceptions are the public auth + webhook endpoints (no security). The frontend interactive app uses JWT only.

---

## 2. Authentication flows

### 2.1 Registration (two-step, OTP)

1. `POST /auth/register` `{fullName, email, password}` → 201. User created in **pending** state (Redis).
2. `POST /auth/otp/send` `{email}` → email with a one-time password is dispatched.
3. `POST /auth/otp/verify` `{email, otp}` → 200 `{email, verified: true}`. User becomes **active**.
4. User can now `POST /auth/login`.

The optional `disposableEmail` field on register is supported by the backend (accepts temporary-email domains) — pass only if the UI wants to suppress disposable addresses.

### 2.2 Login

`POST /auth/login` `{email, password}` → `data: LoginResponse`:

| Field | Type | Notes |
|---|---|---|
| `accessToken` | string | JWT, 30 min lifetime (`expiresAt`) |
| `refreshToken` | string | JWT, 7 days, **rotated** on every refresh |
| `issuedAt` / `expiresAt` | string (ISO-8601) | access token window |
| `fullName` | string | |
| `email` | string | |
| `userId` | string (UUID) | |
| `role` | string | `DEVELOPER` (only role today) |

### 2.3 Session bootstrap & refresh rotation

- `GET /auth/me` returns the current profile for the access token (identity bootstrap on app load).
- `POST /auth/refresh` `{refreshToken}` → new `LoginResponse`. **The refresh token is single-use**: every refresh issues a new refresh token; the old one is revoked. Two concurrent refreshes with the same token race — the client must single-flight refreshes (see `src/api/axios.ts` interceptor, which already does this).
- `POST /auth/logout` `{refreshToken}` → revokes the refresh token server-side. Always call on logout.

### 2.4 OTP helpers

- `POST /auth/otp/send` `{email}` → `{email}` (no OTP in response — delivered by email)
- `POST /auth/otp/verify` `{email, otp}` → `{email, verified}`

---

## 3. Endpoint catalog

Legend: `*` = required. `P = paginated (Spring Page)`. All endpoints under `/api/v1` unless shown otherwise.

### 3.1 Auth — public (no auth required)

| Method | Path | Request | Response |
|---|---|---|---|
| POST | `/auth/register` | `RegisterRequest` | `UserProfileResponse` (201) |
| POST | `/auth/login` | `LoginRequest` | `LoginResponse` |
| POST | `/auth/refresh` | `RefreshTokenRequest` | `LoginResponse` |
| POST | `/auth/logout` | `RefreshTokenRequest` | void (200) |
| POST | `/auth/otp/send` | `OtpSendRequest` | `OtpSendResponse` |
| POST | `/auth/otp/verify` | `OtpVerifyRequest` | `OtpVerifyResponse` |

### 3.2 User

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/user/profile` | — | `UserProfileResponse` |
| PUT | `/user/profile` | `UpdateProfileRequest` | `UserProfileResponse` |
| PUT | `/user/password` | `UpdatePasswordRequest` | void |

### 3.3 GitHub connections

| Method | Path | Request | Response |
|---|---|---|---|
| POST | `/github/connect` | `ConnectRequest` (`personalAccessToken*`) | `GitHubStatusResponse` |
| DELETE | `/github/disconnect` | — | void |
| GET | `/github/status` | — | `GitHubStatusResponse` |
| GET | `/github/repos` | — | `GitRepositoryDto[]` |
| GET | `/github/branches?owner=&repo=` | query | `BranchDto[]` |
| GET | `/github/repos/{owner}/{repo}/branches` | path | `BranchDto[]` |

### 3.4 Change threads

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/threads` | `?page=&size=` P | `Page<ThreadResponse>` |
| POST | `/threads` | `CreateThreadRequest` | `ThreadResponse` (201) |
| GET | `/threads/{id}` | — | `ThreadResponse` |
| PUT | `/threads/{id}` | `UpdateThreadRequest` | `ThreadResponse` |
| DELETE | `/threads/{id}` | — | void |
| POST | `/threads/{id}/refresh` | — | `ThreadResponse` (re-syncs commits/diffs) |
| POST | `/threads/{id}/analyze` | — | `ThreadResponse` (risk analysis) |
| POST | `/threads/{id}/publish` | `?prNumber=` | `PublishResponse` |
| POST | `/threads/{id}/brief` | — | `BriefResponse` |
| GET | `/threads/{id}/brief` | — | `BriefResponse` |

**Thread search:**

| Method | Path | Params | Response |
|---|---|---|---|
| GET | `/threads/search` | `q*`, P | `Page<ThreadResponse>` |
| GET | `/threads/search/status` | `status*` (enum), P | `Page<ThreadResponse>` |
| GET | `/threads/search/repo` | `repositoryFullName*`, P | `Page<ThreadResponse>` |

### 3.5 Decision notes (per thread) + global notes

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/threads/{threadId}/notes` | — | `NoteResponse[]` |
| POST | `/threads/{threadId}/notes` | `CreateNoteRequest` | `NoteResponse` (201) |
| PUT | `/threads/{threadId}/notes/{noteId}` | `UpdateNoteRequest` | `NoteResponse` |
| DELETE | `/threads/{threadId}/notes/{noteId}` | — | void |
| GET | `/notes` | P | `Page<NoteResponse>` |

### 3.6 File comments (per thread)

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/threads/{threadId}/comments` | — | `FileCommentResponse[]` |
| POST | `/threads/{threadId}/comments` | `CreateFileCommentRequest` | `FileCommentResponse` (201) |
| PUT | `/threads/{threadId}/comments/{commentId}` | `UpdateFileCommentRequest` | `FileCommentResponse` |
| DELETE | `/threads/{threadId}/comments/{commentId}` | — | void |
| GET | `/threads/{threadId}/comments/by-file?filePath=` | query | `FileCommentResponse[]` |

### 3.7 Thread events + snapshots

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/threads/{threadId}/events` | — | `ThreadEventResponse[]` |
| GET | `/threads/{threadId}/events/paged` | P | `Page<ThreadEventResponse>` |
| POST | `/threads/{threadId}/events` | `CreateThreadEventRequest` | `ThreadEventResponse` (201) |
| GET | `/threads/{threadId}/snapshots` | — | `SnapshotResponse[]` |
| POST | `/threads/{threadId}/snapshots` | `CreateSnapshotRequest` | `SnapshotResponse` (201) |
| GET | `/threads/{threadId}/snapshots/latest` | — | `SnapshotResponse` |
| GET | `/threads/{threadId}/snapshots/{snapshotId}` | — | `SnapshotResponse` |

### 3.8 Change briefs

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/briefs` | P | `Page<BriefResponse>` |
| GET | `/briefs/{id}` | — | `BriefResponse` |
| GET | `/threads/{id}/brief` | — | `BriefResponse` |
| POST | `/threads/{id}/brief` | — | `BriefResponse` (generates) |
| POST | `/threads/{id}/publish` | `?prNumber=` | `PublishResponse` |

### 3.9 API keys

| Method | Path | Request | Response |
|---|---|---|---|
| GET | `/api-keys` | — | `ApiKey[]` |
| POST | `/api-keys` | `CreateApiKeyRequest` | `CreatedKey` (201 — **fullKey shown once**) |
| DELETE | `/api-keys/{id}` | — | void |

### 3.10 Indexing

| Method | Path | Request | Response |
|---|---|---|---|
| POST | `/indexing/start` | `StartIndexRequest` | `CodebaseIndex` |
| GET | `/indexing/list` | — | `CodebaseIndex[]` |
| GET | `/indexing/{indexId}` | — | `CodebaseIndex` |
| GET | `/indexing/{indexId}/files` | — | `FileIndex[]` |
| GET | `/indexing/{indexId}/search?pattern=&q=` | query | `FileIndex[]` |
| GET | `/indexing/{indexId}/language/{language}` | — | `FileIndex[]` |
| GET | `/indexing/{indexId}/graph?nodeId=&depth=` | query | `DependencyGraphResponse` |

### 3.11 Webhooks (no auth — HMAC verified)

| Method | Path | Notes |
|---|---|---|
| POST | `/webhooks/github` | Headers: `X-GitHub-Event`, `X-GitHub-Delivery`, `X-Hub-Signature-256` |
| GET | `/webhooks/github/health` | 200 if webhook endpoint active |

---

## 4. Pagination (Spring `Page<T>`)

Query params: `page` (0-based), `size`, `sort` (e.g. `createdAt,desc`).

```json
{
  "totalElements": 137, "totalPages": 14, "size": 10,
  "content": [ ... ], "number": 0,
  "first": true, "last": false, "numberOfElements": 10, "empty": false
}
```

Client-facing fields: `content` (items), `number` (current page, 0-based), `size`, `totalElements`, `totalPages`, `first`, `last`, `empty`.

---

## 5. DTO reference

### Enums

| Enum | Values |
|---|---|
| `NoteContext` | `COMMIT` · `FILE` · `THREAD` |
| `ThreadStatus` | `DRAFT` → `ANALYZING` → `READY` → `PUBLISHED` |
| `NoteStatus` | `ACTIVE` · `ARCHIVED` |
| `FileCommentStatus` | `ACTIVE` · `RESOLVED` · `ARCHIVED` |
| `RiskLevel` | `NONE` · `LOW` · `MEDIUM` · `HIGH` · `CRITICAL` |
| `ThreadSource` | `MANUAL` · `WEBHOOK` |
| `ThreadEventType` | `THREAD_CREATED` · `THREAD_REFRESHED` · `STATUS_CHANGED` · `NOTE_ADDED` · `NOTE_UPDATED` · `NOTE_DELETED` · `FILE_COMMENT_ADDED` · `FILE_COMMENT_UPDATED` · `FILE_COMMENT_DELETED` · `ANALYSIS_RUN` · `BRIEF_GENERATED` · `BRIEF_PUBLISHED` · `SNAPSHOT_CREATED` · `MANUAL` |
| `SnapshotType` | `CREATION` · `REFRESH` · `ANALYSIS` · `MANUAL` |

### Request DTOs (`*` = required)

| DTO | Fields |
|---|---|
| `RegisterRequest` | `fullName*`, `email*`, `password*`, `disposableEmail?` |
| `LoginRequest` | `email*`, `password*` |
| `RefreshTokenRequest` | `refreshToken*` |
| `OtpSendRequest` | `email*` |
| `OtpVerifyRequest` | `email*`, `otp*` |
| `UpdateProfileRequest` | `fullName?` |
| `UpdatePasswordRequest` | `currentPassword*`, `newPassword*` |
| `ConnectRequest` | `personalAccessToken*` |
| `CreateThreadRequest` | `repositoryFullName*`, `headBranch*`, `baseBranch?`, `title*`, `description?` |
| `UpdateThreadRequest` | `title?`, `description?` |
| `CreateNoteRequest` | `context*` (NoteContext), `contextRef?`, `decision*`, `rationale*`, `alternatives?`, `impact?` |
| `UpdateNoteRequest` | `decision?`, `rationale?`, `alternatives?`, `impact?` |
| `CreateFileCommentRequest` | `filePath*`, `lineStart?`, `lineEnd?`, `content*` |
| `UpdateFileCommentRequest` | `content?`, `lineStart?`, `lineEnd?`, `status?` |
| `CreateThreadEventRequest` | `summary*`, `metadata?` (object) |
| `CreateSnapshotRequest` | `note?` |
| `CreateApiKeyRequest` | `name?`, `scopes?` (string[]), `rateLimitPerMin?` |
| `StartIndexRequest` | `repository?`, `branch?`, `fileContents?` |

### Response DTOs

| DTO | Fields |
|---|---|
| `LoginResponse` | `accessToken`, `refreshToken`, `issuedAt`, `expiresAt`, `fullName`, `email`, `userId`, `role` |
| `OtpSendResponse` | `email` |
| `OtpVerifyResponse` | `email`, `verified` |
| `UserProfileResponse` | `id`, `fullName`, `email`, `role`, `createdAt` |
| `ThreadResponse` | `id`, `repositoryFullName`, `headBranch`, `baseBranch`, `title`, `description`, `source`, `status`, `commitSha`, `commits: CommitSummaryDto[]`, `changedFiles: ChangedFileDto[]`, `riskLevel`, `riskReport` (object), `notes: NoteResponse[]`, `createdAt`, `updatedAt` |
| `CommitSummaryDto` | `sha`, `message`, `author: {name, email}` |
| `ChangedFileDto` | `filename`, `status` (string — GH status), `additions`, `deletions` |
| `NoteResponse` | `id`, `threadId`, `authorId`, `context`, `contextRef`, `decision`, `rationale`, `alternatives`, `impact`, `status`, `createdAt` |
| `FileCommentResponse` | `id`, `threadId`, `authorId`, `filePath`, `lineStart`, `lineEnd`, `content`, `status`, `createdAt`, `updatedAt` |
| `ThreadEventResponse` | `id`, `threadId`, `actorId`, `type`, `summary`, `metadata`, `createdAt` |
| `SnapshotResponse` | `id`, `threadId`, `userId`, `repositoryFullName`, `headBranch`, `baseBranch`, `commitSha`, `commits`, `changedFiles`, `title`, `description`, `type`, `note`, `createdAt` |
| `BriefResponse` | `id`, `threadId`, `content` (markdown), `publishedToGithub`, `publishUrl`, `createdAt` |
| `PublishResponse` | `success`, `publishUrl`, `message`, `publishedAt` |
| `GitHubStatusResponse` | `connected`, `valid`, `githubUsername`, `connectedAt`, `lastValidatedAt` |
| `GitRepositoryDto` | `fullName`, `defaultBranch`, `private`, `isPrivate` |
| `BranchDto` | `name` |
| `CreatedKey` | `id`, `fullKey` (**only returned once**), `prefix`, `rateLimitPerMin` |
| `ApiKey` | `id`, `user`, `name`, `prefix`, `keyHash`, `scopes`, `rateLimitPerMin`, `expiresAt`, `lastUsedAt`, `active`, `createdAt` |
| `CodebaseIndex` | `id`, `user`, `repository`, `branch`, `status`, `totalFiles`, `indexedFiles`, `totalFunctions`, `totalClasses`, `totalDependencies`, `errorMessage`, `createdAt`, `updatedAt` |
| `FileIndex` | `id`, `codebaseIndex`, `filePath`, `fileType`, `language`, `lineCount`, `functionCount`, `classCount`, `imports`, `exports`, `functions`, `classes`, `dependencies`, `riskSignals`, `createdAt` |
| `DependencyGraphResponse` | `nodes: CodebaseNode[]`, `edges: CodebaseEdge[]` |

---

## 6. Gap matrix — backend surfaces with no frontend UI

These are documented + type-ready but have **no screen yet**. Build order suggestion in parentheses.

| Surface | Endpoints | Suggested UI |
|---|---|---|
| Thread search | `/threads/search`, `/search/status`, `/search/repo` | Search box on threads list (1) |
| File comments | `/threads/{id}/comments*` (+by-file) | Inline comment chips on thread detail (2) |
| Thread events | `/threads/{id}/events`, `/events/paged` | Activity timeline on thread detail (3) |
| Snapshots | `/threads/{id}/snapshots*` | Version history / diff of thread state (4) |
| Indexing | `/indexing/*` (7 endpoints) | Index explorer (repos → files → graph → search) (5) |
| API keys | `/api-keys*` | Settings → API keys management (6) |

---

## 7. Types from OpenAPI

`npm run api:types` fetches `GET /v3/api-docs` (default `http://localhost:8080`, override via `VITE_API_BASE_URL`-style env) and regenerates `src/api/generated/schema.d.ts` via `openapi-typescript`. The generated module is committed; regenerate after every backend contract change and re-run `tsc --noEmit`. Hand-written wrappers for `ApiResponse<T>` and the `Page<T>` shape sit on top in the API layer.
