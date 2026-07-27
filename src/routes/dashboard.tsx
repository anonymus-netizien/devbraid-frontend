import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { PageHeader } from '../components/devbraid/page-header'
import { StatusDot } from '../components/devbraid/status-dot'
import { RiskChip } from '../components/devbraid/risk-chip'
import { BranchPair } from '../components/devbraid/branch-pair'
import { useAuth } from '../context/AuthContext'
import githubService from '../services/github.service'
import { mockThreads, mockBriefs } from '../lib/mock/data'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useAuth()
  const [ghConnected, setGhConnected] = useState<boolean | null>(null)
  const [repoCount, setRepoCount] = useState<number>(0)

  useEffect(() => {
    async function checkStatus() {
      try {
        const status = await githubService.getStatus()
        setGhConnected(status.connected && status.valid)
        if (status.connected && status.valid) {
          const repos = await githubService.listRepositories()
          setRepoCount(repos.length)
        }
      } catch {
        setGhConnected(false)
      }
    }
    checkStatus()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour >= 5 && hour < 12 ? 'Good morning' : hour >= 12 && hour < 17 ? 'Good afternoon' : hour >= 17 && hour < 22 ? 'Good evening' : 'Working late'
  const firstName = user?.fullName ? user.fullName.split(' ')[0] : user?.email ? user.email.split('@')[0] : 'Developer'
  const activeThreads = mockThreads.filter(t => t.status !== 'published')
  const publishedBriefs = mockBriefs.filter(b => b.status === 'published')

  return (
    <div>
      {ghConnected === false && (
        <div className="mb-6 rounded-lg border border-warning-border bg-warning-bg p-4 text-sm text-foreground flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-warning-fg">GitHub connection required</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Connect your Personal Access Token to inspect repositories and post PR briefs.
            </p>
          </div>
          <Link
            to="/connections"
            search={{ onboarding: 'true' }}
            className="shrink-0 rounded-md bg-warning-fg px-3 py-1.5 text-xs font-semibold text-background hover:opacity-90 transition-opacity"
          >
            Connect PAT →
          </Link>
        </div>
      )}

      <PageHeader
        title={`${greeting}, ${firstName}.`}
        description={`${activeThreads.length} change thread${activeThreads.length !== 1 ? 's' : ''} in flight.`}
      />

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="sm:col-span-2 rounded-lg border border-hairline bg-surface p-5">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Active threads</p>
          <p className="text-3xl font-mono font-bold text-foreground">{activeThreads.length}</p>
          <p className="text-xs text-muted-foreground mt-1">{mockThreads.length} total · {mockThreads.filter(t => t.status === 'ready').length} ready to publish</p>
        </div>
        <div className="rounded-lg border border-hairline bg-surface p-5">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Published briefs</p>
          <p className="text-3xl font-mono font-bold text-foreground">{publishedBriefs.length}</p>
          <p className="text-xs text-muted-foreground mt-1">Posted to GitHub as PR comments</p>
        </div>
        <div className="rounded-lg border border-hairline bg-surface p-5">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">GitHub Repositories</p>
          <p className="text-3xl font-mono font-bold text-foreground">{repoCount}</p>
          <p className="text-xs text-muted-foreground mt-1">{ghConnected ? 'Connected via PAT' : 'Not connected'}</p>
        </div>
      </div>


      {/* Recent threads (Timeline view) */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-mono uppercase tracking-wider font-semibold text-foreground">Recent change threads</h2>
            <span className="px-1.5 py-0.5 rounded bg-surface-2 border border-hairline text-[10px] font-mono text-muted-foreground">{mockThreads.length}</span>
          </div>
          <Link to="/threads" className="text-xs font-mono text-primary hover:underline">View all →</Link>
        </div>

        <div className="rounded-lg border border-hairline bg-surface p-4">
          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-hairline">
            {mockThreads.map((thread) => (
              <div key={thread.id} className="relative group">
                {/* Timeline node */}
                <div className="absolute -left-6 top-1 w-2 h-2 rounded-full border border-hairline bg-surface group-hover:border-primary group-hover:bg-primary transition-colors" />

                <Link
                  to="/threads/$id"
                  params={{ id: thread.id }}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded border border-transparent hover:border-hairline hover:bg-surface-2/60 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-muted-foreground">{thread.repo}</span>
                      <span className="text-muted-foreground/40">•</span>
                      <p className="text-sm font-medium text-foreground truncate">{thread.title}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <BranchPair head={thread.headBranch} base={thread.baseBranch} />
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex gap-1">{thread.riskFlags.map(f => <RiskChip key={f} flag={f} />)}</div>
                    <StatusDot status={thread.status} label />
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
