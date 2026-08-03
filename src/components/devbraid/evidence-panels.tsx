import { GitCommit } from 'lucide-react'
import type { ChangedFile, CommitSummary } from '../../types/thread'
import { cn } from '@/lib/utils'

const STATUS_META: Record<string, { label: string; className: string }> = {
  added: { label: 'A', className: 'bg-success-bg text-success-fg border-success-border' },
  modified: { label: 'M', className: 'bg-warning-bg text-warning-fg border-warning-border' },
  deleted: { label: 'D', className: 'bg-danger-bg text-danger-fg border-danger-border' },
  renamed: { label: 'R', className: 'bg-info-bg text-info-fg border-info-border' },
  copied: { label: 'C', className: 'bg-info-bg text-info-fg border-info-border' },
}

function statusMeta(status: string | undefined) {
  return (
    STATUS_META[(status || '').toLowerCase()] ?? {
      label: (status || '—').toUpperCase().slice(0, 1),
      className: 'bg-surface-2 text-muted-foreground border-hairline',
    }
  )
}

/** Splits "src/components/foo/bar.tsx" into dir + filename for breadcrumb styling. */
function pathParts(path: string): { dir: string; name: string } {
  const idx = path.lastIndexOf('/')
  if (idx <= 0) return { dir: '', name: path }
  return { dir: path.slice(0, idx + 1), name: path.slice(idx + 1) }
}

export function FileChangesPanel({ files }: { files: ChangedFile[] }) {
  const totalAdditions = files.reduce((acc, f) => acc + (f.additions || 0), 0)
  const totalDeletions = files.reduce((acc, f) => acc + (f.deletions || 0), 0)
  const maxMagnitude = Math.max(1, ...files.map((f) => (f.additions || 0) + (f.deletions || 0)))

  return (
    <div className="rounded-xl border border-hairline bg-surface">
      {/* Panel header — counts rendered as a mini diff summary */}
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Changed Files ({files.length})
        </p>
        {files.length > 0 && (
          <div className="flex items-center gap-2 font-mono text-[10px] tabular-nums">
            <span className="text-success-fg">+{totalAdditions}</span>
            <span className="text-muted-foreground/50">/</span>
            <span className="text-danger-fg">−{totalDeletions}</span>
          </div>
        )}
      </div>

      {files.length === 0 ? (
        <p className="px-4 py-6 text-xs text-muted-foreground">
          No changed files detected. Run <span className="font-mono">Refresh Diff</span> to sync
          from GitHub.
        </p>
      ) : (
        <ul className="divide-y divide-hairline/60">
          {files.map((f, i) => {
            const path = f.filename || f.path || ''
            const { dir, name } = pathParts(path)
            const additions = f.additions || 0
            const deletions = f.deletions || 0
            const magnitude = additions + deletions
            const addShare = magnitude > 0 ? additions / magnitude : 0
            const meta = statusMeta(f.status)
            const barScale = 0.35 + (magnitude / maxMagnitude) * 0.65

            return (
              <li
                key={path || i}
                className="group px-4 py-2.5 transition-colors hover:bg-surface-2/50"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'grid size-4.5 shrink-0 place-items-center rounded border font-mono text-[9px] font-semibold leading-none',
                      meta.className,
                    )}
                    title={f.status || 'unknown'}
                  >
                    {meta.label}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-mono text-xs">
                      <span className="text-muted-foreground">{dir}</span>
                      <span className="text-foreground">{name}</span>
                    </p>
                    {/* Diff bar — segments proportional to additions/deletions, bar height scaled by magnitude */}
                    <div
                      className="mt-1.5 flex h-1 w-full overflow-hidden rounded-full bg-surface-2"
                      style={{ height: `${Math.round(3 + barScale * 3)}px` }}
                    >
                      {additions > 0 && (
                        <span
                          className="h-full bg-success-fg/80"
                          style={{ width: `${addShare * 100}%` }}
                        />
                      )}
                      {deletions > 0 && (
                        <span
                          className="h-full bg-danger-fg/70"
                          style={{ width: `${(1 - addShare) * 100}%` }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="shrink-0 font-mono text-[10px] tabular-nums leading-none">
                    <span className="text-success-fg">+{additions}</span>{' '}
                    <span className="text-danger-fg">−{deletions}</span>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}

export function CommitsList({ commits }: { commits: CommitSummary[] }) {
  return (
    <div className="rounded-xl border border-hairline bg-surface">
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Commits ({commits.length})
        </p>
        <GitCommit className="size-3.5 text-muted-foreground" />
      </div>
      {commits.length === 0 ? (
        <p className="px-4 py-6 text-xs text-muted-foreground">
          No commits synced yet. Run <span className="font-mono">Refresh Diff</span>.
        </p>
      ) : (
        <ul className="divide-y divide-hairline/60">
          {commits.map((c) => (
            <li key={c.sha} className="px-4 py-2.5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-primary">{c.sha?.substring(0, 7)}</span>
                {c.author?.name && (
                  <span className="text-[10px] text-muted-foreground truncate">
                    {c.author.name}
                  </span>
                )}
              </div>
              <p className="mt-0.5 line-clamp-2 font-sans text-xs text-foreground/90">
                {c.message}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
