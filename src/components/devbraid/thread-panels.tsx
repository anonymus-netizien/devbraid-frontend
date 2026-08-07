import { ShieldAlert } from 'lucide-react'
import { StatusDot, BranchPair } from '@/components/devbraid/chips'
import type { ChangeThread } from '@/types/thread'

// Backward-compat: JSONB columns now arrive typed from the backend, but older
// responses may still carry them as JSON strings — parse defensively.
const parseJson = (field: unknown): any[] => {
  if (Array.isArray(field)) return field
  if (typeof field === 'string') {
    try {
      return JSON.parse(field)
    } catch {
      return []
    }
  }
  return []
}

export function ThreadStatsBar({
  thread,
  notesCount,
}: {
  thread: ChangeThread
  notesCount: number
}) {
  const statusLower = (thread.status || 'drafting').toLowerCase()
  return (
    <div className="stats stats-horizontal shadow bg-surface w-full rounded-xl">
      <div className="stat py-3">
        <div className="stat-title text-xs text-muted-foreground">Branch Pair</div>
        <div className="stat-value text-sm mt-1">
          <BranchPair head={thread.headBranch} base={thread.baseBranch} />
        </div>
      </div>

      <div className="stat py-3">
        <div className="stat-title text-xs text-muted-foreground">Thread Status</div>
        <div className="stat-value text-sm mt-1 flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
            <StatusDot status={statusLower} />
            {thread.status?.toLowerCase() || 'draft'}
          </span>
        </div>
      </div>

      <div className="stat py-3">
        <div className="stat-title text-xs text-muted-foreground">Risk Score</div>
        <div className="stat-value text-sm mt-1 flex items-center gap-2">
          {thread.riskLevel ? (
            <span className="font-mono text-danger-fg flex items-center gap-1">
              <ShieldAlert className="h-4 w-4" />
              {thread.riskLevel}
            </span>
          ) : (
            <span className="text-xs text-muted-foreground italic">Not analyzed</span>
          )}
        </div>
      </div>

      <div className="stat py-3">
        <div className="stat-title text-xs text-muted-foreground">Decision Notes</div>
        <div className="stat-value text-sm font-mono text-foreground mt-1">{notesCount}</div>
      </div>
    </div>
  )
}

export function ThreadRiskProfile({ thread }: { thread: ChangeThread }) {
  const riskReportData: unknown =
    typeof thread.riskReport === 'string' ? parseJson(thread.riskReport) : thread.riskReport
  const riskReportObj: Record<string, unknown> =
    riskReportData && typeof riskReportData === 'object' && !Array.isArray(riskReportData)
      ? (riskReportData as Record<string, unknown>)
      : {}
  const riskFlagsFromReport = Array.isArray(riskReportObj.flags) ? riskReportObj.flags : []

  return (
    <section className="rounded-xl bg-surface p-5 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Risk Profile · {thread.riskLevel ? 'Deterministic Analysis' : 'Not analyzed'}
        </p>
        {thread.riskLevel && (
          <span
            className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
              thread.riskLevel === 'HIGH' || thread.riskLevel === 'CRITICAL'
                ? 'bg-danger-bg text-danger-fg border-danger-border'
                : thread.riskLevel === 'MEDIUM'
                  ? 'bg-warning-bg text-warning-fg border-warning-border'
                  : 'bg-success-bg text-success-fg border-success-border'
            }`}
          >
            {thread.riskLevel}
          </span>
        )}
      </div>
      {riskFlagsFromReport.length > 0 ? (
        <div className="space-y-2">
          <div className="flex flex-wrap gap-2">
            {riskFlagsFromReport.map((f: any, i: number) => (
              <span
                key={f.rule || i}
                className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                  f.severity === 'HIGH' || f.severity === 'CRITICAL'
                    ? 'border-danger-border bg-danger-bg text-danger-fg'
                    : f.severity === 'MEDIUM'
                      ? 'border-warning-border bg-warning-bg text-warning-fg'
                      : 'border-hairline bg-surface-2 text-muted-foreground'
                }`}
                title={f.message || ''}
              >
                {f.rule}
              </span>
            ))}
          </div>
          {riskFlagsFromReport.map(
            (f: any) =>
              f.message && (
                <p
                  key={f.rule}
                  className="text-xs text-muted-foreground pl-1 break-words [overflow-wrap:anywhere]"
                >
                  {f.message}
                </p>
              ),
          )}
        </div>
      ) : thread.riskLevel ? (
        <p className="text-sm text-muted-foreground">
          Risk assessed: <span className="font-mono text-foreground">{thread.riskLevel}</span>. No
          specific risk flags detected.
        </p>
      ) : (
        <p className="text-sm text-muted-foreground">
          Run AI Risk Analysis to evaluate this thread.
        </p>
      )}
    </section>
  )
}
