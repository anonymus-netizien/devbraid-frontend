import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '../ui/dialog'
import { repos } from '../../lib/mock/data'
import { toast } from 'sonner'
import { useNavigate } from '@tanstack/react-router'

const branches = [
  'main',
  'feat/auth-rs256',
  'chore/pgbouncer',
  'fix/cache-private',
  'feat/edge-pdf',
]

export function NewThreadDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const navigate = useNavigate()
  const [repo, setRepo] = useState(repos[0].name)
  const [branch, setBranch] = useState(branches[1])
  const [issue, setIssue] = useState('')

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>New Change Thread</DialogTitle>
          <DialogDescription>
            Pick a repository and head branch. Base branch is auto-resolved from the
            default branch.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Repository
            </label>
            <select
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              className="h-9 w-full rounded-md border border-hairline bg-background px-3 text-sm outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40"
            >
              {repos.map((r) => (
                <option key={r.name} value={r.name}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Head branch
            </label>
            <select
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="h-9 w-full rounded-md border border-hairline bg-background px-3 text-sm outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40"
            >
              {branches.map((b) => (
                <option key={b} value={b}>
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
              Linked issue <span className="normal-case text-muted-foreground/60">(optional)</span>
            </label>
            <input
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              placeholder="INFRA-922"
              className="h-9 w-full rounded-md border border-hairline bg-background px-3 font-mono text-sm outline-none placeholder:text-muted-foreground focus:border-primary/40 focus:ring-1 focus:ring-primary/40"
            />
          </div>
        </div>

        <DialogFooter>
          <button
            onClick={() => onOpenChange(false)}
            className="rounded-md border border-hairline bg-surface px-3 py-1.5 text-xs font-medium hover:bg-surface-2"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              onOpenChange(false)
              toast.success('Change thread created', {
                description: `${repo} · ${branch}`,
              })
              navigate({ to: '/threads/$id', params: { id: 't1' } })
            }}
            className="rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
          >
            Create thread
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
