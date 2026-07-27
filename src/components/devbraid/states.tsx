import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

export function EmptyState({
  title,
  description,
  action,
  className,
}: {
  title: string
  description?: string
  action?: ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-hairline bg-surface/30 px-6 py-12 text-center',
        className,
      )}
    >
      <div className="grid size-8 place-items-center rounded-md border border-hairline bg-surface text-muted-foreground">
        <span className="text-xs">+</span>
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        {description && (
          <p className="max-w-sm text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </div>
  )
}

export function LoadingRows({ rows = 5 }: { rows?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-9 animate-pulse rounded-md bg-surface/60"
          style={{ opacity: 1 - i * 0.12 }}
        />
      ))}
    </div>
  )
}

export function ErrorPanel({
  code = 'E_UNKNOWN',
  message = 'Something went wrong loading this view.',
  onRetry,
}: {
  code?: string
  message?: string
  onRetry?: () => void
}) {
  return (
    <div className="rounded-lg border border-danger-border bg-danger-bg p-6">
      <div className="mb-2 font-mono text-[10px] uppercase tracking-widest text-danger">
        {code}
      </div>
      <p className="text-sm text-danger">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 inline-flex items-center rounded-md border border-danger-border bg-danger-bg px-3 py-1.5 text-xs font-medium text-danger transition-colors hover:bg-danger/15"
        >
          Try again
        </button>
      )}
    </div>
  )
}

export function PageHeader({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: ReactNode
  title: string
  description?: string
  actions?: ReactNode
}) {
  return (
    <div className="mb-8 flex items-start justify-between gap-6">
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </div>
        )}
        <h1 className="text-balance text-2xl font-semibold tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="shrink-0">{actions}</div>}
    </div>
  )
}
