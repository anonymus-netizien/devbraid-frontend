import { createFileRoute } from '@tanstack/react-router'
import { Plus, Github } from 'lucide-react'
import { PageHeader } from '../components/devbraid/page-header'
import { EmptyState } from '../components/devbraid/empty-state'
import { mockConnections } from '../lib/mock/data'

export const Route = createFileRoute('/connections')({
  component: ConnectionsPage,
})

function ConnectionsPage() {
  return (
    <div>
      <PageHeader
        eyebrow="Platform"
        title="GitHub Connections"
        description="Manage your GitHub PATs for repository access."
        action={
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add connection
          </button>
        }
      />
      {mockConnections.length === 0 ? (
        <EmptyState
          icon={<Github className="h-12 w-12" aria-hidden="true" />}
          title="No connections"
          description="Connect a GitHub PAT to access your repositories."
        />
      ) : (
        <div className="space-y-4">
          {mockConnections.map(conn => (
            <div key={conn.id} className="rounded-xl border border-hairline bg-surface p-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-surface-2 flex items-center justify-center text-sm font-medium" aria-hidden="true">
                    {conn.githubUsername[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{conn.githubUsername}</p>
                    <p className="text-xs text-muted-foreground">Connected {new Date(conn.connectedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {conn.scopes.map(s => (
                    <span key={s} className="px-2 py-0.5 rounded text-xs font-mono bg-surface-2 text-muted-foreground">{s}</span>
                  ))}
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button className="px-3 py-1.5 rounded-lg border border-hairline text-sm text-muted-foreground hover:text-foreground transition-colors">Validate</button>
                <button className="px-3 py-1.5 rounded-lg border border-danger-border text-sm text-danger-fg hover:bg-danger-bg transition-colors">Disconnect</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
