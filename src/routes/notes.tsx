import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/devbraid/states'
import { threadService } from '../services/thread.service'
import type { NoteListItem } from '../types/thread'
import { RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/notes')({
  component: NotesPage,
})

function NotesPage() {
  const [notes, setNotes] = useState<NoteListItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    threadService
      .listNotes(0, 50)
      .then((data) => setNotes(data?.content || []))
      .catch(() => setNotes([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Decision Notes"
        description="Developer-attributed decisions, never generated."
      />
      {loading ? (
        <div className="py-12 text-center space-y-3">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading decision notes...</p>
        </div>
      ) : notes.length === 0 ? (
        <p className="text-sm text-muted-foreground py-8">No decision notes yet.</p>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className="rounded-xl border border-hairline bg-surface p-5 space-y-3"
            >
              <div className="flex items-center justify-between border-b border-hairline pb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-xs font-mono text-primary font-medium truncate">
                    {note.threadTitle}
                  </span>
                </div>
                <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                  {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ''}
                </span>
              </div>
              <p className="text-xs text-muted-foreground">{note.repositoryFullName}</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Decision</p>
                  <p className="text-sm text-foreground font-medium">{note.decision}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Rationale</p>
                  <p className="text-sm text-foreground">{note.rationale}</p>
                </div>
                {note.alternatives && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Alternatives</p>
                    <p className="text-sm text-foreground">{note.alternatives}</p>
                  </div>
                )}
                {note.impact && (
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Impact</p>
                    <p className="text-sm text-foreground">{note.impact}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
