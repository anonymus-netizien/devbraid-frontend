import { createFileRoute, Link } from '@tanstack/react-router'
import { useQuery } from '@tanstack/react-query'
import { PageHeader, LoadingRows, EmptyState, ErrorPanel } from '@/components/devbraid/states'
import { StatusDot } from '@/components/devbraid/chips'
import { threadService } from '@/services/thread.service'

export const Route = createFileRoute('/briefs')({
  head: () => ({
    meta: [
      { title: 'Change Briefs · DevBraid' },
      { name: 'description', content: 'All generated and published Change Briefs — evidence-linked summaries of your engineering work.' },
      { property: 'og:title', content: 'DevBraid · Change Briefs' },
      { property: 'og:description', content: 'Reviewer-ready briefs, every claim cited or marked inference.' },
    ],
  }),
  component: BriefsPage,
})

function BriefsPage() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ['briefs'],
    queryFn: () => threadService.listBriefs(0, 50),
  })

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
        <ErrorPanel code="E_BRIEFS" message="Couldn't load change briefs." onRetry={() => refetch()} />
      ) : briefs.length === 0 ? (
        <EmptyState
          title="No briefs yet"
          description="Generate a brief from a change thread once it has decision notes and evidence."
        />
      ) : (
        <div className="overflow-x-auto rounded-lg border border-hairline">
          <table className="w-full">
            <thead>
              <tr className="border-b border-hairline">
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Brief</th>
                <th className="hidden px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground sm:table-cell">Thread</th>
                <th className="px-4 py-3 text-left text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                <th className="px-4 py-3 text-right text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Updated</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-hairline">
              {briefs.map((b: any) => (
                <tr key={b.id} className="hover:bg-surface/50 transition-colors">
                  <td className="max-w-[340px] px-4 py-3">
                    <Link
                      to="/briefs/$id"
                      params={{ id: b.id }}
                      className="block truncate text-[13px] font-medium hover:text-primary"
                    >
                      {b.title || b.threadTitle}
                    </Link>
                    <div className="mt-0.5 font-mono text-[11px] text-muted-foreground">
                      {b.sections?.length || 0} sections
                    </div>
                  </td>
                  <td className="hidden px-4 py-3 font-mono text-[11px] text-muted-foreground sm:table-cell">
                    {b.repositoryFullName || '\u2014'}
                  </td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
                      <StatusDot status={b.status?.toLowerCase() || 'draft'} />
                      {b.status?.toLowerCase() || 'draft'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[11px] text-muted-foreground">
                    {b.updatedAt
                      ? new Date(b.updatedAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
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
