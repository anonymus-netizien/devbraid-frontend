import { useEffect, useMemo, useState } from 'react'
import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search } from 'lucide-react'
import { PageHeader, LoadingRows, EmptyState, ErrorPanel } from '@/components/devbraid/states'
import { BranchPair, RiskChip, StatusDot } from '@/components/devbraid/chips'
import { CreateThreadDialog } from '@/components/devbraid/create-thread-dialog'
import { queryKeys } from '@/hooks/queries'
import { threadService } from '@/services/thread.service'
import type { ChangeThread } from '@/types/thread'

export const Route = createFileRoute('/threads')({
  component: ThreadsPage,
})

const statusFilters = ['all', 'draft', 'analyzing', 'ready', 'published'] as const

/** Backend lifecycle statuses are uppercase; the UI chips are lowercase labels. */
const STATUS_TO_BACKEND: Record<string, string> = {
  draft: 'DRAFT',
  analyzing: 'ANALYZING',
  ready: 'READY',
  published: 'PUBLISHED',
}

function ThreadsPage() {
  const { location } = useRouterState()
  const isDetailPage = location.pathname.startsWith('/threads/') && location.pathname !== '/threads'
  const [open, setOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [repoFilter, setRepoFilter] = useState<string>('all')
  const [q, setQ] = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')

  // Debounce the keyword search before hitting the server.
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQ(q), 300)
    return () => clearTimeout(timer)
  }, [q])

  const isSearching = debouncedQ.trim().length > 0
  const backendStatus = STATUS_TO_BACKEND[statusFilter] ?? null

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: isSearching
      ? queryKeys.threadsSearch(debouncedQ)
      : statusFilter === 'all'
        ? queryKeys.threads
        : queryKeys.threadsByStatus(backendStatus as string),
    queryFn: () =>
      isSearching
        ? threadService.searchThreads(debouncedQ.trim(), 0, 50)
        : statusFilter === 'all'
          ? threadService.listThreads(0, 50)
          : threadService.searchByStatus(backendStatus as string, 0, 50),
  })

  const threads = data?.content ?? []

  const repos = useMemo(
    () =>
      [
        ...new Set(
          threads
            .map((t: ChangeThread) => t.repositoryFullName)
            .filter((r): r is string => Boolean(r)),
        ),
      ].sort(),
    [threads],
  )

  const filtered = useMemo(
    () =>
      repoFilter === 'all'
        ? threads
        : threads.filter((t: ChangeThread) => t.repositoryFullName === repoFilter),
    [threads, repoFilter],
  )

  if (isDetailPage) return <Outlet />

  return (
    <div className="mx-auto w-full max-w-6xl">
      <PageHeader
        eyebrow="Workspace"
        title="Change Threads"
        description="A thread braids your decision notes with the GitHub evidence for one unit of change."
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => refetch()}
              disabled={isLoading}
              className="btn btn-ghost btn-md"
            >
              Refresh
            </button>
            <button type="button" onClick={() => setOpen(true)} className="btn btn-primary btn-md">
              <Plus className="size-3.5" /> New thread
            </button>
          </div>
        }
      />

      {/* Filters */}
      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-1.5">
          {statusFilters.map((s) => (
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

        <div className="flex items-center gap-2">
          {repos.length > 1 && (
            <select
              value={repoFilter}
              onChange={(e) => setRepoFilter(e.target.value)}
              className="input input-md w-auto max-w-40 text-xs text-foreground border border-hairline bg-surface/60 pr-7"
              title="Filter by repository"
            >
              <option value="all">All repos</option>
              {repos.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          )}
          <div className="relative w-full lg:w-64">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={isSearching ? 'Searching\u2026' : 'Search threads\u2026'}
              className="input input-md w-full pl-8 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/40 border border-hairline bg-surface/60"
            />
          </div>
        </div>
      </div>

      {isLoading ? (
        <LoadingRows rows={5} />
      ) : isError ? (
        <ErrorPanel
          code="E_THREADS"
          message="Couldn't load change threads."
          onRetry={() => refetch()}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No change threads match"
          description="Adjust your filters, or start a new thread."
          action={
            <button type="button" onClick={() => setOpen(true)} className="btn btn-primary btn-md">
              New thread
            </button>
          }
        />
      ) : (
        <div className="overflow-hidden rounded-lg">
          {filtered.map((t: ChangeThread) => (
            <Link
              key={t.id}
              to="/threads/$id"
              params={{ id: t.id }}
              className="block bg-surface/20 px-4 py-3 transition-colors hover:bg-surface/60"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <StatusDot status={t.status.toLowerCase()} />
                    <span className="truncate text-[13px] font-medium">{t.title}</span>
                  </div>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2 font-mono text-[11px] text-muted-foreground">
                    <span>{t.repositoryFullName}</span>
                    <span className="hidden sm:inline">·</span>
                    <span className="hidden sm:inline">
                      <BranchPair head={t.headBranch} base={t.baseBranch} />
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {t.riskFlags?.map((r: string) => (
                      <RiskChip key={r} flag={r} dense />
                    ))}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-[11px] tabular-nums text-muted-foreground">
                    {t.notesCount ?? 0} notes
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-muted-foreground/70">
                    {t.updatedAt
                      ? new Date(t.updatedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })
                      : ''}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      <CreateThreadDialog open={open} onOpenChange={setOpen} />
    </div>
  )
}
