import { createFileRoute, Link } from '@tanstack/react-router'
import { GitBranch, Camera, Gauge, Brain, Send } from 'lucide-react'
import { MarketingPage } from '@/components/marketing/marketing-page'
import { Eyebrow, Reveal } from '@/components/marketing/primitives'

export const Route = createFileRoute('/how-it-works')({
  head: () => ({
    meta: [
      { title: 'How it works · DevBraid' },
      {
        name: 'description',
        content:
          'Connect → Capture → Analyze → Reason → Publish — the five-step flow behind every DevBraid change brief.',
      },
    ],
  }),
  component: HowItWorksPage,
})

const steps = [
  {
    icon: GitBranch,
    step: '01',
    title: 'Connect',
    body: 'Link a GitHub repository with a personal access token. DevBraid reads commits and changed files — nothing else, nothing hidden.',
  },
  {
    icon: Camera,
    step: '02',
    title: 'Capture',
    body: 'Open a Change Thread for one unit of change. Drop decision notes as you work so the reasoning is recorded while it is fresh.',
  },
  {
    icon: Gauge,
    step: '03',
    title: 'Analyze',
    body: 'Deterministic risk rules scan the diff — auth paths, migrations, public API changes — and flag what reviewers should look at first.',
  },
  {
    icon: Brain,
    step: '04',
    title: 'Reason',
    body: 'DevBraid braids your notes with the evidence and drafts a change brief. Every claim cites its source; every guess is marked as inference.',
  },
  {
    icon: Send,
    step: '05',
    title: 'Publish',
    body: 'You review the brief and approve it. Only then does it post to the pull request as a single, structured comment.',
  },
]

function HowItWorksPage() {
  return (
    <MarketingPage>
      <section className="mx-auto max-w-4xl px-4 pb-24 pt-32 sm:px-6 sm:pt-36">
        <Reveal className="measure">
          <Eyebrow>how it works</Eyebrow>
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Five steps from branch to brief.
          </h1>
          <p className="mt-5 max-w-[58ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            The flow is deliberately narrow: connect, capture, analyze, reason, publish. Each step
            produces the input the next one needs.
          </p>
        </Reveal>

        <ol className="mt-16">
          {steps.map((s, i) => (
            <Reveal
              key={s.step}
              delay={i * 60}
              as="li"
              className="relative flex gap-6 border-b border-hairline py-8 last:border-b-0 sm:gap-10"
            >
              {i < steps.length - 1 && (
                <span
                  aria-hidden
                  className="absolute left-5 top-16 hidden h-[calc(100%-4rem)] w-px bg-gradient-to-b from-primary/30 to-transparent sm:block"
                />
              )}
              <div className="grid size-10 shrink-0 place-items-center rounded-lg border border-primary/25 bg-primary/10 font-mono text-xs font-semibold text-primary">
                {s.step}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <s.icon className="size-4 text-primary" />
                  <h2 className="text-lg font-semibold tracking-tight">{s.title}</h2>
                </div>
                <p className="mt-2 max-w-[56ch] text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {s.body}
                </p>
              </div>
            </Reveal>
          ))}
        </ol>

        <Reveal className="mt-16 flex flex-col items-center gap-4 text-center">
          <p className="max-w-[52ch] text-pretty text-base text-muted-foreground">
            Connect a repository and create your first change thread — the brief drafts itself as
            you work.
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
