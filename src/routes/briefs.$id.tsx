import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '../components/devbraid/page-header'
import { StatusDot } from '../components/devbraid/status-dot'
import { CitationChip } from '../components/devbraid/citation-chip'
import { mockBriefs, mockThreads } from '../lib/mock/data'

export const Route = createFileRoute('/briefs/$id')({
  component: BriefDetailPage,
})

function BriefDetailPage() {
  const { id } = Route.useParams()
  const brief = mockBriefs.find(b => b.id === id)
  const thread = brief ? mockThreads.find(t => t.id === brief.threadId) : null

  if (!brief) return <p className="text-muted-foreground py-8">Brief not found.</p>

  return (
    <div>
      <PageHeader
        eyebrow={thread?.repo || ''}
        title={brief.title}
        action={<StatusDot status={brief.status} label />}
      />
      <div className="space-y-6">
        {brief.sections.map((section) => (
          <div key={section.title}>
            <p className="text-sm font-medium text-foreground mb-3">{section.title}</p>
            <div className="space-y-2">
              {section.claims.map((claim) => (
                <div key={claim.text} className="rounded-lg border border-hairline bg-surface p-3">
                  <p className="text-sm text-foreground mb-2">{claim.text}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {claim.citations.map((c) => <CitationChip key={`${c.file}:${c.line}`} citation={c} />)}
                    <span className={`text-xs px-2 py-0.5 rounded-full ${claim.provenance === 'cited' ? 'bg-success-bg text-success-fg' : 'bg-info-bg text-info-fg'}`}>{claim.provenance}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {brief.unresolvedQuestions.length > 0 && (
          <div>
            <p className="text-sm font-medium text-danger-fg mb-2">Unresolved questions</p>
            {brief.unresolvedQuestions.map((q) => (
              <div key={q} className="rounded-lg border border-danger-border bg-danger-bg p-3 mb-2 text-sm text-danger-fg">{q}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
