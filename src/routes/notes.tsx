import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { PageHeader } from '@/components/devbraid/states'
import { NoteCard } from '@/components/devbraid/note-card'
import { queryKeys, useNotesQuery } from '@/hooks/queries'
import { threadService } from '@/services/thread.service'
import type { NoteListItem } from '../types/thread'
import { RefreshCw } from 'lucide-react'

export const Route = createFileRoute('/notes')({
  component: NotesPage,
})

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
