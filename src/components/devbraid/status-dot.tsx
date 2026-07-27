import { cn } from '../../lib/utils'

export type StatusType =
  | 'drafting'
  | 'draft'
  | 'analyzing'
  | 'ready'
  | 'published'
  | 'expired'
  | 'active'
  | 'revoked'

interface StatusDotProps {
  status: StatusType | string
  label?: boolean
}

export function StatusDot({ status, label }: StatusDotProps) {
  const color =
    status === 'ready' || status === 'active'
      ? 'bg-success'
      : status === 'analyzing'
      ? 'bg-warning animate-pulse'
      : status === 'published'
      ? 'bg-info'
      : status === 'expired' || status === 'revoked'
      ? 'bg-danger'
      : 'bg-muted-foreground/60'

  return (
    <span className="inline-flex items-center gap-1.5" role="status">
      <span className={cn('inline-block size-1.5 rounded-full', color)} />
      {label && <span className="text-xs text-muted-foreground capitalize">{status}</span>}
    </span>
  )
}

