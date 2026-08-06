import { createFileRoute } from '@tanstack/react-router'
import { PageHeader } from '@/components/devbraid/states'
import { Skeleton } from '@/components/ui/skeleton'
import { Markdown } from '@/components/devbraid/markdown'
import { useBriefQuery } from '@/hooks/queries'

export const Route = createFileRoute('/briefs/$id')({
  component: BriefDetailPage,
})

function BriefDetailPage() {
  const { id } = Route.useParams()
  const { data: brief, isLoading } = useBriefQuery(id)

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-7 w-1/3" />
        </div>
        <Skeleton className="h-96 rounded-xl" />
      </div>
    )
  }

  if (!brief) return <p className="text-muted-foreground py-8">Brief not found.</p>

  return (
    <div>
      <PageHeader
        eyebrow="Change Brief"
        title="Generated Change Brief"
        actions={
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-success-bg text-success-fg border border-success-border">
            {brief.publishedToGithub ? 'Published' : 'Ready'}
          </span>
        }
      />
      <div className="rounded-xl bg-surface p-6">
        <Markdown content={brief.content ?? ''} className="measure" />
      </div>
    </div>
  )
}
