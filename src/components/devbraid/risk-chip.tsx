import { cn } from '../../lib/utils'
import type { RiskFlag } from '../../types'

const riskStyles: Record<RiskFlag, string> = {
  AUTH: 'bg-danger-bg border-danger-border text-danger-fg',
  MIGRATIONS: 'bg-warning-bg border-warning-border text-warning-fg',
  PUBLIC_API: 'bg-danger-bg border-danger-border text-danger-fg',
  DEPENDENCY: 'bg-warning-bg border-warning-border text-warning-fg',
  CI: 'bg-info-bg border-info-border text-info-fg',
}

interface RiskChipProps {
  flag: RiskFlag
}

export function RiskChip({ flag }: RiskChipProps) {
  return (
    <span className={cn('inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-mono', riskStyles[flag])}>
      {flag}
    </span>
  )
}
