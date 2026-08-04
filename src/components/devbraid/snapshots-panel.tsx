import { useState } from 'react'
import { Camera, Loader2 } from 'lucide-react'
import type { Snapshot } from '../../types/thread'
import { cn } from '@/lib/utils'

const TYPE_LABELS: Record<string, string> = {
  CREATION: 'Initial state',
  REFRESH: 'After refresh',
  ANALYSIS: 'After analysis',
  MANUAL: 'Manual',
}

function formatTime(iso?: string) {
  if (!iso) return ''
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function SnapshotsPanel({
  snapshots,
  onCapture,
  busy,
}: {
  snapshots: Snapshot[]
  onCapture?: (note: string) => void
  busy?: boolean
}) {
  const [note, setNote] = useState('')
  const sorted = [...snapshots].sort((a, b) => (b.createdAt ?? '').localeCompare(a.createdAt ?? ''))

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!onCapture) return
    onCapture(note.trim())
    setNote('')
  }

  return (
    <div className="rounded-xl bg-surface">
      <div className="flex items-center justify-between px-4 py-3">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Snapshots ({snapshots.length})
        </p>
        <Camera className="size-3.5 text-muted-foreground" />
      </div>

      {sorted.length === 0 ? (
        <p className="px-4 py-6 text-xs text-muted-foreground">
          No snapshots yet. Capture one to freeze the thread's current state.
        </p>
      ) : (
        <ul className="max-h-56 divide-y divide-hairline/60 overflow-y-auto">
          {sorted.map((s) => (
            <li key={s.id} className="flex items-start gap-3 px-4 py-2.5">
              <span
                className={cn(
                  'mt-0.5 grid size-6 shrink-0 place-items-center rounded-full border',
                  s.type === 'MANUAL'
                    ? 'border-primary/40 bg-primary/10 text-primary'
                    : 'border-hairline bg-surface-2 text-muted-foreground',
                )}
              >
                <Camera className="size-3" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="truncate text-xs font-medium text-foreground">
                    {TYPE_LABELS[s.type ?? ''] ?? s.type}
                  </p>
                  <span className="shrink-0 font-mono text-[10px] text-muted-foreground">
                    {formatTime(s.createdAt)}
                  </span>
                </div>
                {s.note && (
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{s.note}</p>
                )}
                <p className="mt-0.5 font-mono text-[10px] text-muted-foreground/70">
                  {s.commitSha?.substring(0, 7)}
                  {s.changedFiles ? ` · ${s.changedFiles.length} files` : ''}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {onCapture && (
        <form onSubmit={submit} className="flex items-center gap-2 px-4 py-2.5">
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Capture note (optional)…"
            className="input input-xs w-full border border-hairline bg-surface-2/40 px-2 py-1 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/40"
          />
          <button
            type="submit"
            disabled={busy}
            className={cn(
              'btn btn-xs border border-hairline bg-surface-2/60 text-foreground transition-colors hover:border-primary/40 hover:text-primary disabled:opacity-40',
            )}
          >
            {busy ? <Loader2 className="size-3 animate-spin" /> : 'Capture'}
          </button>
        </form>
      )}
    </div>
  )
}
