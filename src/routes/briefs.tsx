import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHeader, LoadingRows, EmptyState, ErrorPanel } from '@/components/devbraid/states'
import { StatusDot } from '@/components/devbraid/chips'
import { useBriefsQuery } from '@/hooks/queries'

export const Route = createFileRoute('/briefs')({
  head: () => ({
    meta: [
      { title: 'Change Briefs · DevBraid' },
      {
        name: 'description',
        content:
          'All generated and published Change Briefs — evidence-linked summaries of your engineering work.',
      },
      { property: 'og:title', content: 'DevBraid · Change Briefs' },
      {
        property: 'og:description',
        content: 'Reviewer-ready briefs, every claim cited or marked inference.',
      },
    ],
  }),
  component: BriefsPage,
})

function BriefsPage() {
  const { data, isLoading, isError, refetch } = useBriefsQuery()

  const briefs = data?.content ?? []

  return (
    <div className="mx-auto w-full max-w-5xl">
      <PageHeader
        eyebrow="Workspace"
        title="Change Briefs"
        description="Structured, evidence-linked briefs generated from your decision notes and GitHub evidence."
      />

      {isLoading ? (
        <LoadingRows rows={4} />
      ) : isError ? (
        <ErrorPanel
          code="E_BRIEFS"
          message="Couldn't load change briefs."
          onRetry={() => refetch()}
        />
      ) : briefs.length === 0 ? (
        <EmptyState
          title="No briefs yet"
          description="Generate a brief from a change thread once it has decision notes and evidence."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg">
          <table className="table">
            <thead>
              <tr>
                <th className="text-sm font-semibold text-muted-foreground">Brief</th>
                <th className="hidden sm:table-cell text-sm font-semibold text-muted-foreground">
                  Thread
                </th>
                <th className="text-sm font-semibold text-muted-foreground">Status</th>
                <th className="text-right text-sm font-semibold text-muted-foreground">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {briefs.map((b: any) => (
                <tr key={b.id} className="hover:bg-surface/50 transition-colors">
                  <td className="max-w-[340px] px-4 py-3">
                    <Link
                      to="/briefs/$id"
                      params={{ id: b.id }}
                      className="block truncate text-sm font-medium hover:text-primary"
                    >
                      {b.title || b.threadTitle}
                    </Link>
                    <div className="mt-0.5 font-mono text-sm text-muted-foreground">
                      {b.sections?.length || 0} sections
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 font-mono text-sm text-muted-foreground sm:table-cell">
                    {b.repositoryFullName || '\u2014'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-sm capitalize text-muted-foreground">
                      <StatusDot status={b.status?.toLowerCase() || 'draft'} />
                      {b.status?.toLowerCase() || 'draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-sm text-muted-foreground">
                    {b.updatedAt
                      ? new Date(b.updatedAt).toLocaleDateString(undefined, {
                          month: 'short',
                          day: 'numeric',
                        })
                      : '\u2014'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
