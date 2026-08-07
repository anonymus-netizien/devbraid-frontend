import { useState } from 'react'
import { Bot, ExternalLink, Loader2, RefreshCw, RotateCcw } from 'lucide-react'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/time'
import { StatusDot } from '@/components/devbraid/chips'
import type { FindingCategory, PrReviewCommentResponse, PrReviewResponse } from '@/types/thread'

const severityColor: Record<string, string> = {
  CRITICAL: 'border-danger-border bg-danger-bg text-danger-fg',
  HIGH: 'border-danger-border bg-danger-bg text-danger-fg',
  MEDIUM: 'border-warning-border bg-warning-bg text-warning-fg',
  LOW: 'border-info-border bg-info-bg text-info-fg',
  INFO: 'border-hairline bg-surface-2 text-muted-foreground',
}

const categoryOrder: FindingCategory[] = [
  'BUG',
  'SECURITY',
  'PERFORMANCE',
  'CORRECTNESS',
  'TESTING',
  'STYLE',
  'MAINTAINABILITY',
  'DOCUMENTATION',
  'OTHER',
]

/** Guards a number-input value: NaN or below-min values are ignored. */
const parsePositiveInt = (value: string): number | null => {
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 1 ? parsed : null
}

export function ReviewPanel({
  review,
  loading,
  defaultPrNumber,
  defaultHeadSha,
  onRunReview,
}: {
  review: PrReviewResponse | null
  loading: boolean
  defaultPrNumber: number
  defaultHeadSha: string | undefined
  onRunReview: (prNumber: number, headSha: string, installationId: number) => Promise<void>
}) {
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [prNumber, setPrNumber] = useState(defaultPrNumber)
  const [headSha, setHeadSha] = useState(defaultHeadSha ?? '')
  const [installationId, setInstallationId] = useState(1)

  const handleRun = async () => {
    if (!headSha.trim()) return
    setRunning(true)
    setError(null)
    try {
      await onRunReview(prNumber, headSha.trim(), installationId)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to run PR review')
    } finally {
      setRunning(false)
    }
  }

  const comments = review?.comments ?? []
  const ordered = [...comments].toSorted(
    (a, b) =>
      (categoryOrder.indexOf((a.category ?? 'OTHER') as FindingCategory) ?? 0) -
      (categoryOrder.indexOf((b.category ?? 'OTHER') as FindingCategory) ?? 0),
  )

  return (
    <section className="rounded-xl bg-surface p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            PR Review
          </p>
          {review?.published && (
            <a
              href={review.githubReviewUrl ?? '#'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-[10px] font-mono text-primary hover:underline"
              title="Open review on GitHub"
            >
              <ExternalLink className="h-3 w-3" /> github
            </a>
          )}
        </div>
        {review && (
          <div className="flex items-center gap-2">
            {review.status && <StatusDot status={review.status.toLowerCase()} />}
            <span className="text-xs capitalize text-muted-foreground">
              {review.status?.toLowerCase()}
            </span>
            {review.completedAt && (
              <span className="text-[10px] font-mono text-muted-foreground">
                {formatDate(review.completedAt)}
              </span>
            )}
          </div>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-6 text-xs text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" /> Loading review…
        </div>
      ) : !review ? (
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            No automated review yet. Runs automatically on GitHub pull requests — or run one
            manually.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <input
              type="number"
              min={1}
              value={prNumber}
              onChange={(e) => {
                const next = parsePositiveInt(e.target.value)
                if (next !== null) setPrNumber(next)
              }}
              className="w-16 px-2 py-1 text-xs text-center bg-surface-2 border border-hairline rounded text-foreground font-mono"
              aria-label="GitHub pull request number"
              title="GitHub pull request number"
            />
            <input
              type="text"
              value={headSha}
              onChange={(e) => setHeadSha(e.target.value)}
              className="flex-1 px-2 py-1 text-xs bg-surface-2 border border-hairline rounded text-foreground font-mono placeholder:text-muted-foreground min-w-0"
              placeholder="head SHA"
              aria-label="Head commit SHA of the PR"
              title="Head commit SHA of the PR"
            />
            <input
              type="number"
              min={1}
              value={installationId}
              onChange={(e) => {
                const parsed = parsePositiveInt(e.target.value)
                if (parsed !== null) setInstallationId(parsed)
              }}
              className="w-14 px-2 py-1 text-xs text-center bg-surface-2 border border-hairline rounded text-foreground font-mono"
              aria-label="GitHub App installation ID"
              title="GitHub App installation ID"
            />
            <button
              type="button"
              onClick={handleRun}
              disabled={running || !headSha.trim()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {running ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Bot className="h-3.5 w-3.5" />
              )}
              <span>{running ? 'Reviewing…' : 'Run Review'}</span>
            </button>
          </div>
          {error && <p className="mt-2 text-xs text-danger-fg">{error}</p>}
        </div>
      ) : (
        <>
          {review.status === 'RUNNING' && (
            <div className="flex items-center gap-2 py-2 text-xs text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" /> Review in progress…
            </div>
          )}
          {review.status === 'FAILED' && (
            <div className="p-3 rounded-lg border border-danger-border bg-danger-bg text-xs text-danger-fg break-words [overflow-wrap:anywhere]">
              Review failed: {review.error || 'unknown error'}
            </div>
          )}
          {review.summary && (
            <p className="text-sm text-muted-foreground leading-relaxed">{review.summary}</p>
          )}
          {review.severityCounts && (
            <div className="flex flex-wrap gap-1.5">
              {Object.entries(review.severityCounts).map(([severity, count]) =>
                (count ?? 0) > 0 ? (
                  <span
                    key={severity}
                    className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono border',
                      severityColor[severity] ??
                        'border-hairline bg-surface-2 text-muted-foreground',
                    )}
                  >
                    {severity} · {count}
                  </span>
                ) : null,
              )}
            </div>
          )}
          {ordered.length > 0 ? (
            <ul className="space-y-2 pt-1">
              {ordered.map((comment: PrReviewCommentResponse) => (
                <li
                  key={comment.id ?? `${comment.filePath ?? 'file'}:${comment.lineNumber ?? 0}`}
                  className="rounded-lg border border-hairline bg-surface-2 p-3 space-y-1.5"
                >
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        'px-1.5 py-0.5 rounded text-[9px] font-mono uppercase border',
                        severityColor[comment.severity ?? 'INFO'] ??
                          'border-hairline bg-surface-2 text-muted-foreground',
                      )}
                    >
                      {comment.severity ?? 'INFO'}
                    </span>
                    <span className="text-[9px] font-mono uppercase text-muted-foreground">
                      {comment.category ?? 'OTHER'}
                    </span>
                    {comment.filePath && (
                      <span
                        className="text-[10px] font-mono text-primary truncate max-w-[28ch]"
                        title={comment.filePath}
                      >
                        {comment.filePath}
                        {comment.lineNumber != null && `:${comment.lineNumber}`}
                      </span>
                    )}
                    <span className="text-xs font-medium text-foreground flex-1 min-w-0 truncate">
                      {comment.title}
                    </span>
                  </div>
                  {comment.body && (
                    <p className="text-xs text-muted-foreground leading-relaxed break-words [overflow-wrap:anywhere]">
                      {comment.body}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            review.status === 'COMPLETED' && (
              <p className="text-xs text-muted-foreground italic">
                No findings — this PR is clean.
              </p>
            )
          )}
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleRun}
              disabled={running || !headSha.trim()}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-hairline text-[11px] text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors disabled:opacity-50"
              title="Re-run the review for the head SHA"
            >
              {running ? (
                <Loader2 className="h-3 w-3 animate-spin" />
              ) : review.status === 'FAILED' ? (
                <RotateCcw className="h-3 w-3" />
              ) : (
                <RefreshCw className="h-3 w-3" />
              )}
              <span>
                {running
                  ? 'Reviewing…'
                  : review.status === 'FAILED'
                    ? 'Retry Review'
                    : 'Re-run Review'}
              </span>
            </button>
            {error && <p className="text-xs text-danger-fg">{error}</p>}
          </div>
        </>
      )}
    </section>
  )
}
