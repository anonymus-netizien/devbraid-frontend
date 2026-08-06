import { createFileRoute } from '@tanstack/react-router'
import { useMemo } from 'react'
import { ChevronRight, Copy, Check, Folder, FileCode2, Info } from 'lucide-react'
import { MarketingPage } from '@/components/marketing/marketing-page'
import { cn } from '@/lib/utils'
import { useState } from 'react'

export const Route = createFileRoute('/docs')({
  head: () => ({
    meta: [
      { title: 'Documentation · DevBraid' },
      {
        name: 'description',
        content:
          'Docs for DevBraid: quick start, configuration, architecture, data models, authentication, and the API reference.',
      },
    ],
  }),
  component: DocsPage,
})

const groups = [
  {
    label: 'Getting Started',
    sections: [
      { id: 'introduction', title: 'Introduction' },
      { id: 'installation', title: 'Installation' },
      { id: 'configuration', title: 'Configuration' },
    ],
  },
  {
    label: 'Core Concepts',
    sections: [
      { id: 'architecture', title: 'Architecture' },
      { id: 'data-models', title: 'Data Models' },
      { id: 'authentication', title: 'Authentication' },
    ],
  },
  {
    label: 'API Reference',
    sections: [
      { id: 'endpoints', title: 'Endpoints' },
      { id: 'webhooks', title: 'Webhooks' },
      { id: 'rate-limits', title: 'Rate Limits' },
    ],
  },
]

function CodeBlock({ lang, code }: { lang: string; code: string }) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    await navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }
  return (
    <div className="overflow-hidden rounded-lg border border-hairline bg-[#0e0e0e]">
      <div className="flex items-center justify-between border-b border-hairline bg-surface px-3 py-1.5">
        <span className="font-mono text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {lang}
        </span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-1 rounded px-1.5 py-0.5 font-mono text-[11px] text-muted-foreground transition-colors hover:text-primary"
        >
          {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
          {copied ? 'copied' : 'copy'}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-foreground/90">
        <code>{code}</code>
      </pre>
    </div>
  )
}

function FileTree() {
  const rows = [
    { depth: 0, name: 'src/', icon: Folder, dir: true },
    { depth: 1, name: 'api/', icon: Folder, dir: true },
    { depth: 2, name: 'routes.ts', icon: FileCode2 },
    { depth: 1, name: 'core/', icon: Folder, dir: true },
    { depth: 2, name: 'config.ts', icon: FileCode2 },
    { depth: 1, name: 'index.ts', icon: FileCode2 },
  ]
  return (
    <div className="rounded-lg border border-hairline bg-[#0e0e0e] p-4">
      {rows.map((r, i) => (
        <div
          key={i}
          className="flex items-center gap-2 py-0.5 font-mono text-[13px] text-muted-foreground"
          style={{ paddingLeft: r.depth * 16 }}
        >
          <r.icon className={cn('size-3.5', r.dir && 'text-primary/70')} />
          <span className={r.dir ? 'text-foreground/90' : 'text-muted-foreground'}>{r.name}</span>
        </div>
      ))}
    </div>
  )
}

function Callout({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-hairline border-l-4 border-l-primary bg-surface p-4">
      <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Info className="size-4 text-primary" /> {title}
      </p>
      <div className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{children}</div>
    </div>
  )
}

const toc = ['introduction', 'installation', 'configuration']

function DocsPage() {
  const allSections = useMemo(() => groups.flatMap((g) => g.sections), [])

  return (
    <MarketingPage>
      <div className="mx-auto flex max-w-[1280px] px-4 pt-28 sm:px-6">
        {/* Docs sidebar */}
        <aside className="sticky top-24 hidden h-[calc(100vh-8rem)] w-64 shrink-0 overflow-y-auto pr-4 lg:block">
          {groups.map((g) => (
            <div key={g.label} className="mb-6">
              <p className="mb-2 px-2 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                {g.label}
              </p>
              <ul className="space-y-0.5">
                {g.sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="block rounded border-l-2 border-transparent px-2 py-1 font-mono text-[13px] text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* Main content */}
        <article className="min-w-0 max-w-4xl flex-1 pb-24 pr-0 lg:px-10">
          <nav className="mb-4 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <span>Docs</span>
            <ChevronRight className="size-3" />
            <span>Getting Started</span>
            <ChevronRight className="size-3" />
            <span className="text-foreground">Introduction</span>
          </nav>

          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Introduction to DevBraid
          </h1>

          <section id="introduction" className="mt-10">
            <h2 className="border-b border-hairline pb-3 text-2xl font-semibold tracking-tight">
              What is DevBraid?
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              DevBraid turns GitHub pull requests into evidence-backed engineering briefs. A
              developer connects a repository, opens a Change Thread to capture commits, diffs, and
              decision notes, runs deterministic risk analysis, and generates an AI change brief
              where every claim is cited — or explicitly marked as inference. The brief is published
              to the PR only after human approval.
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
                  Decision notes recorded while you work become the evidence your briefs cite —
                  never invented after the fact.
                </p>
              </div>
              <div className="rounded-lg bg-surface p-6 transition-colors hover:bg-surface-2">
                <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
                  🛡️ Cited, not guessed
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  Gold chips link claims to commits and files; violet chips mark inference.
                  Reviewers know exactly what to trust.
                </p>
              </div>
            </div>
          </section>

          <section id="installation" className="mt-14">
            <h2 className="border-b border-hairline pb-3 text-2xl font-semibold tracking-tight">
              Quick start
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              The backend is a Spring Boot service with a Docker Compose setup. Prerequisites: Java
              21 and Docker &amp; Docker Compose.
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
              at its JWKS endpoint. Identity, signup, and email OTP all live in Clerk — the backend
              only verifies tokens.
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
                    <th className="border border-hairline p-2 font-semibold text-foreground">
                      DDL
                    </th>
                    <th className="border border-hairline p-2 font-semibold text-foreground">
                      CORS
                    </th>
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
              <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
                PROD_DB_URL
              </code>
              ,{' '}
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
              <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
                CLERK_JWKS_URL
              </code>
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

          <section id="data-models" className="mt-14">
            <h2 className="border-b border-hairline pb-3 text-2xl font-semibold tracking-tight">
              Data models
            </h2>
            <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">
              Seven Flyway migrations (V1–V7) on Postgres. Key entities:
            </p>
            <div className="mt-4 space-y-2 font-mono text-[13px]">
              <p className="rounded border border-hairline bg-surface p-3">
                <span className="text-primary">users</span> — id, clerk_id (unique), email,
                full_name, github_username
              </p>
              <p className="rounded border border-hairline bg-surface p-3">
                <span className="text-primary">github_connections</span> — user_id, encrypted PAT,
                username, last_validated_at
              </p>
              <p className="rounded border border-hairline bg-surface p-3">
                <span className="text-primary">change_threads</span> — user_id, repo, head/base
                branch, status, risk flags
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
              Identity is fully outsourced to Clerk. The backend never stores passwords — it
              verifies Clerk-issued RS256 JWTs against the Clerk JWKS endpoint and mirrors the user
              into <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">users</code>{' '}
              on first sight.
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
                Configure these claims in the Clerk dashboard under Session Tokens — the backend
                reads{' '}
                <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">sub</code>,{' '}
                <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">email</code>,
                and{' '}
                <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">fullName</code>
                .
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
                    <th className="border border-hairline p-2 font-semibold text-foreground">
                      Module
                    </th>
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
                    <td className="border border-hairline p-2">
                      CRUD (thread-scoped + global list)
                    </td>
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
              <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
                ApiResponse
              </code>{' '}
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
              <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">develop</code>{' '}
              and <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">main</code>,
              and a Render Deploy Hook triggered on merge to{' '}
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
              <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs">
                delete_repo
              </code>{' '}
              scopes are ever requested.
            </p>
          </section>

          {/* Pagination */}
          <div className="mt-16 flex items-center justify-between border-t border-hairline pt-8">
            <span className="text-sm text-muted-foreground/50">Previous</span>
            <a
              href="#installation"
              className="flex items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary-hover"
            >
              Next: Installation <ChevronRight className="size-4" />
            </a>
          </div>
        </article>

        {/* Right TOC */}
        <aside className="sticky top-24 hidden w-48 shrink-0 xl:block">
          <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            On this page
          </p>
          <ul className="space-y-0.5 border-l border-hairline">
            {toc.map((id) => (
              <li key={id}>
                <a
                  href={`#${id}`}
                  className="block border-l-2 border-transparent px-3 py-1 font-mono text-[13px] text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                >
                  {allSections.find((s) => s.id === id)?.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </MarketingPage>
  )
}
