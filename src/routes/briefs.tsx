import { useState, useEffect } from 'react'
import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHeader } from '../components/devbraid/page-header'
import { StatusDot } from '../components/devbraid/status-dot'
import { threadService } from '../services/thread.service'
import type { BriefListItem } from '../types/thread'
import { FileText, RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/briefs')({
  component: BriefsPage,
})

function BriefsPage() {
  const [briefs, setBriefs] = useState<BriefListItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBriefs = async () => {
    setLoading(true)
    try {
      const data = await threadService.listBriefs(0, 50)
      setBriefs(data?.content || [])
    } catch {
      setBriefs([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBriefs()
  }, [])

  return (
    <div>
      <PageHeader eyebrow="Workspace" title="Change Briefs" description="Generated briefs ready to publish as PR comments." />
      {loading ? (
        <div className="rounded-xl border border-hairline p-8 text-center text-muted-foreground text-sm space-y-3">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary" />
          <p>Loading Change Briefs...</p>
        </div>
      ) : briefs.length === 0 ? (
        <div className="rounded-xl border border-hairline p-8 text-center text-muted-foreground text-sm">
          No briefs yet. Generate one from a Change Thread.
        </div>
      ) : (
        <div className="rounded-xl border border-hairline overflow-hidden">
          {briefs.map(brief => (
            <Link
              key={brief.id}
              to="/briefs/$id"
              params={{ id: brief.id }}
              className="flex items-center gap-4 px-5 py-4 border-b border-hairline last:border-0 hover:bg-surface/50 transition-colors"
            >
              <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{brief.threadTitle}</p>
                <p className="text-xs text-muted-foreground">{brief.repositoryFullName}</p>
              </div>
              <span className="text-xs text-muted-foreground font-mono">{brief.headBranch} → {brief.baseBranch}</span>
              <StatusDot status={(brief.threadStatus || 'drafting').toLowerCase() as any} label />
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
