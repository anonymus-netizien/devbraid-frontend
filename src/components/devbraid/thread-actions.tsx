import { useState } from 'react'
import { RefreshCw, Sparkles, Send, Trash2 } from 'lucide-react'
import { EditThreadDialog } from '@/components/devbraid/edit-thread-dialog'
import type { ChangeThread } from '@/types/thread'

export interface BusyState {
  refreshing: boolean
  deleting: boolean
  analyzing: boolean
  generating: boolean
  publishing: boolean
}

interface ThreadActionsProps {
  thread: ChangeThread
  busy: BusyState
  onRefresh: () => void
  onDelete: () => void
  onAnalyze: () => void
  onGenerateBrief: () => void
  onPublish: (prNumber: number) => void
  onSaved: (updated: ChangeThread) => void
}

export function ThreadActions({
  thread,
  busy,
  onRefresh,
  onDelete,
  onAnalyze,
  onGenerateBrief,
  onPublish,
  onSaved,
}: ThreadActionsProps) {
  const [prNumberInput, setPrNumberInput] = useState(1)

  return (
    <div className="flex items-center gap-2">
      <EditThreadDialog thread={thread} onSaved={onSaved} />
      <button
        type="button"
        onClick={onDelete}
        disabled={busy.deleting}
        className="btn btn-ghost btn-sm text-danger-fg hover:bg-danger-bg/40"
      >
        <Trash2 className={`h-3.5 w-3.5 ${busy.deleting ? 'animate-pulse' : ''}`} />
        <span>Delete</span>
      </button>
      <button
        type="button"
        onClick={onRefresh}
        disabled={busy.refreshing}
        className="btn btn-ghost btn-sm"
      >
        <RefreshCw className={`h-3.5 w-3.5 ${busy.refreshing ? 'animate-spin' : ''}`} />
        <span>Refresh Diff</span>
      </button>
      <button
        type="button"
        onClick={onAnalyze}
        disabled={busy.analyzing}
        className="btn btn-ghost btn-sm"
      >
        <Sparkles
          className={`h-3.5 w-3.5 text-warning-fg ${busy.analyzing ? 'animate-spin' : ''}`}
        />
        <span>AI Risk Analysis</span>
      </button>
      <button
        type="button"
        onClick={onGenerateBrief}
        disabled={busy.generating}
        className="btn btn-soft btn-sm"
      >
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        <span>{busy.generating ? 'Generating...' : 'Generate Brief'}</span>
      </button>
      <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-lg p-1">
        <div className="flex items-center gap-1">
          <label htmlFor="pr-number" className="text-[10px] text-muted-foreground font-mono pl-1">
            PR #
          </label>
          <input
            id="pr-number"
            type="number"
            min={1}
            value={prNumberInput}
            onChange={(e) => {
              // valueAsNumber is NaN for empty/partial input — only commit finite values
              const n = e.currentTarget.valueAsNumber
              if (Number.isFinite(n)) setPrNumberInput(n)
            }}
            className="w-14 px-1.5 py-1 text-xs text-center bg-surface border border-hairline rounded text-foreground font-mono"
            title="Enter the GitHub Pull Request number to post this brief as a comment"
          />
        </div>
        <button
          type="button"
          onClick={() => onPublish(prNumberInput)}
          disabled={busy.publishing}
          className="btn btn-primary btn-sm"
        >
          <Send className="h-3.5 w-3.5" />
          <span>{busy.publishing ? 'Publishing...' : 'Publish PR Comment'}</span>
        </button>
      </div>
    </div>
  )
}
