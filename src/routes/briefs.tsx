import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHeader } from '../components/devbraid/page-header'
import { StatusDot } from '../components/devbraid/status-dot'
import { mockBriefs, mockThreads } from '../lib/mock/data'

export const Route = createFileRoute('/briefs')({
  component: BriefsPage,
})

function BriefsPage() {
  return (
    <div>
      <PageHeader eyebrow="Workspace" title="Change Briefs" description="Generated briefs ready to publish as PR comments." />
      <div className="rounded-xl border border-hairline overflow-hidden">
        {mockBriefs.map(brief => {
          const thread = mockThreads.find(t => t.id === brief.threadId)
          return (
            <Link
              key={brief.id}
              to="/briefs/$id"
              params={{ id: brief.id }}
              className="flex items-center gap-4 px-5 py-4 border-b border-hairline last:border-0 hover:bg-surface/50 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{brief.title}</p>
                <p className="text-xs text-muted-foreground">{brief.sections.length} sections · {brief.unresolvedQuestions.length} open questions</p>
              </div>
              <span className="text-xs text-muted-foreground">{thread?.repo}</span>
              <StatusDot status={brief.status} label />
            </Link>
          )
        })}
      </div>
    </div>
  )
}
