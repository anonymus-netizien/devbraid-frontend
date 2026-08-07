import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { FolderGit2, KeyRound } from 'lucide-react'
import { PageHeader } from '@/components/devbraid/states'
import { SectionLabel, StatusDot } from '@/components/devbraid/chips'
import { AddConnectionSheet } from '../components/devbraid/add-connection-sheet'
import { queryKeys, useGitHubStatusQuery, useReposQuery } from '@/hooks/queries'
import githubService from '../services/github.service'
import type { GitHubConnection } from '../types/github'
import { formatDate } from '@/lib/time'

export const Route = createFileRoute('/connections')({
  validateSearch: (search: Record<string, unknown>): { onboarding?: string } => ({
    onboarding: typeof search.onboarding === 'string' ? search.onboarding : undefined,
  }),
  component: ConnectionsPage,
})

function ConnectionsPage() {
  const { onboarding } = Route.useSearch()
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()
  const { data: status, isLoading } = useGitHubStatusQuery()
  const isConnected = !!(status?.connected && status?.githubUsername)
  const { data: repos, isLoading: reposLoading } = useReposQuery(isConnected)
  const reposCount = repos?.length ?? 0

  const connection: GitHubConnection | null = isConnected
    ? {
        githubUsername: status!.githubUsername ?? '',
        connectedAt: status!.connectedAt ?? '',
        lastValidatedAt: status!.lastValidatedAt ?? null,
        scopes: ['repo', 'read:user'],
        status: status!.valid ? 'active' : 'expired',
        reposCount,
      }
    : null

  const refetchConnection = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.github.status })
    queryClient.invalidateQueries({ queryKey: queryKeys.github.repos })
  }

  const handleValidate = async () => {
    try {
      const status = await githubService.getStatus()
      if (status.valid) {
        toast.success('Token validated successfully')
        refetchConnection()
      } else {
        toast.error('Token validation failed', {
          description: 'The personal access token may be expired or revoked.',
        })
      }
    } catch {
      toast.error('Token validation failed', {
        description: 'Could not reach GitHub. Please try again.',
      })
    }
  }

  const handleDisconnect = async () => {
    try {
      await githubService.disconnect()
    } catch {
      // ponytail: disconnect is idempotent — always refresh and confirm
    }
    refetchConnection()
    toast.success('Connection removed')
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-8 sm:py-10">
      {onboarding === 'true' && (
        <div className="mb-6 rounded-lg border border-primary/30 bg-primary/10 p-4 flex items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-primary">Welcome to DevBraid!</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              To get started, please connect your GitHub Personal Access Token (PAT) so DevBraid can
              fetch repositories and commits.
            </p>
          </div>
          {connection && (
            <Link to="/dashboard" className="btn btn-primary btn-md shrink-0">
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
            {connection && !onboarding && (
              <Link to="/dashboard" className="btn btn-ghost btn-md">
                Go to Dashboard →
              </Link>
            )}
            {connection && (
              <button
                type="button"
                onClick={() => setOpen(true)}
                className="btn btn-primary btn-md"
              >
                + Add connection
              </button>
            )}
          </div>
        }
      />

      <div className="space-y-3">
        {isLoading ? (
          <div className="h-32 animate-pulse rounded-lg bg-surface/40" />
        ) : connection ? (
          <>
            <div className="rounded-lg bg-surface/40 p-5">
              <div className="flex items-start justify-between gap-6">
                <div className="min-w-0 space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="grid size-8 place-items-center rounded-full bg-background">
                      <svg viewBox="0 0 24 24" className="size-4" fill="currentColor">
                        <path d="M12 .5C5.7.5.5 5.7.5 12c0 5 3.3 9.3 7.9 10.8.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.4-3.9-1.4-.5-1.4-1.3-1.7-1.3-1.7-1.1-.7.1-.7.1-.7 1.2.1 1.8 1.2 1.8 1.2 1 1.8 2.7 1.3 3.4 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.3-5.3-5.7 0-1.3.4-2.3 1.2-3.1-.1-.3-.5-1.5.1-3.1 0 0 1-.3 3.2 1.2a11 11 0 0 1 5.8 0c2.2-1.5 3.2-1.2 3.2-1.2.6 1.6.2 2.8.1 3.1.8.8 1.2 1.8 1.2 3.1 0 4.4-2.7 5.4-5.3 5.7.4.3.8 1 .8 2v3c0 .3.2.7.8.6 4.6-1.5 7.9-5.8 7.9-10.8C23.5 5.7 18.3.5 12 .5z" />
                      </svg>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-foreground">
                          {connection.githubUsername}
                        </span>
                        <span className="inline-flex items-center gap-1.5 text-[11px] capitalize text-muted-foreground">
                          <StatusDot status={connection.status || 'active'} />
                          {connection.status || 'active'}
                        </span>
                      </div>
                      <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                        {connection.connectedAt
                          ? `added ${formatDate(connection.connectedAt)}`
                          : 'added —'}
                        {connection.lastValidatedAt && (
                          <> · last used {formatDate(connection.lastValidatedAt)}</>
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

            <div className="rounded-lg bg-surface/40 p-5">
              <SectionLabel>Repositories</SectionLabel>
              <p className="mt-0.5 text-[11px] text-muted-foreground">
                DevBraid can read commits and changed files from these repositories.
              </p>
              {reposLoading ? (
                <div className="mt-3 h-24 animate-pulse rounded bg-surface/40" />
              ) : repos && repos.length > 0 ? (
                <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                  {repos.map((r) => (
                    <li
                      key={r.fullName}
                      className="flex items-center gap-2 rounded-md border border-hairline bg-background/60 px-3 py-2"
                    >
                      <FolderGit2 className="size-3.5 shrink-0 text-primary" />
                      <span className="truncate font-mono text-xs text-foreground">
                        {r.fullName}
                      </span>
                      {r.isPrivate && (
                        <span className="ml-auto rounded border border-hairline bg-surface px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-muted-foreground">
                          Private
                        </span>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-xs text-muted-foreground">
                  No repositories found for this token.
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center rounded-lg border border-dashed border-hairline bg-surface/20 px-6 py-16 text-center">
            <div className="grid size-12 place-items-center rounded-full border border-hairline bg-surface text-primary">
              <KeyRound className="size-5" />
            </div>
            <p className="mt-4 text-base font-semibold text-foreground">
              Connect a Personal Access Token to unlock DevBraid
            </p>
            <p className="mt-1.5 max-w-md text-sm text-muted-foreground">
              DevBraid needs a GitHub PAT with <code className="font-mono">repo</code> access to
              inspect repositories, read commits and changed files, and publish briefs to your pull
              requests.
            </p>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className="btn btn-primary btn-md mt-6"
            >
              Connect PAT
            </button>
          </div>
        )}
      </div>

      <div className="mt-8 rounded-lg border border-hairline bg-surface/20 p-5 text-xs text-muted-foreground">
        <p className="mb-1 font-semibold text-foreground">A note on scopes</p>
        <p className="leading-relaxed">
          DevBraid never asks for <code className="font-mono">admin:*</code> or{' '}
          <code className="font-mono">delete_repo</code>. The{' '}
          <code className="font-mono">repo</code> scope is required to read commits and post one PR
          comment. See{' '}
          <Link to="/settings" className="text-primary hover:underline">
            Settings
          </Link>{' '}
          to rotate.
        </p>
      </div>

      <AddConnectionSheet open={open} onOpenChange={setOpen} onSuccess={refetchConnection} />
    </div>
  )
}
