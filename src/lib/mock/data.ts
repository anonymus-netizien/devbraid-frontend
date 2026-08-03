import type {
  ChangeThread,
  DecisionNote,
  ChangeBrief,
  GitRepository,
  Branch,
  GitHubConnection,
  User,
} from '../../types'

export const mockUser: User = {
  id: 1,
  name: 'Alex Chen',
  email: 'alex@devbraid.com',
  phone: '9876543210',
  role: 'ROLE_USER',
  emailVerified: true,
}

export const mockRepos: GitRepository[] = [
  { fullName: 'acme/web-platform', defaultBranch: 'main', isPrivate: true },
  { fullName: 'acme/api-gateway', defaultBranch: 'main', isPrivate: true },
  { fullName: 'acme/shared-libs', defaultBranch: 'develop', isPrivate: false },
]

export const mockBranches: Branch[] = [
  { name: 'main' },
  { name: 'develop' },
  { name: 'feat/user-auth' },
  { name: 'fix/rate-limiting' },
]

export const mockThreads: ChangeThread[] = [
  {
    id: '1',
    title: 'Add rate limiting to public API',
    repo: 'acme/web-platform',
    headBranch: 'feat/rate-limit',
    baseBranch: 'main',
    issueNumber: 142,
    status: 'ready',
    riskFlags: ['PUBLIC_API', 'CI'],
    notesCount: 3,
    createdAt: '2026-07-25T14:00:00Z',
    updatedAt: '2026-07-27T09:15:00Z',
  },
  {
    id: '2',
    title: 'Refactor auth middleware',
    repo: 'acme/api-gateway',
    headBranch: 'refactor/auth',
    baseBranch: 'develop',
    status: 'analyzing',
    riskFlags: ['AUTH'],
    notesCount: 1,
    createdAt: '2026-07-26T11:00:00Z',
    updatedAt: '2026-07-27T10:00:00Z',
  },
  {
    id: '3',
    title: 'Update database migrations for v2',
    repo: 'acme/web-platform',
    headBranch: 'db/v2-migrations',
    baseBranch: 'main',
    status: 'drafting',
    riskFlags: ['MIGRATIONS'],
    notesCount: 0,
    createdAt: '2026-07-27T08:00:00Z',
    updatedAt: '2026-07-27T08:00:00Z',
  },
]

export const mockNotes: DecisionNote[] = [
  {
    id: '1',
    threadId: '1',
    decision: 'Use sliding window rate limiter with Redis backend',
    rationale:
      'Distributed rate limiting required for multi-instance deployment. Redis provides atomic operations.',
    alternatives:
      'In-memory rate limiting (rejected: not distributed), API gateway rate limiting (rejected: too coarse)',
    impact: 'Adds Redis dependency, ~2ms latency per request for rate limit check',
    createdAt: '2026-07-25T15:00:00Z',
  },
  {
    id: '2',
    threadId: '1',
    decision: 'Rate limit: 100 requests per minute per API key',
    rationale:
      'Based on traffic analysis of current API consumers. Top 10% of consumers peak at ~80 req/min.',
    alternatives:
      '50 req/min (rejected: too restrictive), 200 req/min (rejected: insufficient protection)',
    impact: 'May affect high-volume consumers; need monitoring dashboard',
    createdAt: '2026-07-25T16:30:00Z',
  },
]

export const mockBriefs: ChangeBrief[] = [
  {
    id: '1',
    threadId: '1',
    title: 'Rate Limiting Implementation Brief',
    status: 'ready',
    sections: [
      {
        title: 'Summary',
        claims: [
          {
            text: 'Adds sliding window rate limiting using Redis to the public API endpoints.',
            citations: [{ type: 'commit', value: 'a1b2c3d' }],
            provenance: 'cited',
          },
        ],
      },
      {
        title: 'Changes',
        claims: [
          {
            text: 'New RateLimiter middleware intercepts all /api/v1/* requests.',
            citations: [{ type: 'file', value: 'src/middleware/rate-limiter.ts' }],
            provenance: 'cited',
          },
          {
            text: 'Configuration allows per-endpoint customization via rateLimit.yaml.',
            citations: [{ type: 'file', value: 'config/rateLimit.yaml' }],
            provenance: 'inference',
          },
        ],
      },
    ],
    unresolvedQuestions: [
      'Should we add a rate-limit-exceeded metric to the monitoring dashboard?',
    ],
    createdAt: '2026-07-26T10:00:00Z',
    updatedAt: '2026-07-27T09:00:00Z',
  },
]

export const mockChangedFiles = [
  { path: 'src/middleware/rate-limiter.ts', additions: 87, deletions: 0 },
  { path: 'src/config/rateLimit.yaml', additions: 12, deletions: 0 },
  { path: 'src/tests/rate-limiter.test.ts', additions: 45, deletions: 0 },
  { path: 'src/index.ts', additions: 3, deletions: 1 },
]

export const mockCommits = [
  {
    sha: 'a1b2c3d',
    message: 'feat: add Redis-based sliding window rate limiter',
    timestamp: '2026-07-25T14:30:00Z',
  },
  {
    sha: 'e4f5g6h',
    message: 'test: add rate limiter unit tests',
    timestamp: '2026-07-25T16:00:00Z',
  },
  {
    sha: 'i7j8k9l',
    message: 'config: add rateLimit.yaml schema',
    timestamp: '2026-07-26T09:00:00Z',
  },
]
