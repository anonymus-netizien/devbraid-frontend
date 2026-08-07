import { Pencil, Trash2, Check, X, Loader2 } from 'lucide-react'
import type { NoteListItem } from '../../types/thread'
import { formatDate } from '../../lib/time'

interface NoteCardProps {
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
}

export function NoteCard({
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
}: NoteCardProps) {
  const isEditing = editingNoteId === note.id
  const isDeleting = deletingNoteId === note.id

  return (
    <div className="rounded-xl bg-surface p-5 space-y-3">
      <div className="flex items-center justify-between pb-2">
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xs font-mono text-primary font-medium truncate">
            {note.threadTitle}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-[10px] text-muted-foreground font-mono shrink-0">
            {note.createdAt ? formatDate(note.createdAt) : ''}
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
            <label
              htmlFor={`nc-decision-${note.id}`}
              className="text-xs font-medium text-foreground"
            >
              Decision
            </label>
            <input
              id={`nc-decision-${note.id}`}
              type="text"
              value={editDecision}
              onChange={(e) => setEditDecision(e.target.value)}
              className="input input-md w-full border border-hairline bg-surface-2/40 px-3 py-2 text-xs text-foreground focus:border-primary/40"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor={`nc-rationale-${note.id}`}
              className="text-xs font-medium text-foreground"
            >
              Rationale
            </label>
            <textarea
              id={`nc-rationale-${note.id}`}
              value={editRationale}
              onChange={(e) => setEditRationale(e.target.value)}
              rows={3}
              className="input w-full resize-y border border-hairline bg-surface-2/40 px-3 py-2 text-xs text-foreground focus:border-primary/40"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor={`nc-alt-${note.id}`} className="text-xs font-medium text-foreground">
              Alternatives
            </label>
            <textarea
              id={`nc-alt-${note.id}`}
              value={editAlternatives}
              onChange={(e) => setEditAlternatives(e.target.value)}
              rows={2}
              className="input w-full resize-y border border-hairline bg-surface-2/40 px-3 py-2 text-xs text-foreground focus:border-primary/40"
            />
          </div>
          <div className="space-y-1">
            <label htmlFor={`nc-impact-${note.id}`} className="text-xs font-medium text-foreground">
              Impact
            </label>
            <textarea
              id={`nc-impact-${note.id}`}
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
