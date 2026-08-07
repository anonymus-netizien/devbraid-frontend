import { createFileRoute, Link } from '@tanstack/react-router'
import { Scale, Link2, NotebookPen, Send } from 'lucide-react'
import { MarketingPage } from '@/components/marketing/marketing-page'
import { Eyebrow, GlowPlate, Reveal, SectionHeading } from '@/components/marketing/primitives'

export const Route = createFileRoute('/features')({
  head: () => ({
    meta: [
      { title: 'Features · DevBraid' },
      {
        name: 'description',
        content:
          'Deterministic risk analysis, evidence-backed citations, decision notes, and human-approved publishing.',
      },
    ],
  }),
  component: FeaturesPage,
})

const features = [
  {
    icon: Scale,
    title: 'Deterministic risk analysis',
    body: 'Rules that fire on real signals — auth changes, migration edits, public API breakage. The same input always produces the same flags, so reviewers learn to trust the output instead of re-deriving it.',
    points: ['Rule-driven, not vibes', 'Severity-ranked flags', 'Runs locally, instantly'],
  },
  {
    icon: Link2,
    title: 'Evidence-backed citations',
    body: 'Every claim in a brief carries a marker: a cited claim links to the commit or file it came from, an inference is labelled as one. Gold means verified. Violet means a guess.',
    points: [
      'Cited vs. inferred, visually distinct',
      'Click-through to source',
      'No citation, no claim',
    ],
  },
  {
    icon: NotebookPen,
    title: 'Decision notes',
    body: 'Capture the why while you work. Notes are human-written and attached to the thread they belong to — the raw material your briefs cite instead of hallucinating.',
    points: ['Attached to threads', 'Never AI-generated', 'Draft the brief you already wrote'],
  },
  {
    icon: Send,
    title: 'Human-approved publishing',
    body: 'A brief is a proposal, not a verdict. You review it, approve it, and only then does DevBraid post it to the pull request. Nothing ships without a human in the loop.',
    points: ['Approve before publish', 'One PR comment', 'Full history kept'],
  },
]

function FeaturesPage() {
  return (
    <MarketingPage>
      <section className="mx-auto max-w-6xl px-4 pb-24 pt-32 sm:px-6 sm:pt-36">
        <Reveal className="measure">
          <Eyebrow>features</Eyebrow>
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Turn a diff into evidence, not guesswork.
          </h1>
          <p className="mt-5 max-w-[62ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Four features, one job: make the reasoning behind a pull request as legible as the code
            itself.
          </p>
        </Reveal>

        <div className="mt-16 space-y-6">
          {features.map((f, i) => (
            <Reveal
              key={f.title}
              delay={i * 60}
              className="group grid gap-6 rounded-2xl border border-hairline bg-surface/40 p-6 transition-colors hover:border-primary/25 sm:p-8 lg:grid-cols-[1fr_2fr] lg:gap-12"
            >
              <div className="flex items-start gap-4">
                <GlowPlate className="shrink-0">
                  <div className="grid size-10 place-items-center rounded-lg bg-surface-2 text-primary">
                    <f.icon className="size-5" />
                  </div>
                </GlowPlate>
                <h2 className="text-xl font-semibold tracking-tight">{f.title}</h2>
              </div>
              <div>
                <p className="text-pretty text-sm leading-relaxed text-muted-foreground sm:text-base">
                  {f.body}
                </p>
                <ul className="mt-4 flex flex-wrap gap-2">
                  {f.points.map((p) => (
                    <li
                      key={p}
                      className="rounded-full border border-hairline bg-surface px-2.5 py-1 font-mono text-[11px] text-muted-foreground"
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 flex flex-col items-center gap-4 text-center">
          <SectionHeading
            align="center"
            eyebrow="read the docs"
            title="See the five-step flow end to end."
            body="Connect a repo, capture decisions, analyze risk, reason over the evidence, publish with approval."
          />
          <Link
            to="/how-it-works"
            className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
          >
            How it works
          </Link>
        </Reveal>
      </section>
    </MarketingPage>
  )
}
