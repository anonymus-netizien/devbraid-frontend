import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHeader } from '../components/devbraid/states'
import { SectionLabel } from '../components/devbraid/chips'
import { decisionNotes, threads } from '../lib/mock/data'

export const Route = createFileRoute('/notes')({
  component: NotesPage,
})

function NotesPage() {
  const grouped = threads
    .map((t) => ({
      thread: t,
      notes: decisionNotes.filter((n) => n.threadId === t.id),
    }))
    .filter((g) => g.notes.length > 0)

  return (
    <div className="mx-auto max-w-4xl px-8 py-10">
      <PageHeader
        eyebrow="Workspace"
        title="Decision Notes"
        description="Short, developer-attributed notes captured while working — always human, never AI-generated."
      />

      <div className="space-y-10">
        {grouped.map(({ thread, notes }) => (
          <section key={thread.id} className="space-y-4">
            <div className="flex items-baseline justify-between">
              <SectionLabel>{thread.repo}</SectionLabel>
              <Link
                to="/threads/$id"
                params={{ id: thread.id }}
                className="text-xs text-primary hover:underline"
              >
                {thread.title}
              </Link>
            </div>

            <div className="space-y-3">
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="rounded-lg border border-hairline bg-surface/40 p-5"
                >
                  <div className="mb-2 flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="font-mono">
                      {new Date(n.createdAt).toLocaleString()}
                    </span>
                    <span>·</span>
                    <span>alex.vane</span>
                  </div>
                  <h3 className="text-sm font-semibold">{n.decision}</h3>
                  <div className="mt-3 grid grid-cols-[110px_1fr] gap-x-6 gap-y-2 text-[13px] text-foreground/80">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground pt-0.5">
                      Rationale
                    </div>
                    <div className="leading-relaxed">{n.rationale}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground pt-0.5">
                      Alternatives
                    </div>
                    <div className="italic">{n.alternatives}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground pt-0.5">
                      Impact
                    </div>
                    <div>{n.impact}</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}

        {grouped.length === 0 && (
          <div className="rounded-lg border border-dashed border-hairline bg-surface/20 px-6 py-12 text-center text-xs text-muted-foreground">
            No decision notes yet.
          </div>
        )}
      </div>
    </div>
  )
}
