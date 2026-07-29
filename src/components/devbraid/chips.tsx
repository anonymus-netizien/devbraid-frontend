import type { ReactNode } from 'react'
import { GitBranch } from 'lucide-react'
import { cn } from '@/lib/utils'

export function CitationChip({
  kind,
  ref: r,
}: {
  kind: 'c' | 'f'
  ref: string
}) {
  return (
    <span className="mx-0.5 inline-flex items-baseline gap-1 rounded border border-hairline bg-surface px-1.5 py-0.5 font-mono text-[10px] leading-none text-muted-foreground align-middle">
      <span className="text-primary/80">{kind}:</span>
      <span className="max-w-[22ch] truncate text-foreground/90">{r}</span>
    </span>
  )
}

export function InferencePill() {
  return (
    <span className="ml-1 inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary align-middle select-none">
      Inference
    </span>
  )
}

export function CitedPill() {
  return (
    <span className="ml-1 inline-flex items-center rounded-full border border-hairline bg-surface px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground align-middle select-none">
      Cited
    </span>
  )
}

const riskColor: Record<string, string> = {
  AUTH: 'border-danger-border bg-danger-bg text-danger',
  MIGRATIONS: 'border-warning-border bg-warning-bg text-warning',
  PUBLIC_API: 'border-info-border bg-info-bg text-info',
  DEPENDENCY: 'border-neutral-accent-border bg-neutral-accent-bg text-neutral-accent',
  CI: 'border-success-border bg-success-bg text-success',
}

export function RiskChip({ flag, dense }: { flag: string; dense?: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded border font-medium',
        riskColor[flag] || 'border-hairline bg-surface text-muted-foreground',
        dense ? 'px-1.5 py-0.5 text-[10px]' : 'px-2 py-1 text-[11px]',
      )}
    >
      <span className="size-1.5 rounded-full bg-current" />
      {flag}
    </span>
  )
}

export function BranchTag({
  children,
  tone = 'muted',
}: {
  children: ReactNode
  tone?: 'muted' | 'accent'
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded border px-1.5 py-0.5 font-mono text-[10px]',
        tone === 'accent'
          ? 'border-primary/25 bg-primary/10 text-primary'
          : 'border-hairline bg-surface text-muted-foreground',
      )}
    >
      {children}
    </span>
  )
}

export function BranchPair({ base, head }: { base: string; head: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-xs">
      <BranchTag tone="accent">{head}</BranchTag>
      <span className="text-muted-foreground">→</span>
      <BranchTag>{base}</BranchTag>
    </span>
  )
}

export function StatusDot({ status }: { status: string }) {
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
  return <span className={cn('inline-block size-1.5 rounded-full', color)} title={status} />
}

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </div>
  )
}
