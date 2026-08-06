import { createFileRoute, Link } from '@tanstack/react-router'
import { PageHeader, LoadingRows, EmptyState, ErrorPanel } from '@/components/devbraid/states'
import { useBriefsQuery } from '@/hooks/queries'
import { cn } from '@/lib/utils'
import type { BriefStatus } from '@/types/brief'

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

const statusStyles: Record<BriefStatus, { strip: string; chip: string; dot: string }> = {
  published: {
    strip: 'bg-success opacity-80',
    chip: 'text-success',
    dot: 'bg-success',
  },
  ready: {
    strip: 'bg-primary opacity-70',
    chip: 'text-primary',
    dot: 'bg-primary',
  },
  draft: {
    strip: 'bg-muted-foreground/40 opacity-50',
    chip: 'text-muted-foreground',
    dot: 'bg-muted-foreground/60',
  },
}

function BriefCard({ b }: { b: any }) {
  const status: BriefStatus = b.status === 'ready' || b.status === 'published' ? b.status : 'draft'
  const s = statusStyles[status]
  return (
    <Link
      to="/briefs/$id"
      params={{ id: b.id }}
      className="group relative block overflow-hidden rounded-xl bg-surface p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:bg-surface-2 hover:shadow-md"
    >
      <span className={cn('absolute inset-x-0 top-0 h-px', s.strip)} />
      <div className="flex items-center justify-between gap-3">
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider',
            s.chip,
          )}
        >
          <span className={cn('size-1.5 rounded-full', s.dot)} />
          {status}
        </span>
        <span className="font-mono text-[10px] text-muted-foreground">
          {b.updatedAt
            ? new Date(b.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })
            : '\u2014'}
        </span>
      </div>

      <h3 className="mt-4 line-clamp-2 text-lg font-semibold tracking-tight transition-colors group-hover:text-primary">
        {b.title || b.threadTitle || 'Untitled brief'}
      </h3>

      <p className="mt-1 font-mono text-xs text-muted-foreground">
        {b.sections?.length || 0} section{(b.sections?.length || 0) !== 1 ? 's' : ''}
        {b.repositoryFullName ? ` · ${b.repositoryFullName}` : ''}
      </p>

      <dl className="mt-4 space-y-1.5 border-t border-hairline pt-3 font-mono text-[11px]">
        <div className="flex justify-between">
          <dt className="text-muted-foreground">ID</dt>
          <dd className="text-foreground/80">{b.id}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted-foreground">THREAD</dt>
          <dd className="max-w-[60%] truncate text-primary">{b.threadId}</dd>
        </div>
      </dl>
    </Link>
  )
}

function BriefsPage() {
  const { data, isLoading, isError, refetch } = useBriefsQuery()

  const briefs = data?.content ?? []

  return (
    <div className="mx-auto w-full max-w-6xl">
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
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {briefs.map((b: any) => (
            <BriefCard key={b.id} b={b} />
          ))}
        </div>
      )}
    </div>
  )
}
