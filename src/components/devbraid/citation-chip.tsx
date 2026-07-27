import { GitCommit, FileCode } from 'lucide-react'
import type { Citation } from '../../types'

interface CitationChipProps {
  citation: Citation
}

export function CitationChip({ citation }: CitationChipProps) {
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-surface-2 border border-hairline px-2 py-0.5 text-xs font-mono text-muted-foreground">
      {citation.type === 'commit' ? <GitCommit className="h-3 w-3" /> : <FileCode className="h-3 w-3" />}
      <span className="truncate max-w-[120px]">{citation.value}</span>
    </span>
  )
}
