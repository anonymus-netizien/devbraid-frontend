import { useState, useEffect } from 'react'
import { createFileRoute, Link, Outlet, useRouterState } from '@tanstack/react-router'
import { PageHeader } from '../components/devbraid/page-header'
import { StatusDot } from '../components/devbraid/status-dot'
import { RiskChip } from '../components/devbraid/risk-chip'
import { BranchPair } from '../components/devbraid/branch-pair'
import { EmptyState } from '../components/devbraid/empty-state'
import { CreateThreadDialog } from '../components/devbraid/create-thread-dialog'
import { threadService } from '../services/thread.service'
import { mockThreads } from '../lib/mock/data'
import type { ChangeThread } from '../types/thread'
import { RefreshCw, Search, ShieldAlert } from 'lucide-react'

export const Route = createFileRoute('/threads')({
  component: ThreadsPage,
})

function ThreadsPage() {
  const { location } = useRouterState()
  const isDetailPage = location.pathname.startsWith('/threads/') && location.pathname !== '/threads'

  const [threads, setThreads] = useState<ChangeThread[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const fetchThreads = async () => {
    setLoading(true)
    try {
      const data = await threadService.listThreads(0, 50)
      if (data && data.content) {
        setThreads(data.content)
      } else {
        // Fallback to mock data if empty API response
        setThreads(mockThreads as unknown as ChangeThread[])
      }
    } catch (err) {
      console.warn('Backend threads unavailable, using mock data:', err)
      setThreads(mockThreads as unknown as ChangeThread[])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchThreads()
  }, [])

  const filtered = threads.filter((t) => {
    const repoName = t.repositoryFullName || (t as unknown as { repo: string }).repo || ''
    const matchesSearch =
      !search ||
      t.title.toLowerCase().includes(search.toLowerCase()) ||
      repoName.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      statusFilter === 'all' || t.status.toLowerCase() === statusFilter.toLowerCase()
    return matchesSearch && matchesStatus
  })

  // When viewing a thread detail page, render the child route component
  if (isDetailPage) {
    return <Outlet />
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Change Threads"
        description="A change thread pairs a GitHub branch with your reasoning. Start one when you begin work, close it when the brief is posted."
        action={
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={fetchThreads}
              disabled={loading}
              className="p-2 rounded-lg bg-surface border border-hairline text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors disabled:opacity-50"
              title="Refresh threads"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <CreateThreadDialog onThreadCreated={(newThread) => setThreads((prev) => [newThread, ...prev])} />
          </div>
        }
      />

      {/* Filters Bar */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search threads…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search threads"
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-surface border border-hairline text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          aria-label="Filter by status"
          className="px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        >
          <option value="all">All status</option>
          <option value="drafting">Drafting</option>
          <option value="analyzing">Analyzing</option>
          <option value="ready">Ready</option>
          <option value="published">Published</option>
        </select>

        <span className="text-xs text-muted-foreground ml-auto">
          {filtered.length} of {threads.length} threads
        </span>
      </div>

      {/* Threads List */}
      {loading ? (
        <div className="rounded-xl border border-hairline p-8 text-center text-muted-foreground text-sm space-y-3">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary" />
          <p>Loading Change Threads...</p>
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState title="No threads found" description="Start one when you begin work on a branch." />
      ) : (
        <div className="rounded-xl border border-hairline divide-y divide-hairline overflow-hidden bg-surface">
          {filtered.map((thread) => {
            const repoName = thread.repositoryFullName || (thread as unknown as { repo: string }).repo
            const notesCount = thread.notesCount || (thread.decisionNotes ? thread.decisionNotes.length : 0)
            const riskFlags = thread.riskFlags || []

            return (
              <Link
                key={thread.id}
                to="/threads/$id"
                params={{ id: thread.id }}
                className="flex items-center gap-4 px-5 py-4 hover:bg-surface-2/60 transition-all group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-foreground truncate group-hover:text-primary transition-colors">
                      {thread.title}
                    </p>
                    {thread.riskScore && thread.riskScore > 0 ? (
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono font-medium bg-danger-bg text-danger-fg border border-danger-border">
                        <ShieldAlert className="h-3 w-3" />
                        Risk: {thread.riskScore}
                      </span>
                    ) : null}
                  </div>
                  <p className="text-xs text-muted-foreground font-mono">
                    {repoName}
                  </p>
                </div>

                <BranchPair head={thread.headBranch} base={thread.baseBranch} />

                <div className="flex gap-1.5">
                  {riskFlags.map((f) => (
                    <RiskChip key={f} flag={f} />
                  ))}
                </div>

                <span className="text-xs text-muted-foreground font-mono">
                  {notesCount} {notesCount === 1 ? 'note' : 'notes'}
                </span>

                <StatusDot status={thread.status.toLowerCase() as any} label />
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
