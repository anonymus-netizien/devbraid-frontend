import { createFileRoute } from '@tanstack/react-router'
import { RefreshCw } from 'lucide-react'
import { PageHeader } from '@/components/devbraid/states'
import { useBriefQuery } from '@/hooks/queries'

export const Route = createFileRoute('/briefs/$id')({
  component: BriefDetailPage,
})

function BriefDetailPage() {
  const { id } = Route.useParams()
  const { data: brief, isLoading } = useBriefQuery(id)

  if (isLoading) {
    return (
      <div className="py-20 text-center space-y-4">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-sm text-muted-foreground">Loading Brief...</p>
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
      <div className="rounded-xl border border-hairline bg-surface p-6">
        <div className="prose prose-invert max-w-none text-sm text-foreground whitespace-pre-wrap font-mono bg-surface-2 p-6 rounded-lg border border-hairline break-words [overflow-wrap:anywhere]">
          {brief.content}
        </div>
      </div>
    </div>
  )
}
