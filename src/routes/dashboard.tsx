import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHeader } from '../components/devbraid/states'
import { BranchPair, RiskChip, SectionLabel, StatusDot } from '../components/devbraid/chips'
import { threads, briefs, connections } from '../lib/mock/data'

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
})

function Stat({
  label,
  value,
  hint,
}: {
  label: string
  value: string
  hint: string
}) {
  return (
    <div className="rounded-lg border border-hairline bg-surface/40 p-5">
      <SectionLabel>{label}</SectionLabel>
      <div className="mt-3 font-mono text-3xl font-medium tracking-tight tabular-nums">
        {value}
      </div>
      <p className="mt-2 text-xs text-muted-foreground">{hint}</p>
    </div>
  )
}

function DashboardPage() {
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'
  const active = threads.filter((t) => t.status !== 'published')
  const publishedCount = briefs.filter((b) => b.status === 'published').length
  const activeConn = connections.filter((c) => c.status === 'active').length

  return (
    <div className="mx-auto max-w-6xl px-8 py-10">
      <PageHeader
        eyebrow="Workspace"
        title={`${greeting}, Alex.`}
        description={`${active.length} change thread${active.length !== 1 ? 's' : ''} in flight.`}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Stat
          label="Active threads"
          value={String(active.length)}
          hint={`${threads.length} total · ${threads.filter((t) => t.status === 'ready').length} ready to publish`}
        />
        <Stat
          label="Published briefs"
          value={String(publishedCount)}
          hint="Posted to GitHub as PR comments"
        />
        <Stat
          label="Connections"
          value={`${activeConn}/${connections.length}`}
          hint={
            connections.some((c) => c.status !== 'active')
              ? 'One PAT is expired — reconnect from Connections'
              : 'All GitHub PATs healthy'
          }
        />
      </div>

      <section className="mt-10">
        <div className="mb-4 flex items-end justify-between">
          <SectionLabel>Recent change threads</SectionLabel>
          <Link
            to="/threads"
            className="text-xs text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="overflow-hidden rounded-lg border border-hairline">
          <table className="w-full text-left text-sm">
            <thead className="bg-surface/40 text-[11px] uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="px-4 py-2.5 font-medium">Thread</th>
                <th className="px-4 py-2.5 font-medium">Branch</th>
                <th className="px-4 py-2.5 font-medium">Risk</th>
                <th className="px-4 py-2.5 font-medium">Status</th>
                <th className="px-4 py-2.5 font-medium text-right">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {threads.map((t) => (
                <tr key={t.id} className="hover:bg-surface/40">
                  <td className="px-4 py-3">
                    <Link
                      to="/threads/$id"
                      params={{ id: t.id }}
                      className="flex flex-col gap-0.5"
                    >
                      <span className="truncate text-[13px] font-medium hover:underline">
                        {t.title}
                      </span>
                      <span className="font-mono text-[11px] text-muted-foreground">
                        {t.repo}
                      </span>
                    </Link>
                  </td>
                  <td className="px-4 py-3">
                    <BranchPair base={t.baseBranch} head={t.headBranch} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {t.risks.slice(0, 3).map((r) => (
                        <RiskChip key={r} flag={r} dense />
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
                      <StatusDot status={t.status} />
                      {t.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[11px] text-muted-foreground">
                    {new Date(t.updatedAt).toLocaleDateString(undefined, {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="mt-10">
        <SectionLabel>Unresolved questions</SectionLabel>
        <div className="mt-3 space-y-2">
          {briefs
            .flatMap((b) =>
              b.unresolved.map((q) => ({ q, brief: b.title, id: b.id })),
            )
            .map((u, i) => (
              <div
                key={i}
                className="flex items-start gap-3 rounded-lg border border-hairline bg-surface/40 px-4 py-3"
              >
                <div className="grid size-5 shrink-0 place-items-center rounded border border-hairline bg-background text-[10px] text-muted-foreground">
                  ?
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">{u.q}</p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    from · {u.brief}
                  </p>
                </div>
              </div>
            ))}
        </div>
      </section>
    </div>
  )
}
