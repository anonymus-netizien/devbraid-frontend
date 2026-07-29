import { useMemo, useState } from 'react'
import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { Plus, Search } from 'lucide-react'
import { PageHeader, LoadingRows, EmptyState, ErrorPanel } from '@/components/devbraid/states'
import { BranchPair, RiskChip, StatusDot } from '@/components/devbraid/chips'
import { CreateThreadDialog } from '@/components/devbraid/create-thread-dialog'
import { threadService } from '@/services/thread.service'
import type { ChangeThread } from '@/types/thread'

export const Route = createFileRoute('/threads')({
  component: ThreadsPage,
})

const statusFilters = ['all', 'draft', 'analyzing', 'ready', 'published'] as const

function ThreadsPage() {
  const { location } = useRouterState()
  const isDetailPage = location.pathname.startsWith('/threads/') && location.pathname !== '/threads'
  const [open, setOpen] = useState(false)
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [q, setQ] = useState('')

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['threads'],
    queryFn: () => threadService.listThreads(0, 50),
  })

  const threads = data?.content ?? []

  const filtered = useMemo(
    () => threads.filter((t: ChangeThread) => {
      const repoName = t.repositoryFullName ?? ''
      const matchesSearch = !q || t.title.toLowerCase().includes(q.toLowerCase()) || repoName.toLowerCase().includes(q.toLowerCase())
      const matchesStatus = statusFilter === 'all' || t.status.toLowerCase() === statusFilter.toLowerCase()
      return matchesSearch && matchesStatus
    }),
    [threads, q, statusFilter],
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
              className="rounded-md border border-hairline bg-surface/60 px-2.5 py-1.5 text-xs text-muted-foreground hover:bg-surface transition-colors disabled:opacity-50"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 transition-colors"
            >
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
              className={`px-2.5 py-1 rounded text-[10px] font-medium uppercase tracking-wider transition-colors ${
                statusFilter === s
                  ? 'bg-surface text-foreground border border-hairline'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="relative w-full lg:w-64">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search threads\u2026"
            className="h-8 w-full rounded-md border border-hairline bg-surface/60 pl-8 pr-3 text-xs text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {isLoading ? (
        <LoadingRows rows={5} />
      ) : isError ? (
        <ErrorPanel code="E_THREADS" message="Couldn't load change threads." onRetry={() => refetch()} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No change threads match"
          description="Adjust your filters, or start a new thread."
          action={
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              New thread
            </button>
          }
        />
      ) : (
        <div className="divide-y divide-hairline overflow-hidden rounded-lg border border-hairline">
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
                    <span className="hidden sm:inline"><BranchPair head={t.headBranch} base={t.baseBranch} /></span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {t.riskFlags?.map((r: string) => <RiskChip key={r} flag={r} dense />)}
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="font-mono text-[11px] tabular-nums text-muted-foreground">
                    {t.notesCount ?? 0} notes
                  </div>
                  <div className="mt-1 font-mono text-[10px] text-muted-foreground/70">
                    {t.updatedAt ? new Date(t.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : ''}
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
