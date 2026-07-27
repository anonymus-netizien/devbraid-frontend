import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHeader } from '../components/devbraid/page-header'
import { StatusDot } from '../components/devbraid/status-dot'
import { RiskChip } from '../components/devbraid/risk-chip'
import { BranchPair } from '../components/devbraid/branch-pair'
import { mockThreads, mockBriefs, mockConnections, mockUser } from '../lib/mock/data'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const activeThreads = mockThreads.filter(t => t.status !== 'published')
  const publishedBriefs = mockBriefs.filter(b => b.status === 'published')

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title={`${greeting}, ${mockUser.name.split(' ')[0]}.`}
        description={`${activeThreads.length} change thread${activeThreads.length !== 1 ? 's' : ''} in flight.`}
      />

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-xl border border-hairline bg-surface p-5">
          <p className="text-sm text-muted-foreground mb-1">Active threads</p>
          <p className="text-3xl font-bold text-foreground">{activeThreads.length}</p>
          <p className="text-xs text-muted-foreground mt-1">{mockThreads.length} total · {mockThreads.filter(t => t.status === 'ready').length} ready to publish</p>
        </div>
        <div className="rounded-xl border border-hairline bg-surface p-5">
          <p className="text-sm text-muted-foreground mb-1">Published briefs</p>
          <p className="text-3xl font-bold text-foreground">{publishedBriefs.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Posted to GitHub as PR comments</p>
        </div>
        <div className="rounded-xl border border-hairline bg-surface p-5">
          <p className="text-sm text-muted-foreground mb-1">Connections</p>
          <p className="text-3xl font-bold text-foreground">{mockConnections.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Active GitHub PATs</p>
        </div>
      </div>

      {/* Recent threads */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Recent change threads</h2>
          <Link to="/threads" className="text-sm text-primary hover:underline">View all →</Link>
        </div>
        <div className="rounded-xl border border-hairline overflow-hidden">
          {mockThreads.map((thread) => (
            <Link
              key={thread.id}
              to="/threads/$id"
              params={{ id: thread.id }}
              className="flex items-center gap-4 px-5 py-4 border-b border-hairline last:border-0 hover:bg-surface/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{thread.title}</p>
                <p className="text-xs text-muted-foreground">{thread.repo}</p>
              </div>
              <BranchPair head={thread.headBranch} base={thread.baseBranch} />
              <div className="flex gap-1">{thread.riskFlags.map(f => <RiskChip key={f} flag={f} />)}</div>
              <StatusDot status={thread.status} label />
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
