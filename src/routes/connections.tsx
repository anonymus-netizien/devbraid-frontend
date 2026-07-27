import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Github } from 'lucide-react'
import { PageHeader } from '../components/devbraid/states'
import { SectionLabel, StatusDot } from '../components/devbraid/chips'
import { EmptyState } from '../components/devbraid/states'
import { connections } from '../lib/mock/data'
import { AddConnectionSheet } from '../components/devbraid/add-connection-sheet'

export const Route = createFileRoute('/connections')({
  component: ConnectionsPage,
})

function ConnectionsPage() {
  const [open, setOpen] = useState(false)
  const [list, setList] = useState(connections)

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <PageHeader
        eyebrow="Platform"
        title="GitHub Connections"
        description="Connections stay encrypted at rest and are only used for the calls DevBraid needs — reading commits, changed files, and posting a single PR comment."
        actions={
          <button
            onClick={() => setOpen(true)}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add connection
          </button>
        }
      />

      <div className="space-y-3">
        {list.map((c) => (
          <div
            key={c.id}
            className="rounded-lg border border-hairline bg-surface/40 p-5"
          >
            <div className="flex items-start justify-between gap-6">
              <div className="min-w-0 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="grid size-8 place-items-center rounded-full border border-hairline bg-background">
                    <Github className="size-4" aria-hidden="true" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold">{c.githubUsername}</span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] capitalize text-muted-foreground">
                        <StatusDot status={c.status || 'active'} />
                        {c.status || 'active'}
                      </span>
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      added {new Date(c.addedAt || c.connectedAt).toLocaleDateString()} · last used{' '}
                      {new Date(c.lastUsedAt || c.lastValidatedAt || c.connectedAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 text-[11px]">
                  <div>
                    <SectionLabel>Scopes</SectionLabel>
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      {c.scopes.map((s) => (
                        <span
                          key={s}
                          className="rounded border border-hairline bg-background px-1.5 py-0.5 font-mono text-[10px] text-foreground/80"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  {c.repos !== undefined && (
                    <div className="pl-6">
                      <SectionLabel>Repositories</SectionLabel>
                      <div className="mt-1.5 font-mono text-[11px] tabular-nums">
                        {c.repos}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-2">
                <button
                  onClick={() => toast('Token validated')}
                  className="rounded-md border border-hairline bg-surface px-3 py-1.5 text-[11px] font-medium hover:bg-surface-2"
                >
                  Validate
                </button>
                <button
                  onClick={() => {
                    setList((l) => l.filter((x) => x.id !== c.id))
                    toast.success('Connection removed')
                  }}
                  className="rounded-md border border-danger-border bg-danger-bg px-3 py-1.5 text-[11px] font-medium text-danger hover:bg-danger/15"
                >
                  Disconnect
                </button>
              </div>
            </div>
          </div>
        ))}

        {list.length === 0 && (
          <EmptyState
            icon={<Github className="h-12 w-12" aria-hidden="true" />}
            title="No connections"
            description="Add a Personal Access Token to start creating Change Threads."
            action={
              <button
                onClick={() => setOpen(true)}
                className="mt-4 inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Add connection
              </button>
            }
          />
        )}
      </div>

      <div className="mt-8 rounded-lg border border-hairline bg-surface/20 p-5 text-xs text-muted-foreground">
        <p className="mb-1 font-semibold text-foreground">A note on scopes</p>
        <p className="leading-relaxed">
          DevBraid never asks for <code className="font-mono">admin:*</code> or{' '}
          <code className="font-mono">delete_repo</code>. The <code className="font-mono">repo</code> scope is required to read commits and post one PR comment. See{' '}
          <Link to="/settings" className="text-primary hover:underline">
            Settings
          </Link>{' '}
          to rotate.
        </p>
      </div>

      <AddConnectionSheet open={open} onOpenChange={setOpen} />
    </div>
  )
}
