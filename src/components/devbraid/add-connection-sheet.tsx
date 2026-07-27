import { useState } from 'react'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet'
import githubService from '../../services/github.service'

const scopes = [
  { id: 'repo', label: 'repo', desc: 'Read commits & post PR comments' },
  { id: 'read:user', label: 'read:user', desc: 'Show your GitHub username' },
]

export function AddConnectionSheet({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
  onSuccess?: () => void
}) {
  const [token, setToken] = useState('')
  const [checked, setChecked] = useState<string[]>(['repo'])
  const [submitting, setSubmitting] = useState(false)

  const toggle = (id: string) =>
    setChecked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))

  const handleSubmit = async () => {
    if (!token.trim()) return

    try {
      setSubmitting(true)
      await githubService.connect(token.trim())
      setToken('')
      onOpenChange(false)
      toast.success('Connection added', {
        description: 'Token validated and stored encrypted.',
      })
      onSuccess?.()
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to connect GitHub token'
      toast.error('Connection failed', { description: msg })
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md bg-background text-foreground border-l border-hairline">
        <SheetHeader>
          <SheetTitle className="text-foreground">Add GitHub connection</SheetTitle>
          <SheetDescription className="text-muted-foreground">
            Paste a fine-grained personal access token. It's encrypted at rest and only
            used for the calls DevBraid makes on your behalf.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5 px-4">
          <div className="space-y-1.5">
            <label
              htmlFor="github-token-input"
              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground"
            >
              Personal access token
            </label>
            <input
              id="github-token-input"
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_••••••••••••••••••••••••••••••"
              aria-describedby="github-token-hint"
              className="h-9 w-full rounded-md border border-hairline bg-background px-3 font-mono text-sm outline-none placeholder:text-muted-foreground focus:border-primary/40 focus:ring-1 focus:ring-primary/40"
              disabled={submitting}
            />
            <p id="github-token-hint" className="text-[11px] text-muted-foreground">
              Generate at github.com/settings/tokens. Never shared with third parties.
            </p>
          </div>

          <div className="space-y-2">
            <span className="block text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Required scopes
            </span>
            <div className="space-y-1.5">
              {scopes.map((s) => (
                <label
                  key={s.id}
                  className="flex cursor-pointer items-start gap-3 rounded-md border border-hairline bg-surface/40 px-3 py-2 hover:bg-surface"
                >
                  <input
                    type="checkbox"
                    checked={checked.includes(s.id)}
                    onChange={() => toggle(s.id)}
                    className="mt-0.5 size-3.5 accent-primary"
                  />
                  <div>
                    <div className="font-mono text-xs">{s.label}</div>
                    <div className="text-[11px] text-muted-foreground">{s.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              disabled={submitting}
              className="rounded-md border border-hairline bg-surface px-3 py-1.5 text-xs font-medium hover:bg-surface-2 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={token.length < 4 || submitting}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            >
              {submitting ? 'Validating...' : 'Validate & save'}
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
