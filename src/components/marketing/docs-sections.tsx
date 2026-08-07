import { CodeBlock, Callout } from './docs-blocks'
import { FileTree } from './file-tree'

/** Guides: introduction → architecture. */
export function DocsGuides() {
  return (
    <>
      <section id="introduction" className="mt-10">
        <h2 className="border-b border-hairline pb-3 text-2xl font-semibold tracking-tight">
          What is DevBraid?
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          DevBraid turns GitHub pull requests into evidence-backed engineering briefs. A developer
          connects a repository, opens a Change Thread to capture commits, diffs, and decision
          notes, runs deterministic risk analysis, and generates an AI change brief where every
          claim is cited — or explicitly marked as inference. The brief is published to the PR only
          after human approval.
        </p>
        <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
          The product follows a five-step flow:{' '}
          <strong className="text-foreground">
            Connect → Capture → Analyze → Reason → Publish
          </strong>
          .
        </p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg bg-surface p-6 transition-colors hover:bg-surface-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              ⚡ Capture the why
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Decision notes recorded while you work become the evidence your briefs cite — never
              invented after the fact.
            </p>
          </div>
          <div className="rounded-lg bg-surface p-6 transition-colors hover:bg-surface-2">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              🛡️ Cited, not guessed
            </p>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Gold chips link claims to commits and files; violet chips mark inference. Reviewers
              know exactly what to trust.
            </p>
          </div>
        </div>
      </section>

      <section id="installation" className="mt-14">
        <h2 className="border-b border-hairline pb-3 text-2xl font-semibold tracking-tight">
          Quick start
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          The backend is a Spring Boot service with a Docker Compose setup. Prerequisites: Java 21
          and Docker &amp; Docker Compose.
        </p>
        <div className="mt-4 space-y-4">
          <CodeBlock
            lang="bash"
            code={`git clone https://github.com/anonymus-netizien/devbraid-backend.git
cd devbraid-backend
cp .env.example .env   # set CLERK_JWKS_URL + CLERK_ISSUER
docker compose up -d --build`}
          />
          <p className="text-sm text-muted-foreground">
            Backend at{' '}
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
              http://localhost:8080
            </code>{' '}
            · Swagger UI at{' '}
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
              /swagger-ui.html
            </code>{' '}
            · pgAdmin at{' '}
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
              http://localhost:5050
            </code>
          </p>
        </div>
        <Callout title="No Clerk account?">
          Create a free instance at{' '}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs">
            dashboard.clerk.com
          </code>{' '}
          and point{' '}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs">
            CLERK_JWKS_URL
          </code>{' '}
          at its JWKS endpoint. Identity, signup, and email OTP all live in Clerk — the backend only
          verifies tokens.
        </Callout>
      </section>

      <section id="configuration" className="mt-14">
        <h2 className="border-b border-hairline pb-3 text-2xl font-semibold tracking-tight">
          Configuration
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          Three Spring profiles, selected with{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
            SPRING_PROFILES_ACTIVE
          </code>
          :
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface text-left">
                <th className="border border-hairline p-2 font-semibold text-foreground">
                  Profile
                </th>
                <th className="border border-hairline p-2 font-semibold text-foreground">DDL</th>
                <th className="border border-hairline p-2 font-semibold text-foreground">CORS</th>
                <th className="border border-hairline p-2 font-semibold text-foreground">
                  Database
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs text-muted-foreground">
              <tr>
                <td className="border border-hairline p-2 text-foreground">dev (default)</td>
                <td className="border border-hairline p-2">update</td>
                <td className="border border-hairline p-2">localhost:3000,5173,4200</td>
                <td className="border border-hairline p-2">local Docker (5433)</td>
              </tr>
              <tr>
                <td className="border border-hairline p-2 text-foreground">stage</td>
                <td className="border border-hairline p-2">validate</td>
                <td className="border border-hairline p-2">staging.devbraid.com</td>
                <td className="border border-hairline p-2">Neon (env, required)</td>
              </tr>
              <tr>
                <td className="border border-hairline p-2 text-foreground">prod</td>
                <td className="border border-hairline p-2">validate</td>
                <td className="border border-hairline p-2">app.devbraid.com</td>
                <td className="border border-hairline p-2">Neon (env, required)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          <strong className="text-foreground">prod fails fast</strong> without{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">PROD_DB_URL</code>,{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
            PROD_DB_USERNAME
          </code>
          ,{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
            PROD_DB_PASSWORD
          </code>
          ,{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
            PROD_ENCRYPTION_KEY
          </code>
          , and{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">CLERK_JWKS_URL</code>
          .
        </p>
        <FileTree />
      </section>

      <section id="architecture" className="mt-14">
        <h2 className="border-b border-hairline pb-3 text-2xl font-semibold tracking-tight">
          Architecture
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          Spring Boot modules, each owning one slice of the five-step flow:
        </p>
        <CodeBlock
          lang="text"
          code={`com.devbraid
├── user/          Clerk user mirror, profile
├── github/        GitHub PAT connection, repo/branch listing, PR comments
├── changethread/  Change Threads + Decision Notes CRUD
├── brief/         Change Brief generation + publishing
├── analysis/      Deterministic risk analysis + AI enhancement
├── ai/            AI provider abstraction (OpenAI/Groq/OpenRouter)
├── security/      ClerkJwtFilter (JWKS verification), SecurityConfig, CORS
├── config/        Jackson, scheduling, REST client
└── common/        ApiResponse envelope, GlobalExceptionHandler, LoggingFilter`}
        />
        <Callout title="Filter chain order">
          LoggingFilter → ClerkJwtFilter → controller dispatch. Every endpoint requires{' '}
          <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs">
            Authorization: Bearer &lt;clerk-session-token&gt;
          </code>
          .
        </Callout>
      </section>
    </>
  )
}

/** Reference: data models → rate limits. */
export function DocsReference() {
  return (
    <>
      <section id="data-models" className="mt-14">
        <h2 className="border-b border-hairline pb-3 text-2xl font-semibold tracking-tight">
          Data models
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          Seven Flyway migrations (V1–V7) on Postgres. Key entities:
        </p>
        <div className="mt-4 space-y-2 font-mono text-[13px]">
          <p className="rounded border border-hairline bg-surface p-3">
            <span className="text-primary">users</span> — id, clerk_id (unique), email, full_name,
            github_username
          </p>
          <p className="rounded border border-hairline bg-surface p-3">
            <span className="text-primary">github_connections</span> — user_id, encrypted PAT,
            username, last_validated_at
          </p>
          <p className="rounded border border-hairline bg-surface p-3">
            <span className="text-primary">change_threads</span> — user_id, repo, head/base branch,
            status, risk flags
          </p>
          <p className="rounded border border-hairline bg-surface p-3">
            <span className="text-primary">decision_notes</span> — thread_id, author, decision,
            rationale, alternatives, impact
          </p>
          <p className="rounded border border-hairline bg-surface p-3">
            <span className="text-primary">change_briefs</span> — thread_id, content, status,
            published_to_github
          </p>
        </div>
      </section>

      <section id="authentication" className="mt-14">
        <h2 className="border-b border-hairline pb-3 text-2xl font-semibold tracking-tight">
          Authentication
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          Identity is fully outsourced to Clerk. The backend never stores passwords — it verifies
          Clerk-issued RS256 JWTs against the Clerk JWKS endpoint and mirrors the user into{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">users</code> on first
          sight.
        </p>
        <div className="mt-4 space-y-4">
          <CodeBlock
            lang="json"
            code={`{
  "email": "{{user.primary_email_address}}",
  "fullName": "{{user.full_name}}"
}`}
          />
          <p className="text-sm text-muted-foreground">
            Configure these claims in the Clerk dashboard under Session Tokens — the backend reads{' '}
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">sub</code>,{' '}
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">email</code>, and{' '}
            <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">fullName</code>.
          </p>
        </div>
        <Callout title="Security model">
          PATs are encrypted at rest with AES-256-GCM (per-record IVs). Ownership checks (
          <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs">
            findByIdAndUserId
          </code>
          ) guard every resource. Unauthenticated requests get a JSON 401, never Spring&apos;s
          default 403.
        </Callout>
      </section>

      <section id="endpoints" className="mt-14">
        <h2 className="border-b border-hairline pb-3 text-2xl font-semibold tracking-tight">
          Endpoints
        </h2>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-surface text-left">
                <th className="border border-hairline p-2 font-semibold text-foreground">Module</th>
                <th className="border border-hairline p-2 font-semibold text-foreground">
                  Base path
                </th>
                <th className="border border-hairline p-2 font-semibold text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="font-mono text-xs text-muted-foreground">
              <tr>
                <td className="border border-hairline p-2 text-foreground">User</td>
                <td className="border border-hairline p-2">/api/v1/user</td>
                <td className="border border-hairline p-2">profile (GET/PUT)</td>
              </tr>
              <tr>
                <td className="border border-hairline p-2 text-foreground">GitHub</td>
                <td className="border border-hairline p-2">/api/v1/github</td>
                <td className="border border-hairline p-2">
                  connect, disconnect, status, repos, branches
                </td>
              </tr>
              <tr>
                <td className="border border-hairline p-2 text-foreground">Threads</td>
                <td className="border border-hairline p-2">/api/v1/threads</td>
                <td className="border border-hairline p-2">
                  CRUD + refresh, analyze, brief, publish
                </td>
              </tr>
              <tr>
                <td className="border border-hairline p-2 text-foreground">Notes</td>
                <td className="border border-hairline p-2">/api/v1/threads/{'{id}'}/notes</td>
                <td className="border border-hairline p-2">CRUD (thread-scoped + global list)</td>
              </tr>
              <tr>
                <td className="border border-hairline p-2 text-foreground">Briefs</td>
                <td className="border border-hairline p-2">/api/v1/briefs</td>
                <td className="border border-hairline p-2">list, get by ID</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          Every response is wrapped in the{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">ApiResponse</code>{' '}
          envelope —{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">success</code>,{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">data</code>,{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">error</code>,{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">code</code>.
        </p>
      </section>

      <section id="webhooks" className="mt-14">
        <h2 className="border-b border-hairline pb-3 text-2xl font-semibold tracking-tight">
          Webhooks
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          DevBraid does not listen to GitHub webhooks. Threads are refreshed on demand — call{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
            POST /api/v1/threads/{'{id}'}/refresh
          </code>{' '}
          to pull the latest commits and changed files into a thread before analysis.
        </p>
        <p className="mt-3 text-pretty text-base leading-relaxed text-muted-foreground">
          CI/CD runs through GitHub Actions: tests on every push to{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">develop</code> and{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">main</code>, and a
          Render Deploy Hook triggered on merge to{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">main</code>.
        </p>
      </section>

      <section id="rate-limits" className="mt-14">
        <h2 className="border-b border-hairline pb-3 text-2xl font-semibold tracking-tight">
          Rate limits
        </h2>
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
          DevBraid respects GitHub&apos;s API rate limits on your behalf and keeps PAT usage
          minimal: listing repos, reading commits and changed files, and posting exactly one PR
          comment per published brief. No{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">admin:*</code> or{' '}
          <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">delete_repo</code>{' '}
          scopes are ever requested.
        </p>
      </section>
    </>
  )
}
