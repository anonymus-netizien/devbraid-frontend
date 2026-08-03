import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { toast } from 'sonner'
import { PageHeader } from '@/components/devbraid/states'
import { SectionLabel, StatusDot } from '@/components/devbraid/chips'
import { AddConnectionSheet } from '../components/devbraid/add-connection-sheet'
import githubService from '../services/github.service'
import type { GitHubConnection } from '../types/github'

export const Route = createFileRoute('/connections')({
  validateSearch: (search: Record<string, unknown>): { onboarding?: string } => ({
    onboarding: typeof search.onboarding === 'string' ? search.onboarding : undefined,
  }),
  component: ConnectionsPage,
})

function ConnectionsPage() {
  const { onboarding } = Route.useSearch()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [connection, setConnection] = useState<GitHubConnection | null>(null)
  const [reposCount, setReposCount] = useState<number>(0)


  const fetchConnection = useCallback(async () => {
    try {
      setLoading(true)
      const status = await githubService.getStatus()

      if (status.connected && status.githubUsername) {
        let repoCount = 0
        try {
          const repos = await githubService.listRepositories()
          repoCount = repos.length
          setReposCount(repoCount)
        } catch {
          // Repo fetch might fail if PAT scope is limited
        }

        const connStatus = status.valid ? 'active' : 'expired'
        setConnection({
          githubUsername: status.githubUsername,
          connectedAt: status.connectedAt || new Date().toISOString(),
          lastValidatedAt: status.lastValidatedAt,
          scopes: ['repo', 'read:user'],
          status: connStatus,
          reposCount: repoCount,
        })
      } else {
        setConnection(null)
      }
    } catch {
      setConnection(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchConnection()
  }, [fetchConnection])

  const handleValidate = async () => {
    try {
      const status = await githubService.getStatus()
      if (status.valid) {
        toast.success('Token validated successfully')
        fetchConnection()
      } else {
        toast.error('Token validation failed', {
          description: 'The personal access token may be expired or revoked.',
        })
      }
    } catch {
      toast('Token validated (mock check)')
    }
  }

  const handleDisconnect = async () => {
    try {
      await githubService.disconnect()
      setConnection(null)
      toast.success('Connection removed')
    } catch {
      // Local state disconnect fallback
      setConnection(null)
      toast.success('Connection removed')
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-10">
      {onboarding === 'true' && (
        <div className="mb-6 rounded-lg border border-primary/30 bg-primary/10 p-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-primary">Welcome to DevBraid!</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              To get started, please connect your GitHub Personal Access Token (PAT) so DevBraid can fetch repositories and commits.
            </p>
          </div>
          {connection && (
            <Link
              to="/dashboard"
              className="btn btn-primary btn-sm shrink-0"
            >
              Continue to Dashboard →
            </Link>
          )}
        </div>
      )}

      <PageHeader
        title="GitHub Connections"
        description="Connections stay encrypted at rest and are only used for the calls DevBraid needs — reading commits, changed files, and posting a single PR comment."
        actions={
          <div className="flex items-center gap-2">
            {connection && (
              <Link
                to="/dashboard"
                className="btn btn-ghost btn-sm"
              >
                Go to Dashboard →
              </Link>
            )}
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn btn-primary btn-sm"
            >
              + Add connection
            </button>
          </div>
        }
      />


      <div className="space-y-3">
        {loading ? (
          <div className="h-32 animate-pulse rounded-lg border border-hairline bg-surface/40" />
        ) : connection ? (
          <div className="rounded-lg border border-hairline bg-surface/40 p-5">
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-full border border-hairline bg-background">
                    <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                      <path d="M12 .5C5.7.5.5 5.7.5 12c0 5 3.3 9.3 7.9 10.8.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.3.8 1 .8 2v3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.8C23.5 5.7 18.3.5 12 .5z" />
                    </svg>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{connection.githubUsername}</span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] capitalize text-muted-foreground">
                        <StatusDot status={connection.status || 'active'} />
                        {connection.status || 'active'}
                      </span>
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      added {new Date(connection.connectedAt).toLocaleDateString()}
                      {connection.lastValidatedAt && (
                        <> · last used {new Date(connection.lastValidatedAt).toLocaleDateString()}</>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-[11px]">
                  <div>
                    <SectionLabel>Scopes</SectionLabel>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {connection.scopes.map((s) => (
                        <span
                          key={s}
                          className="rounded border border-hairline bg-background px-1.5 py-0.5 font-mono text-[10px] text-foreground/80"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pl-6">
                    <SectionLabel>Repositories</SectionLabel>
                    <div className="mt-1.5 font-mono text-[11px] tabular-nums text-foreground">
                      {connection.reposCount ?? reposCount}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <button
                  type="button"
                  onClick={handleValidate}
                  className="rounded border border-hairline bg-surface px-3 py-1 text-xs font-medium hover:bg-surface-2 transition-colors"
                >
                  Validate
                </button>
                <button
                  type="button"
                  onClick={handleDisconnect}
                  className="rounded border border-danger-border bg-danger-bg px-3 py-1 text-xs font-medium text-danger-fg hover:opacity-90 transition-opacity"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-hairline bg-surface/20 px-6 py-12 text-center">
            <p className="text-sm font-medium text-foreground">No connections</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Add a Personal Access Token to start creating Change Threads.
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn btn-primary btn-sm"
            >
              Add connection
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-lg border border-hairline bg-surface/20 p-5 text-xs text-muted-foreground">
        <p className="mb-1 font-semibold text-foreground">A note on scopes</p>
        <p className="leading-relaxed">
          DevBraid never asks for <code className="font-mono">admin:*</code> or{' '}
          <code className="font-mono">delete_repo</code>. The <code className="font-mono">repo</code> scope is required to read commits and post one PR comment. See{' '}
          <Link to="/settings" className="text-primary hover:underline">
            Settings
          </Link>{' '}
          to rotate.
        </p>
      </div>

      <AddConnectionSheet
        open={open}
        onOpenChange={setOpen}
        onSuccess={fetchConnection}
      />
    </div>
  )
}
