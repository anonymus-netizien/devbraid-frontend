import { Sparkles } from 'lucide-react'
import { StatusDot } from '@/components/devbraid/chips'
import { Markdown } from '@/components/devbraid/markdown'
import type { BriefResponse } from '@/types/thread'

export function ThreadBriefSection({ brief }: { brief: BriefResponse }) {
  return (
    <section className="rounded-xl bg-surface p-5 space-y-3">
      <div className="flex items-center justify-between pb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          <p className="text-xs font-mono uppercase tracking-widest text-foreground font-semibold">
            Generated Change Brief
          </p>
        </div>
        {brief.publishedToGithub ? (
          <span className="inline-flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
            <StatusDot status="published" />
            published
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
            <StatusDot status="ready" />
            ready
          </span>
        )}
      </div>
      <Markdown
        content={brief.content ?? ''}
        className="max-h-[32rem] overflow-y-auto bg-surface-2 p-4 rounded-lg"
      />
    </section>
  )
}
