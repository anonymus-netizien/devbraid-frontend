import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Pencil, X, Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'
import { threadService } from '../../services/thread.service'
import type { ChangeThread } from '../../types/thread'

interface EditThreadDialogProps {
  thread: ChangeThread
  onSaved: (updated: ChangeThread) => void
}

export function EditThreadDialog({ thread, onSaved }: EditThreadDialogProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState(thread.title)
  const [description, setDescription] = useState(thread.description ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return
    setSaving(true)
    setError(null)
    setSuccess(false)
    try {
      const updated = await threadService.updateThread(thread.id, {
        title: title.trim(),
        description: description.trim() || undefined,
      })
      setSuccess(true)
      onSaved(updated)
      setTimeout(() => {
        setOpen(false)
        setSuccess(false)
      }, 500)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to update thread')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog.Root
      open={open}
      onOpenChange={(next) => {
        setOpen(next)
        if (next) {
          setTitle(thread.title)
          setDescription(thread.description ?? '')
          setError(null)
          setSuccess(false)
        }
      }}
    >
      <Dialog.Trigger asChild>
        <button type="button" className="btn btn-ghost btn-sm">
          <Pencil className="h-3.5 w-3.5" />
          <span>Edit</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 animate-in fade-in bg-black/60 backdrop-blur-xs duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 animate-in zoom-in-95 rounded-xl border border-hairline bg-surface p-4 shadow-elevation-3 duration-200 focus:outline-none sm:p-6">
          <div className="mb-5 flex items-center justify-between border-b border-hairline pb-4">
            <div className="flex items-center gap-2">
              <Pencil className="size-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Edit Thread</h2>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Short description of the change"
                className="input input-md w-full border border-hairline bg-surface-2/40 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Context, motivation, or links for this change"
                rows={4}
                className="input w-full resize-y border border-hairline bg-surface-2/40 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/40"
              />
            </div>
            {error && (
              <p className="flex items-center gap-1.5 text-xs text-danger-fg">
                <AlertTriangle className="size-3.5" />
                {error}
              </p>
            )}
            {success && (
              <p className="flex items-center gap-1.5 text-xs text-success-fg">
                <CheckCircle2 className="size-3.5" />
                Thread updated successfully
              </p>
            )}
            <div className="flex items-center justify-end gap-2 pt-1">
              <Dialog.Close asChild>
                <button type="button" className="btn btn-ghost btn-md">
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={saving || !title.trim()}
                className="btn btn-primary btn-md"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Pencil className="h-3.5 w-3.5" />
                )}
                <span>{saving ? 'Saving...' : 'Save Changes'}</span>
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
