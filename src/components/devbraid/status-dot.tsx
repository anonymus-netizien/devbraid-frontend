import { cn } from '../../lib/utils'
import type { ThreadStatus, BriefStatus } from '../../types'

const statusColors: Record<string, string> = {
  drafting: 'bg-muted-foreground',
  analyzing: 'bg-primary animate-pulse',
  ready: 'bg-success-fg',
  published: 'bg-info-fg',
  draft: 'bg-muted-foreground',
}

interface StatusDotProps {
  status: ThreadStatus | BriefStatus
  label?: boolean
}

export function StatusDot({ status, label }: StatusDotProps) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={cn('h-2 w-2 rounded-full', statusColors[status])} />
      {label && <span className="text-sm text-muted-foreground capitalize">{status}</span>}
    </span>
  )
}
