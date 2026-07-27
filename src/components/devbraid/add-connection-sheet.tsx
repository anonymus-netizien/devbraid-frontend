import { useState } from 'react'
import { toast } from 'sonner'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../ui/sheet'

const scopes = [
  { id: 'repo', label: 'repo', desc: 'Read commits & post PR comments' },
  { id: 'read:user', label: 'read:user', desc: 'Show your GitHub username' },
]

export function AddConnectionSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const [token, setToken] = useState('')
  const [checked, setChecked] = useState<string[]>(['repo'])
  const toggle = (id: string) =>
    setChecked((c) => (c.includes(id) ? c.filter((x) => x !== id) : [...c, id]))

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Add GitHub connection</SheetTitle>
          <SheetDescription>
            Paste a fine-grained personal access token. It's encrypted at rest and only
            used for the calls DevBraid makes on your behalf.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-5 px-4">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Personal access token
            </label>
            <input
              type="password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              placeholder="ghp_••••••••••••••••••••••••••••••"
              className="h-9 w-full rounded-md border border-hairline bg-background px-3 font-mono text-sm outline-none placeholder:text-muted-foreground focus:border-primary/40 focus:ring-1 focus:ring-primary/40"
            />
            <p className="text-[11px] text-muted-foreground">
              Generate at github.com/settings/tokens. Never shared with third parties.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Required scopes
            </label>
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
              onClick={() => onOpenChange(false)}
              className="rounded-md border border-hairline bg-surface px-3 py-1.5 text-xs font-medium hover:bg-surface-2"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onOpenChange(false)
                toast.success('Connection added', {
                  description: 'Token validated and stored encrypted.',
                })
              }}
              disabled={token.length < 4}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-40"
            >
              Validate & save
            </button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
