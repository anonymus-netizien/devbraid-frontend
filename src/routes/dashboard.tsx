import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { ArrowUpRight, FileText, GitPullRequest, Github, Plus, StickyNote } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PageHeader, LoadingRows, EmptyState, ErrorPanel } from '@/components/devbraid/states'
import { BranchPair, RiskChip, StatusDot } from '@/components/devbraid/chips'
import { AnimatedCounter } from '@/components/ui/animated-counter'
import { useAuth } from '@/context/AuthContext'
import {
  useGitHubStatusQuery,
  useReposQuery,
  useThreadsQuery,
  useNotesQuery,
  useBriefsQuery,
} from '@/hooks/queries'
import type { ChangeThread } from '@/types/thread'

export const Route = createFileRoute('/dashboard')({
  head: () => ({
    meta: [
      { title: 'Dashboard · DevBraid' },
      {
        name: 'description',
        content: 'Your change threads, decision notes, and brief activity at a glance.',
      },
      { property: 'og:title', content: 'DevBraid · Dashboard' },
      {
        property: 'og:description',
        content: 'Change threads, decision notes, and briefs at a glance.',
      },
    ],
  }),
  component: DashboardPage,
})

function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  to,
}: {
  label: string
  value: number
  hint: string
  icon: typeof FileText
  to: string
}) {
  return (
    <Link
      to={to}
      className="group block rounded-lg bg-surface/50 p-5 transition-all duration-200 hover:border-primary/30 hover:bg-surface"
    >
      <div className="flex items-start justify-between">
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <Icon className="size-4 text-muted-foreground transition-colors group-hover:text-primary" />
      </div>
      <div className="mt-3 font-mono text-3xl font-semibold tracking-tight">
        <AnimatedCounter to={value} />
      </div>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </Link>
  )
}

function DashboardPage() {
  const { user } = useAuth()
  const [statusFilter, setStatusFilter] = useState('all')
  const { data: ghStatus } = useGitHubStatusQuery()
  const ghConnected = ghStatus ? (ghStatus.connected ?? false) && (ghStatus.valid ?? false) : null
  const { data: ghRepos } = useReposQuery(ghConnected === true)
  const repoCount = ghRepos?.length ?? 0

  const {
    data: threadsData,
    isLoading: threadsLoading,
    isError: threadsError,
    refetch: refetchThreads,
  } = useThreadsQuery()

  const { data: notesData } = useNotesQuery()
  const { data: briefsData } = useBriefsQuery()

  const threads = threadsData?.content ?? []
  const notes = notesData?.content ?? []
  const briefs = briefsData?.content ?? []
  const activeThreads = threads.filter((t: ChangeThread) => t.status !== 'PUBLISHED')

  const filtered = threads.filter((t: ChangeThread) => {
    if (statusFilter === 'all') return true
    return t.status.toLowerCase() === statusFilter.toLowerCase()
  })

  const hour = new Date().getHours()
  const greeting =
    hour >= 5 && hour < 12
      ? 'Good morning'
      : hour >= 12 && hour < 17
        ? 'Good afternoon'
        : hour >= 17 && hour < 22
          ? 'Good evening'
          : 'Working late'
  const firstName = user?.fullName?.split(' ')[0] ?? user?.email?.split('@')[0] ?? 'Developer'

  return (
    <div className="mx-auto w-full max-w-6xl">
      {ghConnected === false && (
        <div className="mb-6 rounded-lg border border-warning-border bg-warning-bg p-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-warning-fg">GitHub connection required</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Connect your Personal Access Token to inspect repositories and post PR briefs.
            </p>
          </div>
          <Link to="/connections" search={{}} className="btn btn-soft btn-md text-background">
            Connect PAT →
          </Link>
        </div>
      )}

      <PageHeader
        eyebrow="Workspace"
        title={`${greeting}, ${firstName}.`}
        description={`${activeThreads.length} change thread${activeThreads.length !== 1 ? 's' : ''} in flight.`}
        actions={
          <div className="flex items-center gap-3">
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-muted-foreground"
              title={
                ghConnected ? 'GitHub connection valid' : ghConnected === false ? 'No GitHub connection' : 'Checking GitHub connection\u2026'
              }
            >
              <span
                className={cn(
                  'size-1.5 rounded-full',
                  ghConnected ? 'bg-success' : ghConnected === false ? 'bg-danger' : 'bg-warning animate-pulse',
                )}
              />
              {ghConnected ? 'System healthy' : ghConnected === false ? 'Action needed' : 'Checking\u2026'}
            </span>
            <Link to="/threads" className="btn btn-primary btn-md">
              <Plus className="size-3.5" /> New thread
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard
          label="Open threads"
          value={activeThreads.length}
          hint="Drafting, analyzing, or ready"
          icon={GitPullRequest}
          to="/threads"
        />
        <StatCard
          label="Decision notes"
          value={notes.length}
          hint="Human-written reasoning"
          icon={StickyNote}
          to="/notes"
        />
        <StatCard
          label="Change briefs"
          value={briefs.length}
          hint="Drafted and published"
          icon={FileText}
          to="/briefs"
        />
        <StatCard
          label="Connections"
          value={ghConnected ? repoCount : 0}
          hint={ghConnected ? 'GitHub repos' : 'Not connected'}
          icon={Github}
          to="/connections"
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_300px]">
        {/* Threads table */}
        <div className="rounded-lg bg-surface/30">
          <div className="flex items-center justify-between px-4 py-3">
            <h2 className="text-sm font-semibold">Recent change threads</h2>
            <div className="flex items-center gap-2">
              {['all', 'draft', 'analyzing', 'ready', 'published'].map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`btn btn-xs rounded text-[10px] font-medium uppercase tracking-wider ${
                    statusFilter === s ? 'btn-soft' : 'btn-ghost text-muted-foreground'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {threadsLoading ? (
            <div className="p-4">
              <LoadingRows rows={4} />
            </div>
          ) : threadsError ? (
            <div className="p-4">
              <ErrorPanel
                code="E_DASHBOARD"
                message="Couldn't load change threads."
                onRetry={() => refetchThreads()}
              />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-4">
              <EmptyState title="No threads yet" description="Create one to get started." />
            </div>
          ) : (
            <div>
              {filtered.slice(0, 8).map((t: ChangeThread) => (
                <Link
                  key={t.id}
                  to="/threads/$id"
                  params={{ id: t.id }}
                  className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-surface/50"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <StatusDot status={t.status.toLowerCase()} />
                      <span className="truncate text-[13px] font-medium">{t.title}</span>
                    </div>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-mono">{t.repositoryFullName}</span>
                      <BranchPair head={t.headBranch} base={t.baseBranch} />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {t.riskFlags?.slice(0, 2).map((f: string) => (
                      <RiskChip key={f} flag={f} dense />
                    ))}
                    <span className="font-mono text-[11px] text-muted-foreground">
                      {t.notesCount || 0} notes
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="rounded-lg bg-surface/30 p-4">
            <h3 className="text-sm font-semibold">Latest notes</h3>
            <p className="text-xs text-muted-foreground mb-3">Always human-written.</p>
            {notes.length === 0 ? (
              <p className="text-xs text-muted-foreground">No notes yet.</p>
            ) : (
              <div className="space-y-2">
                {notes.slice(0, 3).map((n: any) => (
                  <Link
                    key={n.id}
                    to="/threads/$id"
                    params={{ id: n.threadId }}
                    className="block rounded border border-hairline bg-background/60 p-2.5 text-xs transition-colors hover:border-primary/30"
                  >
                    <p className="line-clamp-2 font-medium">{n.decision || n.content}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {n.authorName} · {new Date(n.createdAt).toLocaleDateString()}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-lg bg-surface/30 p-4">
            <h3 className="text-sm font-semibold mb-3">Briefs to review</h3>
            {briefs.length === 0 ? (
              <p className="text-xs text-muted-foreground">No briefs yet.</p>
            ) : (
              <div className="space-y-1">
                {briefs.slice(0, 4).map((b: any) => (
                  <Link
                    key={b.id}
                    to="/briefs/$id"
                    params={{ id: b.id }}
                    className="flex items-center justify-between gap-2 rounded px-2 py-1.5 text-xs transition-colors hover:bg-surface"
                  >
                    <span className="truncate">{b.title || b.threadTitle}</span>
                    <ArrowUpRight className="size-3 shrink-0 text-muted-foreground" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
