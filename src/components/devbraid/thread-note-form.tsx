import { useState } from 'react'
import { Plus, Loader2 } from 'lucide-react'
import type { NoteContext } from '@/types/thread'

export interface NoteFormValues {
  decision: string
  rationale: string
  alternatives?: string
  impact?: string
  context: NoteContext
  contextRef?: string
}

interface ThreadNoteFormProps {
  /** Parent handles the API call + cache; resolves on success, throws on failure (values kept). */
  onSubmit: (values: NoteFormValues) => Promise<void>
}

export function ThreadNoteForm({ onSubmit }: ThreadNoteFormProps) {
  // ponytail: all note-form fields change together — one slice keeps them consistent
  const [form, setForm] = useState({
    show: false,
    decision: '',
    rationale: '',
    alternatives: '',
    impact: '',
    context: 'THREAD' as NoteContext,
    contextRef: '',
    adding: false,
  })
  const set = (patch: Partial<typeof form>) => setForm((prev) => ({ ...prev, ...patch }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.decision.trim() || !form.rationale.trim()) return
    set({ adding: true })
    try {
      await onSubmit({
        decision: form.decision.trim(),
        rationale: form.rationale.trim(),
        alternatives: form.alternatives.trim() || undefined,
        impact: form.impact.trim() || undefined,
        context: form.context,
        contextRef: form.contextRef.trim() || undefined,
      })
      set({
        show: false,
        decision: '',
        rationale: '',
        alternatives: '',
        impact: '',
        context: 'THREAD',
        contextRef: '',
      })
    } catch {
      // parent set the error message — keep values so the user can retry
    } finally {
      set({ adding: false })
    }
  }

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Decision Notes
          </p>
          <p className="text-xs text-muted-foreground italic">
            Developer-attributed reasoning for AI brief synthesis
          </p>
        </div>
        <button
          type="button"
          onClick={() => set({ show: !form.show })}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hairline text-xs font-medium text-foreground hover:bg-surface transition-colors"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>{form.show ? 'Cancel' : 'Add Note'}</span>
        </button>
      </div>

      {form.show && (
        <form
          onSubmit={handleSubmit}
          className="p-4 rounded-xl border border-primary/30 bg-surface-2 space-y-3"
        >
          <div>
            <label
              htmlFor="note-decision"
              className="block text-xs font-medium text-foreground mb-1"
            >
              Decision Made *
            </label>
            <input
              id="note-decision"
              type="text"
              placeholder="e.g. Switched to RSA-SHA256 for token hashing"
              value={form.decision}
              onChange={(e) => set({ decision: e.target.value })}
              required
              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div>
            <label
              htmlFor="note-rationale"
              className="block text-xs font-medium text-foreground mb-1"
            >
              Rationale *
            </label>
            <textarea
              id="note-rationale"
              rows={2}
              placeholder="Why this decision was chosen..."
              value={form.rationale}
              onChange={(e) => set({ rationale: e.target.value })}
              required
              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label
                htmlFor="note-context"
                className="block text-xs font-medium text-foreground mb-1"
              >
                Context
              </label>
              <select
                id="note-context"
                value={form.context}
                onChange={(e) => {
                  const next = e.target.value as NoteContext
                  if (next === 'THREAD') set({ context: next, contextRef: '' })
                  else set({ context: next })
                }}
                className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="THREAD">Thread</option>
                <option value="COMMIT">Commit</option>
                <option value="FILE">File</option>
              </select>
            </div>
            {(form.context === 'COMMIT' || form.context === 'FILE') && (
              <div>
                <label
                  htmlFor="note-ref"
                  className="block text-xs font-medium text-foreground mb-1"
                >
                  {form.context === 'COMMIT' ? 'Commit SHA' : 'File Path'}
                </label>
                <input
                  id="note-ref"
                  type="text"
                  placeholder={
                    form.context === 'COMMIT' ? 'e.g. a1b2c3d' : 'e.g. src/main/java/App.java'
                  }
                  value={form.contextRef}
                  onChange={(e) => set({ contextRef: e.target.value })}
                  className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="note-alt" className="block text-xs font-medium text-foreground mb-1">
                Alternatives Considered
              </label>
              <input
                id="note-alt"
                type="text"
                placeholder="e.g. HMAC-SHA512"
                value={form.alternatives}
                onChange={(e) => set({ alternatives: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label
                htmlFor="note-impact"
                className="block text-xs font-medium text-foreground mb-1"
              >
                Expected Impact
              </label>
              <input
                id="note-impact"
                type="text"
                placeholder="e.g. Backward compatible security upgrade"
                value={form.impact}
                onChange={(e) => set({ impact: e.target.value })}
                className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="submit"
              disabled={form.adding || !form.decision.trim()}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
            >
              {form.adding && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Save Decision Note
            </button>
          </div>
        </form>
      )}
    </>
  )
}
