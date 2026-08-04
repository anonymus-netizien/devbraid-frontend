import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '@/components/devbraid/states'
import { queryKeys, useNotesQuery } from '@/hooks/queries'
import { threadService } from '@/services/thread.service'
import type { NoteListItem } from '../types/thread'
import { Pencil, Trash2, RefreshCw, Check, X, Loader2 } from 'lucide-react'

export const Route = createFileRoute('/notes')({
  component: NotesPage,
})

function NoteCard({
  note,
  onEdit,
  onSaveEdit,
  onDelete,
  editingNoteId,
  editDecision,
  editRationale,
  editAlternatives,
  editImpact,
  setEditDecision,
  setEditRationale,
  setEditAlternatives,
  setEditImpact,
  deletingNoteId,
}: {
  note: NoteListItem
  onEdit: (note: NoteListItem) => void
  onSaveEdit: (noteId: string) => void
  onDelete: (noteId: string) => void
  editingNoteId: string | null
  editDecision: string
  editRationale: string
  editAlternatives: string
  editImpact: string
  setEditDecision: (v: string) => void
  setEditRationale: (v: string) => void
  setEditAlternatives: (v: string) => void
  setEditImpact: (v: string) => void
  deletingNoteId: string | null
}) {
  const isEditing = editingNoteId === note.id
  const isDeleting = deletingNoteId === note.id

  return (
    <div className="rounded-xl border border-hairline bg-surface p-5 space-y-3">
      <div className="flex items-center justify-between border-b border-hairline pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono text-primary font-medium truncate">
            {note.threadTitle}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground font-mono shrink-0">
            {note.createdAt ? new Date(note.createdAt).toLocaleDateString() : ''}
          </span>
          {!isEditing && (
            <>
              <button
                type="button"
                onClick={() => onEdit(note)}
                className="grid size-6 place-items-center rounded text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                title="Edit note"
              >
                <Pencil className="size-3" />
              </button>
              <button
                type="button"
                onClick={() => onDelete(note.id)}
                disabled={isDeleting}
                className="grid size-6 place-items-center rounded text-muted-foreground transition-colors hover:bg-surface-2 hover:text-danger-fg disabled:opacity-40"
                title="Delete note"
              >
                {isDeleting ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <Trash2 className="size-3" />
                )}
              </button>
            </>
          )}
        </div>
      </div>
      <p className="text-xs text-muted-foreground">{note.repositoryFullName}</p>

      {isEditing ? (
        <div className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Decision</label>
            <input
              type="text"
              value={editDecision}
              onChange={(e) => setEditDecision(e.target.value)}
              className="input input-sm w-full border border-hairline bg-surface-2/40 px-3 py-2 text-xs text-foreground focus:border-primary/40"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Rationale</label>
            <textarea
              value={editRationale}
              onChange={(e) => setEditRationale(e.target.value)}
              rows={3}
              className="input w-full resize-y border border-hairline bg-surface-2/40 px-3 py-2 text-xs text-foreground focus:border-primary/40"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Alternatives</label>
            <textarea
              value={editAlternatives}
              onChange={(e) => setEditAlternatives(e.target.value)}
              rows={2}
              className="input w-full resize-y border border-hairline bg-surface-2/40 px-3 py-2 text-xs text-foreground focus:border-primary/40"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-medium text-foreground">Impact</label>
            <textarea
              value={editImpact}
              onChange={(e) => setEditImpact(e.target.value)}
              rows={2}
              className="input w-full resize-y border border-hairline bg-surface-2/40 px-3 py-2 text-xs text-foreground focus:border-primary/40"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSaveEdit(note.id)}
              disabled={!editDecision.trim() || !editRationale.trim()}
              className="flex items-center gap-1 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-40"
            >
              <Check className="size-3" /> Save
            </button>
            <button
              type="button"
              onClick={() => onEdit({ ...note, id: '' } as NoteListItem)}
              className="flex items-center gap-1 rounded-lg border border-hairline px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface-2"
            >
              <X className="size-3" /> Cancel
            </button>
          </div>
        </div>
      ) : (
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
      )}
    </div>
  )
}

function NotesPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useNotesQuery()
  const notes: NoteListItem[] = data?.content ?? []

  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editDecision, setEditDecision] = useState('')
  const [editRationale, setEditRationale] = useState('')
  const [editAlternatives, setEditAlternatives] = useState('')
  const [editImpact, setEditImpact] = useState('')
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleEdit = (note: NoteListItem) => {
    if (!note.id) return
    setEditingNoteId(note.id)
    setEditDecision(note.decision ?? '')
    setEditRationale(note.rationale ?? '')
    setEditAlternatives(note.alternatives || '')
    setEditImpact(note.impact || '')
    setMessage(null)
  }

  const handleSaveEdit = async (noteId: string) => {
    if (!noteId || !editDecision.trim() || !editRationale.trim()) return
    const note = notes.find((n) => n.id === noteId)
    if (!note) return

    setMessage(null)
    try {
      const updated = await threadService.updateNote(note.threadId, noteId, {
        decision: editDecision.trim(),
        rationale: editRationale.trim(),
        alternatives: editAlternatives.trim() || undefined,
        impact: editImpact.trim() || undefined,
      })
      queryClient.setQueryData(queryKeys.notes, (old: typeof data) => {
        if (!old) return old
        return {
          ...old,
          content: old.content.map((n) =>
            n.id === noteId
              ? {
                  ...n,
                  decision: updated.decision,
                  rationale: updated.rationale,
                  alternatives: updated.alternatives,
                  impact: updated.impact,
                }
              : n,
          ),
        }
      })
      setEditingNoteId(null)
      setMessage({ type: 'success', text: 'Note updated.' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update note'
      setMessage({ type: 'error', text: msg })
    }
  }

  const handleDelete = async (noteId: string) => {
    const note = notes.find((n) => n.id === noteId)
    if (!note) return
    if (!window.confirm('Delete this decision note?')) return

    setDeletingNoteId(noteId)
    setMessage(null)
    try {
      await threadService.deleteNote(note.threadId, noteId)
      queryClient.setQueryData(queryKeys.notes, (old: typeof data) => {
        if (!old) return old
        return { ...old, content: old.content.filter((n) => n.id !== noteId) }
      })
      setMessage({ type: 'success', text: 'Note deleted.' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete note'
      setMessage({ type: 'error', text: msg })
    } finally {
      setDeletingNoteId(null)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Decision Notes"
        description="Developer-attributed decisions, never generated."
      />

      {message && (
        <div
          className={`mb-4 rounded-lg px-4 py-2 text-xs font-medium ${
            message.type === 'success'
              ? 'bg-success-bg text-success-fg'
              : 'bg-danger-bg text-danger-fg'
          }`}
        >
          {message.text}
        </div>
      )}

      {isLoading ? (
        <div className="py-12 text-center space-y-3">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto text-primary" />
          <p className="text-sm text-muted-foreground">Loading decision notes...</p>
        </div>
      ) : notes.length === 0 ? (
        <div className="py-8 text-center">
          <p className="text-sm font-medium text-foreground">No decision notes yet</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Open a Change Thread and add a note to record a decision — it becomes the evidence your
            AI briefs cite.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onEdit={handleEdit}
              onSaveEdit={handleSaveEdit}
              onDelete={handleDelete}
              editingNoteId={editingNoteId}
              editDecision={editDecision}
              editRationale={editRationale}
              editAlternatives={editAlternatives}
              editImpact={editImpact}
              setEditDecision={setEditDecision}
              setEditRationale={setEditRationale}
              setEditAlternatives={setEditAlternatives}
              setEditImpact={setEditImpact}
              deletingNoteId={deletingNoteId}
            />
          ))}
        </div>
      )}
    </div>
  )
}
