import type { ChangeThread, DecisionNote, ChangeBrief, GitRepository, Branch, GitHubConnection, User } from '../../types'

export const mockUser: User = {
  id: 1,
  name: 'Alex Chen',
  email: 'alex@devbraid.com',
  phone: '9876543210',
  role: 'ROLE_USER',
  emailVerified: true,
}

export const repos: GitRepository[] = [
  { fullName: 'acme/gateway', defaultBranch: 'main', isPrivate: true, id: 'r1', name: 'acme/gateway' },
  { fullName: 'acme/console', defaultBranch: 'main', isPrivate: true, id: 'r2', name: 'acme/console' },
  { fullName: 'acme/edge-runtime', defaultBranch: 'trunk', isPrivate: false, id: 'r3', name: 'acme/edge-runtime' },
  { fullName: 'acme/billing-svc', defaultBranch: 'main', isPrivate: true, id: 'r4', name: 'acme/billing-svc' },
]

// Backward compatibility aliases
export const mockRepos = repos

export const connections: GitHubConnection[] = [
  {
    id: 'c1',
    githubUsername: 'alex-vane',
    connectedAt: '2026-06-14T09:12:00Z',
    lastValidatedAt: '2026-07-24T11:02:00Z',
    scopes: ['repo', 'read:user'],
    username: 'alex-vane',
    addedAt: '2026-06-14T09:12:00Z',
    lastUsedAt: '2026-07-24T11:02:00Z',
    status: 'active',
    repos: 12,
  },
  {
    id: 'c2',
    githubUsername: 'alex-vane-bot',
    connectedAt: '2026-03-02T15:44:00Z',
    lastValidatedAt: '2026-07-19T18:30:00Z',
    scopes: ['repo'],
    username: 'alex-vane-bot',
    addedAt: '2026-03-02T15:44:00Z',
    lastUsedAt: '2026-07-19T18:30:00Z',
    status: 'expired',
    repos: 3,
  },
]

// Backward compatibility alias
export const mockConnections = connections

export const branches: Branch[] = [
  { name: 'main' },
  { name: 'develop' },
  { name: 'feat/auth-rs256' },
  { name: 'fix/rate-limiting' },
]

// Backward compatibility alias
export const mockBranches = branches

export type RiskFlag = 'MIGRATIONS' | 'PUBLIC_API' | 'AUTH' | 'DEPENDENCY' | 'CI'

export const riskLabels: Record<RiskFlag, string> = {
  MIGRATIONS: 'Migrations',
  PUBLIC_API: 'Public API',
  AUTH: 'Auth',
  DEPENDENCY: 'Dependency',
  CI: 'CI',
}

export type Commit = {
  sha: string
  message: string
  author: string
  when: string
}

export type ChangedFile = {
  path: string
  added: number
  removed: number
  status: 'modified' | 'added' | 'deleted'
}

export type ThreadStatus = 'drafting' | 'analyzing' | 'ready' | 'published'

export type Thread = {
  id: string
  slug: string
  title: string
  repo: string
  headBranch: string
  baseBranch: string
  issue?: string
  status: ThreadStatus
  risks: RiskFlag[]
  notesCount: number
  updatedAt: string
  createdAt: string
  commits: Commit[]
  files: ChangedFile[]
  briefId?: string
}

export const threads: Thread[] = [
  {
    id: 't1',
    slug: 'auth-rs256-refactor',
    title: 'Refactor JWT authentication to use RS256 providers',
    repo: 'acme/gateway',
    headBranch: 'feat/auth-rs256',
    baseBranch: 'main',
    issue: 'INFRA-922',
    status: 'ready',
    risks: ['AUTH', 'MIGRATIONS', 'PUBLIC_API'],
    notesCount: 2,
    updatedAt: '2026-07-24T11:40:00Z',
    createdAt: '2026-07-24T09:00:00Z',
    commits: [
      { sha: 'a1b2c3d', message: 'feat: implement RS256 verifier and rotate signing key', author: 'alex-vane', when: '2h ago' },
      { sha: 'f4e2g1h', message: 'refactor: extract token validator into shared middleware', author: 'alex-vane', when: '3h ago' },
      { sha: '9d7e4c2', message: 'chore: bump jose to 5.9.4, drop node-jose', author: 'alex-vane', when: '5h ago' },
      { sha: '7a2b3c1', message: 'sql: add auth_provider table + backfill migration', author: 'alex-vane', when: 'yesterday' },
    ],
    files: [
      { path: 'src/auth/middleware.ts', added: 142, removed: 12, status: 'modified' },
      { path: 'src/auth/oidc.ts', added: 156, removed: 0, status: 'added' },
      { path: 'src/auth/legacy-jwt.ts', added: 0, removed: 88, status: 'deleted' },
      { path: 'config/auth.yaml', added: 4, removed: 0, status: 'modified' },
      { path: 'migrations/2026_07_auth_provider.sql', added: 22, removed: 0, status: 'added' },
    ],
    briefId: 'b1',
  },
  {
    id: 't2',
    slug: 'billing-pdf-edge',
    title: 'Billing invoice PDF generator on edge worker',
    repo: 'acme/billing-svc',
    headBranch: 'feat/edge-pdf',
    baseBranch: 'main',
    issue: 'BILL-311',
    status: 'published',
    risks: ['DEPENDENCY', 'CI'],
    notesCount: 4,
    updatedAt: '2026-07-22T09:00:00Z',
    createdAt: '2026-07-20T14:00:00Z',
    commits: [],
    files: [],
    briefId: 'b2',
  },
  {
    id: 't3',
    slug: 'analytics-pgbouncer',
    title: 'Introduce pg_bouncer transaction pooling for analytics',
    repo: 'acme/console',
    headBranch: 'chore/pgbouncer',
    baseBranch: 'main',
    status: 'analyzing',
    risks: ['MIGRATIONS'],
    notesCount: 1,
    updatedAt: '2026-07-23T16:00:00Z',
    createdAt: '2026-07-23T14:00:00Z',
    commits: [],
    files: [],
  },
  {
    id: 't4',
    slug: 'edge-runtime-cache-hdr',
    title: 'Honor Cache-Control: private on edge runtime responses',
    repo: 'acme/edge-runtime',
    headBranch: 'fix/cache-private',
    baseBranch: 'trunk',
    status: 'drafting',
    risks: ['PUBLIC_API'],
    notesCount: 0,
    updatedAt: '2026-07-24T08:15:00Z',
    createdAt: '2026-07-24T08:00:00Z',
    commits: [],
    files: [],
  },
]

// Backward compatibility alias
export const mockThreads = threads

export function getThread(id: string) {
  return threads.find((t) => t.id === id || t.slug === id)
}

export type BriefClaim = {
  text: string
  citations?: Array<{ kind: 'c' | 'f'; ref: string }>
  inference?: boolean
}

export type BriefSection = {
  heading: string
  claims: BriefClaim[]
}

export type Brief = {
  id: string
  threadId: string
  title: string
  status: 'draft' | 'published'
  updatedAt: string
  sections: BriefSection[]
  unresolved: string[]
}

export const briefs: Brief[] = [
  {
    id: 'b1',
    threadId: 't1',
    title: 'Refactor JWT authentication to use RS256 providers',
    status: 'draft',
    updatedAt: '2026-07-24T11:40:00Z',
    sections: [
      {
        heading: 'Structural changes',
        claims: [
          {
            text: 'A new middleware layer wraps token validation so the OIDC provider can intercept requests without touching legacy call sites.',
            citations: [{ kind: 'f', ref: 'src/auth/middleware.ts' }],
          },
          {
            text: 'The legacy HS256 path is removed entirely rather than deprecated — every caller now routes through the shared verifier.',
            citations: [
              { kind: 'f', ref: 'src/auth/legacy-jwt.ts' },
              { kind: 'c', ref: 'f4e2g1h' },
            ],
          },
          {
            text: 'This change likely reduces cold-start on the edge runtime because the jose bundle is smaller than node-jose.',
            inference: true,
          },
        ],
      },
      {
        heading: 'Security implications',
        claims: [
          {
            text: 'Only the identity provider holds the private key; downstream services verify with a rotated public key via ConfigMap.',
            citations: [{ kind: 'c', ref: 'a1b2c3d' }],
          },
          {
            text: 'Key rotation runs in a background worker, which may introduce a warm-cache race on cold restarts.',
            inference: true,
          },
          {
            text: 'The public API surface for token validation remains backwards compatible.',
            citations: [{ kind: 'f', ref: 'config/auth.yaml' }],
          },
        ],
      },
      {
        heading: 'Data & migrations',
        claims: [
          {
            text: 'Adds an auth_provider table and backfills existing rows in a single transaction.',
            citations: [{ kind: 'f', ref: 'migrations/2026_07_auth_provider.sql' }],
          },
          {
            text: 'The migration is idempotent so a rerun during rollout is safe.',
            inference: true,
          },
        ],
      },
    ],
    unresolved: [
      'Should key rotation be automated via a CRD, or manual for the first release?',
      'Do we need a one-time forced logout for active sessions on deploy?',
    ],
  },
  {
    id: 'b2',
    threadId: 't2',
    title: 'Billing invoice PDF generator on edge worker',
    status: 'published',
    updatedAt: '2026-07-22T09:00:00Z',
    sections: [],
    unresolved: [],
  },
]

// Backward compatibility alias
export const mockBriefs = briefs.map(b => ({
  ...b,
  status: b.status as 'draft' | 'ready' | 'published',
  sections: b.sections.map(s => ({
    ...s,
    title: s.heading,
    claims: s.claims.map(c => ({
      ...c,
      citations: (c.citations || []).map(ct => ({ type: ct.kind === 'c' ? 'commit' as const : 'file' as const, value: ct.ref })),
      provenance: c.inference ? 'inference' as const : 'cited' as const,
    })),
  })),
  unresolvedQuestions: b.unresolved,
}))

export function getBrief(id: string) {
  return briefs.find((b) => b.id === id)
}

export type DecisionNote = {
  id: string
  threadId: string
  decision: string
  rationale: string
  alternatives: string
  impact: string
  createdAt: string
}

export const decisionNotes: DecisionNote[] = [
  {
    id: 'n1',
    threadId: 't1',
    decision: 'Standardize on RS256 signing for all internal service-mesh tokens.',
    rationale: 'HS256 requires symmetric secret sharing across nodes, increasing blast radius if a single node is compromised. RS256 lets nodes verify with a public key.',
    alternatives: 'EdDSA was considered but rejected — limited support in the legacy Go runtime libraries we still ship.',
    impact: 'High. Requires a one-time manual rotation of Kubernetes secrets in staging and prod.',
    createdAt: '2026-07-24T10:12:00Z',
  },
  {
    id: 'n2',
    threadId: 't1',
    decision: 'Move key rotation to a background worker rather than request-time.',
    rationale: 'Request-time rotation added ~40ms P95 latency in load tests; a worker keeps the hot path clean.',
    alternatives: 'Rotate inline behind a mutex — rejected because a mutex on every request is worse than the current cost.',
    impact: 'Medium. Adds a new worker deployment; needs monitoring for stale keys.',
    createdAt: '2026-07-24T10:45:00Z',
  },
  {
    id: 'n3',
    threadId: 't3',
    decision: 'Adopt pg_bouncer transaction pooling for the analytics service.',
    rationale: 'Connection storms during report generation exhaust the primary; pooling smooths this out.',
    alternatives: 'Increase max_connections — rejected, doesn\'t fix the burst pattern and costs memory.',
    impact: 'Low. Contained to one service.',
    createdAt: '2026-07-23T16:00:00Z',
  },
]

// Backward compatibility alias
export const mockNotes = decisionNotes

export function notesForThread(threadId: string) {
  return decisionNotes.filter((n) => n.threadId === threadId)
}

export const mockChangedFiles = [
  { path: 'src/middleware/rate-limiter.ts', additions: 87, deletions: 0 },
  { path: 'src/config/rateLimit.yaml', additions: 12, deletions: 0 },
  { path: 'src/tests/rate-limiter.test.ts', additions: 45, deletions: 0 },
  { path: 'src/index.ts', additions: 3, deletions: 1 },
]

export const mockCommits = [
  { sha: 'a1b2c3d', message: 'feat: add Redis-based sliding window rate limiter', timestamp: '2026-07-25T14:30:00Z' },
  { sha: 'e4f5g6h', message: 'test: add rate limiter unit tests', timestamp: '2026-07-25T16:00:00Z' },
  { sha: 'i7j8k9l', message: 'config: add rateLimit.yaml schema', timestamp: '2026-07-26T09:00:00Z' },
]
