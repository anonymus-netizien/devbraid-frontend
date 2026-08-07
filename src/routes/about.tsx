import { createFileRoute, Link } from '@tanstack/react-router'
import { Braces } from 'lucide-react'
import { MarketingPage } from '@/components/marketing/marketing-page'
import { Eyebrow, Reveal } from '@/components/marketing/primitives'

export const Route = createFileRoute('/about')({
  head: () => ({
    meta: [
      { title: 'About · DevBraid' },
      {
        name: 'description',
        content:
          'DevBraid turns pull requests into evidence-backed engineering briefs — built for reviewers, by reviewers.',
      },
    ],
  }),
  component: AboutPage,
})

function AboutPage() {
  return (
    <MarketingPage>
      <section className="mx-auto max-w-3xl px-4 pb-24 pt-32 sm:px-6 sm:pt-36">
        <Reveal className="measure">
          <Eyebrow>about</Eyebrow>
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            A reviewer&apos;s tool, not an AI wrapper.
          </h1>
          <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            DevBraid started with a simple frustration: pull requests ship with the code, but never
            with the reasoning behind it. Reviewers spend hours re-deriving decisions that were
            already made — often for good, recorded reasons.
          </p>
        </Reveal>

        <div className="mt-14 space-y-10">
          <Reveal>
            <h2 className="text-xl font-semibold tracking-tight">The problem</h2>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              A diff shows what changed. It never shows why. The why lives in commit messages, Slack
              threads, and conversations that evaporate the moment they end — so the next reviewer
              starts from zero.
            </p>
          </Reveal>
          <Reveal>
            <h2 className="text-xl font-semibold tracking-tight">The approach</h2>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              Braid the two strands: the code evidence (commits, files, diffs) and the human
              reasoning (decision notes captured while you work). Then present the braid as a change
              brief where every claim cites its source, and every guess is labelled as one.
            </p>
          </Reveal>
          <Reveal>
            <h2 className="text-xl font-semibold tracking-tight">The line we draw</h2>
            <p className="mt-3 text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
              The AI drafts; the human decides. Risk flags are deterministic rules. Evidence is
              cited, not invented. And publishing always waits for a human approval. DevBraid never
              claims to know what you were thinking — it asks you to write it down.
            </p>
          </Reveal>
        </div>

        <Reveal className="mt-16 flex flex-col items-center gap-3 rounded-2xl border border-hairline bg-surface/40 p-8 text-center">
          <span className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Braces className="size-5" />
          </span>
          <p className="mt-2 text-pretty text-base text-muted-foreground">
            Try it on your own repository —
          </p>
          <Link
            to="/auth/register"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            Start free
          </Link>
        </Reveal>
      </section>
    </MarketingPage>
  )
}
