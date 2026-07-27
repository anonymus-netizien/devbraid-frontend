import { createFileRoute } from '@tanstack/react-router'
import { GitCommit, FileCode, Plus } from 'lucide-react'
import { PageHeader } from '../components/devbraid/page-header'
import { StatusDot } from '../components/devbraid/status-dot'
import { RiskChip } from '../components/devbraid/risk-chip'
import { BranchPair } from '../components/devbraid/branch-pair'
import { CitationChip } from '../components/devbraid/citation-chip'
import { EmptyState } from '../components/devbraid/empty-state'
import { mockThreads, mockNotes, mockBriefs, mockChangedFiles, mockCommits } from '../lib/mock/data'

export const Route = createFileRoute('/threads/$id')({
  component: ThreadDetailPage,
})

function ThreadDetailPage() {
  const { id } = Route.useParams()
  const thread = mockThreads.find(t => t.id === id)
  const threadNotes = mockNotes.filter(n => n.threadId === id)
  const threadBrief = mockBriefs.find(b => b.threadId === id)

  if (!thread) return <EmptyState title="Thread not found" description="This thread may have been deleted." />

  return (
    <div>
      <PageHeader
        eyebrow={thread.repo}
        title={thread.title}
        action={
          <div className="flex gap-2">
            <button className="px-4 py-2 rounded-lg border border-hairline text-sm text-foreground hover:bg-surface transition-colors">Regenerate brief</button>
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors" disabled={thread.status === 'published'}>Publish to GitHub</button>
          </div>
        }
      />

      <div className="flex gap-8">
        {/* Main column */}
        <div className="flex-1 min-w-0 space-y-8">
          <div className="flex items-center gap-3">
            <BranchPair head={thread.headBranch} base={thread.baseBranch} />
            {thread.issueNumber && <span className="text-xs text-muted-foreground">#{thread.issueNumber}</span>}
            <StatusDot status={thread.status} label />
          </div>

          {/* Risk profile */}
          <section>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Risk profile · deterministic</p>
            {thread.riskFlags.length > 0 ? (
              <div className="flex gap-2">{thread.riskFlags.map(f => <RiskChip key={f} flag={f} />)}</div>
            ) : (
              <p className="text-sm text-muted-foreground">No risk flags detected.</p>
            )}
          </section>

          {/* Decision notes */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Decision notes</p>
                <p className="text-xs text-muted-foreground italic">always developer-attributed, never generated</p>
              </div>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-hairline text-sm text-muted-foreground hover:text-foreground hover:bg-surface transition-colors">
                <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                Add note
              </button>
            </div>
            {threadNotes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No decision notes yet. Add one before generating a brief.</p>
            ) : (
              <div className="space-y-3">
                {threadNotes.map(note => (
                  <div key={note.id} className="rounded-xl border border-hairline bg-surface p-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div><p className="text-muted-foreground mb-1">Decision</p><p className="text-foreground">{note.decision}</p></div>
                      <div><p className="text-muted-foreground mb-1">Rationale</p><p className="text-foreground">{note.rationale}</p></div>
                      <div><p className="text-muted-foreground mb-1">Alternatives</p><p className="text-foreground">{note.alternatives}</p></div>
                      <div><p className="text-muted-foreground mb-1">Impact</p><p className="text-foreground">{note.impact}</p></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Generated brief */}
          {threadBrief && (
            <section>
              <div className="flex items-center gap-2 mb-3">
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Generated Change Brief</p>
                <StatusDot status={threadBrief.status} />
              </div>
              {threadBrief.sections.map((section, i) => (
                <div key={i} className="mb-4">
                  <p className="text-sm font-medium text-foreground mb-2">{section.title}</p>
                  <div className="space-y-2">
                    {section.claims.map((claim, j) => (
                      <div key={j} className="rounded-lg border border-hairline bg-surface p-3">
                        <p className="text-sm text-foreground mb-2">{claim.text}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          {claim.citations.map((c, k) => <CitationChip key={k} citation={c} />)}
                          <span className={`text-xs px-2 py-0.5 rounded-full ${claim.provenance === 'cited' ? 'bg-success-bg text-success-fg' : 'bg-info-bg text-info-fg'}`}>{claim.provenance}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {threadBrief.unresolvedQuestions.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-danger-fg mb-2">Unresolved questions</p>
                  {threadBrief.unresolvedQuestions.map((q, i) => (
                    <div key={i} className="rounded-lg border border-danger-border bg-danger-bg p-3 mb-2 text-sm text-danger-fg">{q}</div>
                  ))}
                </div>
              )}
            </section>
          )}
        </div>

        {/* Evidence panel */}
        <aside className="w-80 shrink-0 space-y-6">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Changed files</p>
            {mockChangedFiles.length === 0 ? (
              <p className="text-sm text-muted-foreground">No files yet.</p>
            ) : (
              <div className="space-y-1">
                {mockChangedFiles.map((f, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-mono py-1">
                    <FileCode className="h-3.5 w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
                    <span className="text-foreground truncate">{f.path}</span>
                    <span className="ml-auto text-success-fg">+{f.additions}</span>
                    <span className="text-danger-fg">-{f.deletions}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-3">Commits</p>
            {mockCommits.length === 0 ? (
              <p className="text-sm text-muted-foreground">No commits pulled yet.</p>
            ) : (
              <div className="space-y-3">
                {mockCommits.map((c, i) => (
                  <div key={i}>
                    <div className="flex items-center gap-2">
                      <GitCommit className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                      <span className="text-xs font-mono text-primary">{c.sha}</span>
                    </div>
                    <p className="text-sm text-foreground mt-1">{c.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
