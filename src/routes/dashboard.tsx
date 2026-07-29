import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { PageHeader } from '../components/devbraid/page-header'
import { StatusDot } from '../components/devbraid/status-dot'
import { RiskChip } from '../components/devbraid/risk-chip'
import { BranchPair } from '../components/devbraid/branch-pair'
import { useAuth } from '../context/AuthContext'
import githubService from '../services/github.service'
import { threadService } from '../services/thread.service'
import type { ChangeThread } from '../types/thread'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function DashboardPage() {
  const { user } = useAuth()
  const [ghConnected, setGhConnected] = useState<boolean | null>(null)
  const [repoCount, setRepoCount] = useState<number>(0)
  const [threads, setThreads] = useState<ChangeThread[]>([])
  const [briefsCount, setBriefsCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const status = await githubService.getStatus()
        const connected = status.connected && status.valid
        setGhConnected(connected)
        if (connected) {
          const [repos, threadsData, briefsData] = await Promise.all([
            githubService.listRepositories(),
            threadService.listThreads(0, 20),
            threadService.listBriefs(0, 1)
          ])
          setRepoCount(repos.length)
          setThreads(threadsData.content || [])
          setBriefsCount(briefsData.totalElements || 0)
        }
      } catch {
        setGhConnected(false)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const hour = new Date().getHours()
  const greeting = hour >= 5 && hour < 12 ? 'Good morning' : hour >= 12 && hour < 17 ? 'Good afternoon' : hour >= 17 && hour < 22 ? 'Good evening' : 'Working late'
  const firstName = user?.fullName ? user.fullName.split(' ')[0] : user?.email ? user.email.split('@')[0] : 'Developer'
  const activeThreads = threads.filter(t => t.status !== 'PUBLISHED')
  const readyToPublish = threads.filter(t => t.status === 'READY').length

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
          <p className="text-3xl font-mono font-bold text-foreground">{loading ? '...' : activeThreads.length}</p>
          <p className="text-xs text-muted-foreground mt-1">{threads.length} total · {readyToPublish} ready to publish</p>
        </div>
        <div className="rounded-lg border border-hairline bg-surface p-5">
          <p className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-1">Published briefs</p>
          <p className="text-3xl font-mono font-bold text-foreground">{briefsCount}</p>
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
            <span className="px-1.5 py-0.5 rounded bg-surface-2 border border-hairline text-[10px] font-mono text-muted-foreground">{threads.length}</span>
          </div>
          <Link to="/threads" className="text-xs font-mono text-primary hover:underline">View all →</Link>
        </div>

        <div className="rounded-lg border border-hairline bg-surface p-4">
          {loading ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Loading threads...</p>
          ) : threads.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">No threads yet. Create one to get started.</p>
          ) : (
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-[1px] before:bg-hairline">
              {threads.slice(0, 5).map((thread) => (
                <div key={thread.id} className="relative group">
                  <div className="absolute -left-6 top-1 w-2 h-2 rounded-full border border-hairline bg-surface group-hover:border-primary group-hover:bg-primary transition-colors" />
                  <Link
                    to="/threads/$id"
                    params={{ id: thread.id }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded border border-transparent hover:border-hairline hover:bg-surface-2/60 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono text-muted-foreground">{thread.repositoryFullName}</span>
                        <span className="text-muted-foreground/40">•</span>
                        <p className="text-sm font-medium text-foreground truncate">{thread.title}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <BranchPair head={thread.headBranch} base={thread.baseBranch} />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex gap-1">
                        {thread.riskFlags?.map(f => <RiskChip key={f} flag={f} />)}
                        {thread.riskLevel && !thread.riskFlags?.length && (
                          <span className="text-[10px] font-mono text-muted-foreground capitalize">{thread.riskLevel.toLowerCase()}</span>
                        )}
                      </div>
                      <StatusDot status={(thread.status || 'drafting').toLowerCase() as any} label />
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
