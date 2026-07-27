import { useState } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { PageHeader } from '../components/devbraid/page-header'
import { StatusDot } from '../components/devbraid/status-dot'
import { RiskChip } from '../components/devbraid/risk-chip'
import { BranchPair } from '../components/devbraid/branch-pair'
import { EmptyState } from '../components/devbraid/empty-state'
import { mockThreads } from '../lib/mock/data'

export const Route = createFileRoute('/threads')({
  component: ThreadsPage,
})

function ThreadsPage() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filtered = mockThreads.filter(t => {
    const matchesSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.repo.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Change Threads"
        description="A change thread pairs a GitHub branch with your reasoning. Start one when you begin work, close it when the brief is posted."
        action={
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" aria-hidden="true" />
            New thread
          </button>
        }
      />

      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <input
          type="text"
          placeholder="Search threads…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search threads"
          className="flex-1 max-w-xs px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
        />
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
        <span className="text-sm text-muted-foreground">{filtered.length} of {mockThreads.length}</span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No threads yet" description="Start one when you begin work on a branch." />
      ) : (
        <div className="rounded-xl border border-hairline overflow-hidden">
          {filtered.map((thread) => (
            <Link
              key={thread.id}
              to="/threads/$id"
              params={{ id: thread.id }}
              className="flex items-center gap-4 px-5 py-4 border-b border-hairline last:border-0 hover:bg-surface/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{thread.title}</p>
                <p className="text-xs text-muted-foreground">{thread.repo}{thread.issueNumber ? ` #${thread.issueNumber}` : ''}</p>
              </div>
              <BranchPair head={thread.headBranch} base={thread.baseBranch} />
              <div className="flex gap-1">{thread.riskFlags.map(f => <RiskChip key={f} flag={f} />)}</div>
              <span className="text-xs text-muted-foreground">{thread.notesCount} notes</span>
              <StatusDot status={thread.status} label />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
