import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { Pencil, Trash2, Loader2 } from 'lucide-react'
import { threadService } from '@/services/thread.service'
import { queryKeys } from '@/hooks/queries'
import { formatDate } from '@/lib/time'
import type { NoteResponse } from '@/types/thread'
import { ThreadNoteForm, type NoteFormValues } from './thread-note-form'

type Message = { type: 'success' | 'error'; text: string } | null

interface ThreadNoteCardProps {
  note: NoteResponse
  deleting: boolean
  onSaveEdit: (
    noteId: string,
    fields: { decision: string; rationale: string; alternatives: string; impact: string },
  ) => Promise<boolean>
  onDelete: (noteId: string | undefined) => void
}

function ThreadNoteCard({ note, deleting, onSaveEdit, onDelete }: ThreadNoteCardProps) {
  // ponytail: edit fields change together — one slice, local to the card being edited
  const [editing, setEditing] = useState<{
    decision: string
    rationale: string
    alternatives: string
    impact: string
  } | null>(null)

  const handleSave = async () => {
    if (!editing || !note.id) return
    const ok = await onSaveEdit(note.id, {
      decision: editing.decision.trim(),
      rationale: editing.rationale.trim(),
      alternatives: editing.alternatives.trim(),
      impact: editing.impact.trim(),
    })
    if (ok) setEditing(null)
  }

  return (
    <div className="rounded-xl bg-surface p-4 space-y-2 group">
      <div className="flex items-center justify-between pb-2">
        <span className="text-xs font-mono font-medium text-primary">Decision Note</span>
        <div className="flex items-center gap-2">
          {note.createdAt && (
            <span className="text-[10px] text-muted-foreground font-mono">
              {formatDate(note.createdAt)}
            </span>
          )}
          {!editing && (
            <div className="hidden group-hover:flex items-center gap-1">
              <button
                type="button"
                onClick={() =>
                  setEditing({
                    decision: note.decision ?? '',
                    rationale: note.rationale ?? '',
                    alternatives: note.alternatives || '',
                    impact: note.impact || '',
                  })
                }
                className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                title="Edit note"
              >
                <Pencil className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (
                    window.confirm(
                      'Are you sure you want to delete this note? This action cannot be undone.',
                    )
                  ) {
                    onDelete(note.id)
                  }
                }}
                disabled={deleting}
                className="p-1 rounded text-muted-foreground hover:text-danger-fg hover:bg-danger-bg transition-colors"
                title="Delete note"
              >
                {deleting ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Trash2 className="h-3 w-3" />
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {editing ? (
        <div className="space-y-3 pt-2">
          <div>
            <label
              htmlFor={`edit-note-decision-${note.id}`}
              className="block text-xs font-medium text-foreground mb-1"
            >
              Decision
            </label>
            <input
              id={`edit-note-decision-${note.id}`}
              type="text"
              value={editing.decision}
              onChange={(e) => setEditing((prev) => prev && { ...prev, decision: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor={`edit-note-rationale-${note.id}`}
              className="block text-xs font-medium text-foreground mb-1"
            >
              Rationale
            </label>
            <textarea
              id={`edit-note-rationale-${note.id}`}
              rows={2}
              value={editing.rationale}
              onChange={(e) => setEditing((prev) => prev && { ...prev, rationale: e.target.value })}
              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor={`edit-note-alternatives-${note.id}`}
                className="block text-xs text-muted-foreground mb-1"
              >
                Alternatives
              </label>
              <input
                id={`edit-note-alternatives-${note.id}`}
                type="text"
                value={editing.alternatives}
                onChange={(e) =>
                  setEditing((prev) => prev && { ...prev, alternatives: e.target.value })
                }
                className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor={`edit-note-impact-${note.id}`}
                className="block text-xs text-muted-foreground mb-1"
              >
                Impact
              </label>
              <input
                id={`edit-note-impact-${note.id}`}
                type="text"
                value={editing.impact}
                onChange={(e) => setEditing((prev) => prev && { ...prev, impact: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={handleSave}
              disabled={!editing.decision.trim() || !editing.rationale.trim()}
              className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className="px-3 py-1.5 rounded-lg border border-hairline text-xs text-muted-foreground hover:text-foreground"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="min-w-0 break-words [overflow-wrap:anywhere]">
            <p className="text-muted-foreground mb-0.5">Decision</p>
            <p className="text-foreground font-medium">{note.decision}</p>
          </div>
          <div className="min-w-0 break-words [overflow-wrap:anywhere]">
            <p className="text-muted-foreground mb-0.5">Rationale</p>
            <p className="text-foreground">{note.rationale}</p>
          </div>
          {note.alternatives && (
            <div className="min-w-0 break-words [overflow-wrap:anywhere]">
              <p className="text-muted-foreground mb-0.5">Alternatives</p>
              <p className="text-foreground">{note.alternatives}</p>
            </div>
          )}
          {note.impact && (
            <div className="min-w-0 break-words [overflow-wrap:anywhere]">
              <p className="text-muted-foreground mb-0.5">Impact</p>
              <p className="text-foreground">{note.impact}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

interface ThreadNotesProps {
  threadId: string
  notes: NoteResponse[]
  onMessage: (msg: Message) => void
}

export function ThreadNotes({ threadId, notes, onMessage }: ThreadNotesProps) {
  const queryClient = useQueryClient()
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null)

  const handleAddNote = async (values: NoteFormValues) => {
    onMessage(null)
    try {
      const created = await threadService.addDecisionNote(threadId, values)
      queryClient.setQueryData(queryKeys.threadNotes(threadId), [created, ...notes])
      onMessage({ type: 'success', text: 'Decision note added.' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add note'
      onMessage({ type: 'error', text: msg })
      throw err
    }
  }

  const handleSaveEdit: ThreadNoteCardProps['onSaveEdit'] = async (noteId, fields) => {
    onMessage(null)
    try {
      const updated = await threadService.updateNote(threadId, noteId, {
        decision: fields.decision,
        rationale: fields.rationale,
        alternatives: fields.alternatives || undefined,
        impact: fields.impact || undefined,
      })
      queryClient.setQueryData(
        queryKeys.threadNotes(threadId),
        notes.map((n) => (n.id === noteId ? updated : n)),
      )
      onMessage({ type: 'success', text: 'Note updated.' })
      return true
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update note'
      onMessage({ type: 'error', text: msg })
      return false
    }
  }

  const handleDeleteNote = async (noteId: string | undefined) => {
    if (!noteId) return
    setDeletingNoteId(noteId)
    onMessage(null)
    try {
      await threadService.deleteNote(threadId, noteId)
      queryClient.setQueryData(
        queryKeys.threadNotes(threadId),
        notes.filter((n) => n.id !== noteId),
      )
      onMessage({ type: 'success', text: 'Note deleted.' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete note'
      onMessage({ type: 'error', text: msg })
    } finally {
      setDeletingNoteId(null)
    }
  }

  return (
    <section className="space-y-4">
      <ThreadNoteForm onSubmit={handleAddNote} />

      {notes.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4">
          No decision notes yet. Add one to give context to your PR brief.
        </p>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <ThreadNoteCard
              key={note.id}
              note={note}
              deleting={deletingNoteId === note.id}
              onSaveEdit={handleSaveEdit}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      )}
    </section>
  )
}
