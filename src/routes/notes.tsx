import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '../components/devbraid/page-header'
import { mockNotes, mockThreads } from '../lib/mock/data'

export const Route = createFileRoute('/notes')({
  component: NotesPage,
})

function NotesPage() {
  const grouped = mockThreads
    .map(t => ({ thread: t, notes: mockNotes.filter(n => n.threadId === t.id) }))
    .filter(g => g.notes.length > 0)

  return (
    <div>
      <PageHeader eyebrow="Workspace" title="Decision Notes" description="Developer-attributed decisions, never generated." />
      {grouped.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8">No decision notes yet.</p>
      ) : (
        <div className="space-y-8">
          {grouped.map(({ thread, notes }) => (
            <div key={thread.id}>
              <p className="text-xs font-mono text-muted-foreground mb-1">{thread.repo}</p>
              <p className="text-sm font-medium text-foreground mb-3">{thread.title}</p>
              <div className="space-y-3">
                {notes.map(note => (
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
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
