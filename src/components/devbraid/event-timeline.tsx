import { useState } from 'react'
import {
  Activity,
  ArrowRightLeft,
  Camera,
  FileText,
  GitBranch,
  Loader2,
  MessageSquare,
  PenLine,
  Pencil,
  RefreshCw,
  Send,
  Sparkles,
  StickyNote,
  Trash2,
} from 'lucide-react'
import type { ThreadEvent } from '../../types/thread'
import { cn } from '@/lib/utils'

const TYPE_ICONS: Record<string, typeof GitBranch> = {
  THREAD_CREATED: GitBranch,
  THREAD_REFRESHED: RefreshCw,
  STATUS_CHANGED: ArrowRightLeft,
  NOTE_ADDED: StickyNote,
  NOTE_UPDATED: Pencil,
  NOTE_DELETED: Trash2,
  FILE_COMMENT_ADDED: MessageSquare,
  FILE_COMMENT_UPDATED: MessageSquare,
  FILE_COMMENT_DELETED: MessageSquare,
  ANALYSIS_RUN: Sparkles,
  BRIEF_GENERATED: FileText,
  BRIEF_PUBLISHED: Send,
  SNAPSHOT_CREATED: Camera,
  MANUAL: PenLine,
}

const TYPE_LABELS: Record<string, string> = {
  THREAD_CREATED: 'Thread created',
  THREAD_REFRESHED: 'Refreshed from GitHub',
  STATUS_CHANGED: 'Status changed',
  NOTE_ADDED: 'Decision note added',
  NOTE_UPDATED: 'Decision note updated',
  NOTE_DELETED: 'Decision note deleted',
  FILE_COMMENT_ADDED: 'Comment added',
  FILE_COMMENT_UPDATED: 'Comment updated',
  FILE_COMMENT_DELETED: 'Comment deleted',
  ANALYSIS_RUN: 'Risk analysis',
  BRIEF_GENERATED: 'Brief generated',
  BRIEF_PUBLISHED: 'Brief published',
  SNAPSHOT_CREATED: 'Snapshot captured',
  MANUAL: 'Manual entry',
}

function formatTime(iso?: string) {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function EventsTimeline({
  events,
  onAddEvent,
  busy,
}: {
  events: ThreadEvent[]
  onAddEvent?: (summary: string) => void
  busy?: boolean
}) {
  const [summary, setSummary] = useState('')
  const sorted = [...events].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = summary.trim()
    if (!text || !onAddEvent) return
    onAddEvent(text)
    setSummary('')
  }

  return (
    <div className="rounded-xl border border-hairline bg-surface">
      <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Activity
        </p>
        <Activity className="size-3.5 text-muted-foreground" />
      </div>

      {events.length === 0 ? (
        <p className="px-4 py-6 text-xs text-muted-foreground">No activity recorded yet.</p>
      ) : (
        <ol className="max-h-72 divide-y divide-hairline/60 overflow-y-auto">
          {sorted.map((ev) => {
            const Icon = TYPE_ICONS[ev.type ?? ''] ?? Activity
            return (
              <li key={ev.id} className="flex items-start gap-3 px-4 py-2.5">
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border border-hairline bg-surface-2 text-muted-foreground">
                  <Icon className="size-3" />
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="truncate text-xs font-medium text-foreground">
                      {TYPE_LABELS[ev.type ?? ''] ?? ev.type}
                    </p>
                    <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                      {formatTime(ev.createdAt)}
                    </span>
                  </div>
                  {ev.summary && (
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {ev.summary}
                    </p>
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      )}

      {onAddEvent && (
        <form
          onSubmit={submit}
          className="flex items-center gap-2 border-t border-hairline px-4 py-2.5"
        >
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            placeholder="Log an event…"
            className="input input-xs w-full border border-hairline bg-surface-2/40 px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/40"
          />
          <button
            type="submit"
            disabled={!summary.trim() || busy}
            className={cn(
              'btn btn-xs border border-hairline bg-surface-2/60 text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-40',
            )}
          >
            {busy ? <Loader2 className="size-3 animate-spin" /> : 'Log'}
          </button>
        </form>
      )}
    </div>
  )
}
