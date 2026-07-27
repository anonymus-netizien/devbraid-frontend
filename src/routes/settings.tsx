import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '../components/devbraid/states'
import { SectionLabel } from '../components/devbraid/chips'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})

function Row({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-4 border-t border-hairline py-5 first:border-t-0 md:grid-cols-[240px_1fr]">
      <div>
        <div className="text-sm font-medium">{label}</div>
        {hint && <div className="mt-1 text-xs text-muted-foreground">{hint}</div>}
      </div>
      <div>{children}</div>
    </div>
  )
}

function SettingsPage() {
  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <PageHeader
        eyebrow="Platform"
        title="Settings"
        description="Configure your DevBraid workspace."
      />

      <section className="rounded-lg border border-hairline bg-surface/30 px-6 py-2">
        <Row label="Display name" hint="Shown next to your decision notes.">
          <input
            defaultValue="Alex Vane"
            className="h-9 w-full max-w-sm rounded-md border border-hairline bg-background px-3 text-sm outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40"
          />
        </Row>
        <Row label="Email" hint="Used for account recovery only.">
          <input
            defaultValue="alex@vane.dev"
            className="h-9 w-full max-w-sm rounded-md border border-hairline bg-background px-3 text-sm outline-none focus:border-primary/40 focus:ring-1 focus:ring-primary/40"
          />
        </Row>
        <Row
          label="Appearance"
          hint="DevBraid is designed dark-first. Light mode preview is coming."
        >
          <div className="flex gap-2">
            <button className="rounded-md border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary">
              Dark
            </button>
            <button
              disabled
              className="rounded-md border border-hairline bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground opacity-60"
            >
              Light · soon
            </button>
          </div>
        </Row>
        <Row label="Timezone" hint="For decision-note timestamps.">
          <select className="h-9 w-full max-w-sm rounded-md border border-hairline bg-background px-3 text-sm outline-none focus:border-primary/40">
            <option>UTC</option>
            <option>Europe/Amsterdam</option>
            <option>America/New_York</option>
            <option>Asia/Tokyo</option>
          </select>
        </Row>
      </section>

      <section className="mt-8">
        <SectionLabel>Danger zone</SectionLabel>
        <div className="mt-3 rounded-lg border border-danger-border bg-danger-bg p-5">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-sm font-semibold text-danger">Delete workspace</p>
              <p className="mt-1 text-xs text-danger">
                Removes all change threads, decision notes and briefs. Cannot be undone.
              </p>
            </div>
            <button className="shrink-0 rounded-md border border-danger-border bg-danger-bg px-3 py-1.5 text-xs font-medium text-danger hover:bg-danger/15">
              Delete
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}
