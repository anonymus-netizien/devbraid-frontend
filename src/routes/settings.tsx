import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '../components/devbraid/page-header'
import { mockUser } from '../lib/mock/data'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  return (
    <div>
      <PageHeader eyebrow="Platform" title="Settings" />
      <div className="space-y-8 max-w-2xl">
        {/* Profile */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-4">Profile</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm text-muted-foreground mb-1.5">Display name</label>
              <input id="displayName" type="text" defaultValue={mockUser.name} className="w-full px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label htmlFor="settings-email" className="block text-sm text-muted-foreground mb-1.5">Email</label>
              <input id="settings-email" type="email" defaultValue={mockUser.email} className="w-full px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>
        </section>
        {/* Appearance */}
        <section>
          <h2 className="text-sm font-medium text-foreground mb-4">Appearance</h2>
          <div className="flex items-center justify-between p-4 rounded-xl border border-hairline bg-surface">
            <div>
              <p className="text-sm text-foreground">Dark mode</p>
              <p className="text-xs text-muted-foreground">Currently active</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs bg-success-bg text-success-fg">Active</span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl border border-hairline bg-surface mt-2 opacity-50">
            <div>
              <p className="text-sm text-foreground">Light mode</p>
              <p className="text-xs text-muted-foreground">Coming soon</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs bg-surface-2 text-muted-foreground">Soon</span>
          </div>
        </section>
        {/* Danger zone */}
        <section>
          <h2 className="text-sm font-medium text-danger-fg mb-4">Danger zone</h2>
          <div className="rounded-xl border border-danger-border bg-danger-bg p-5">
            <p className="text-sm text-foreground mb-2">Delete workspace</p>
            <p className="text-xs text-danger-fg mb-4">This will permanently delete all your threads, notes, and briefs. This action cannot be undone.</p>
            <button className="px-4 py-2 rounded-lg bg-danger-fg text-background text-sm font-medium hover:opacity-90 transition-opacity">Delete workspace</button>
          </div>
        </section>
      </div>
    </div>
  )
}
