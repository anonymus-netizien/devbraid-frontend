import { GitBranch } from 'lucide-react'

interface BranchPairProps {
  head: string
  base: string
}

export function BranchPair({ head, base }: BranchPairProps) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-mono text-muted-foreground">
      <GitBranch className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
      <span className="truncate">{head}</span>
      <span className="text-xs">→</span>
      <span className="truncate">{base}</span>
    </span>
  )
}
