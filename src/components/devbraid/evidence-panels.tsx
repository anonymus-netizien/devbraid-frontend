import { useState } from 'react'
import {
  CheckCircle2,
  GitCommit,
  Loader2,
  MessageSquare,
  MessageSquarePlus,
  Trash2,
} from 'lucide-react'
import type { ChangedFile, CommitSummary, FileComment } from '../../types/thread'
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

export function FileChangesPanel({
  files,
  comments = [],
  onAddComment,
  onResolveComment,
  onDeleteComment,
  busyCommentId,
  defaultExpanded,
}: {
  files: ChangedFile[]
  /** File comments for this thread — shown as per-file threads when present. */
  comments?: FileComment[]
  onAddComment?: (filePath: string, content: string) => void
  onResolveComment?: (commentId: string) => void
  onDeleteComment?: (commentId: string) => void
  busyCommentId?: string | null
  /** Seed which file row starts expanded (tests / SSR rendering). */
  defaultExpanded?: string | null
}) {
  const totalAdditions = files.reduce((acc, f) => acc + (f.additions || 0), 0)
  const totalDeletions = files.reduce((acc, f) => acc + (f.deletions || 0), 0)
  const maxMagnitude = Math.max(1, ...files.map((f) => (f.additions || 0) + (f.deletions || 0)))
  const [expandedFile, setExpandedFile] = useState<string | null>(defaultExpanded ?? null)
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const commentsFor = (path: string) =>
    comments
      .filter((c) => (c.filePath ?? '') === path)
      .sort((a, b) => a.createdAt!.localeCompare(b.createdAt!))

  const toggleFile = (path: string) => setExpandedFile((cur) => (cur === path ? null : path))

  const submitComment = (path: string, e: React.FormEvent) => {
    e.preventDefault()
    const content = (drafts[path] ?? '').trim()
    if (!content || !onAddComment) return
    onAddComment(path, content)
    setDrafts((d) => ({ ...d, [path]: '' }))
  }

  return (
    <div className="rounded-xl border border-hairline bg-surface">
      {/* Panel header — counts rendered as a mini diff summary */}
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Changed Files ({files.length})
        </p>
        {files.length > 0 && (
          <div className="flex items-center gap-2 font-mono text-[10px] tabular-nums">
            {comments.length > 0 && (
              <span className="flex items-center gap-1 text-info-fg">
                <MessageSquare className="size-3" /> {comments.length}
              </span>
            )}
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
            const fileComments = commentsFor(path)
            const expanded = expandedFile === path
            const hasCommentsApi = Boolean(onAddComment || fileComments.length > 0)

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
                  <div className="flex shrink-0 items-center gap-1.5">
                    {fileComments.length > 0 && (
                      <span className="flex items-center gap-1 rounded-full border border-hairline bg-surface-2 px-2 py-0.5 font-mono text-[10px] tabular-nums text-info-fg">
                        <MessageSquare className="size-2.5" />
                        {fileComments.length}
                      </span>
                    )}
                    <div className="shrink-0 font-mono text-[10px] tabular-nums leading-none">
                      <span className="text-success-fg">+{additions}</span>{' '}
                      <span className="text-danger-fg">−{deletions}</span>
                    </div>
                    {hasCommentsApi && (
                      <button
                        type="button"
                        onClick={() => toggleFile(path)}
                        className="grid size-5 place-items-center rounded border border-hairline bg-surface-2/60 text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                        title={expanded ? 'Collapse comments' : 'Comments'}
                      >
                        <MessageSquarePlus className="size-3" />
                      </button>
                    )}
                  </div>
                </div>

                {expanded && (
                  <div className="mt-2.5 space-y-2 rounded-lg border border-hairline bg-surface-2/40 p-3">
                    {fileComments.length === 0 && (
                      <p className="text-[11px] text-muted-foreground">
                        No comments on this file yet.
                      </p>
                    )}
                    {fileComments.map((c) => (
                      <div
                        key={c.id}
                        className="rounded-md border border-hairline bg-surface p-2.5"
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-muted-foreground">
                            {c.lineStart
                              ? `L${c.lineStart}${c.lineEnd ? '–' + c.lineEnd : ''}`
                              : 'file'}
                          </span>
                          {c.status !== 'ACTIVE' && (
                            <span
                              className={cn(
                                'rounded-full px-1.5 py-px font-mono text-[9px] uppercase tracking-wide',
                                c.status === 'RESOLVED'
                                  ? 'bg-success-bg text-success-fg border border-success-border'
                                  : 'bg-surface-2 text-muted-foreground border border-hairline',
                              )}
                            >
                              {c.status?.toLowerCase()}
                            </span>
                          )}
                          <span className="ml-auto" />
                          {c.status !== 'RESOLVED' && onResolveComment && (
                            <button
                              type="button"
                              onClick={() => c.id && onResolveComment(c.id)}
                              className="text-muted-foreground transition-colors hover:text-success-fg"
                              title="Resolve comment"
                            >
                              <CheckCircle2 className="size-3.5" />
                            </button>
                          )}
                          {onDeleteComment && (
                            <button
                              type="button"
                              onClick={() => c.id && onDeleteComment(c.id)}
                              className="text-muted-foreground transition-colors hover:text-danger-fg"
                              title="Delete comment"
                            >
                              {busyCommentId === c.id ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="size-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                        <p className="mt-1 text-xs text-foreground/90">{c.content}</p>
                      </div>
                    ))}
                    {onAddComment && (
                      <form
                        onSubmit={(e) => submitComment(path, e)}
                        className="flex items-center gap-2"
                      >
                        <input
                          type="text"
                          value={drafts[path] ?? ''}
                          onChange={(e) => setDrafts((d) => ({ ...d, [path]: e.target.value }))}
                          placeholder="Comment on this file…"
                          className="input input-xs w-full border border-hairline bg-surface px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/40"
                        />
                        <button
                          type="submit"
                          disabled={!(drafts[path] ?? '').trim()}
                          className="btn btn-xs border border-hairline bg-surface-2/60 text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-40"
                        >
                          Add
                        </button>
                      </form>
                    )}
                  </div>
                )}
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
