import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  BookOpen,
  Command,
  FileText,
  GitPullRequest,
  Github,
  Quote,
  ShieldAlert,
  Sparkles,
  Zap,
} from 'lucide-react'
import { useSmoothScroll } from '@/hooks/use-motion'
import {
  Eyebrow,
  GlowPlate,
  Reveal,
  SectionHeading,
} from '@/components/marketing/primitives'
import { SiteFooter, SiteHeader } from '@/components/marketing/site-chrome'
import { LifecycleFlow } from '@/components/marketing/lifecycle-flow'
import { CtaBanner, NewsletterRow } from '@/components/marketing/cta-banner'
import { IsometricHero } from '@/components/marketing/isometric-hero'

export const Route = createFileRoute('/')({
  head: () => ({
    meta: [
      { title: 'DevBraid — Evidence-backed change briefs for every PR' },
      {
        name: 'description',
        content:
          'DevBraid braids your GitHub commits with the reasoning behind them into cited change briefs, so reviewers approve on evidence instead of archaeology.',
      },
      {
        property: 'og:title',
        content: 'DevBraid — Evidence-backed change briefs for every PR',
      },
      {
        property: 'og:description',
        content:
          'Capture decision notes as you code. Publish a cited change brief reviewers can trust.',
      },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
    ],
  }),
  component: HomePage,
})

const features = [
  {
    icon: GitPullRequest,
    title: 'Change threads',
    body: 'A living workspace per branch: commits, touched files, diff stats, and open questions in one dense timeline.',
  },
  {
    icon: FileText,
    title: 'Decision notes',
    body: 'Capture what you chose and what you rejected in seconds. Notes attach to the thread and outlive the PR.',
  },
  {
    icon: Sparkles,
    title: 'Cited change briefs',
    body: 'Every sentence carries a citation to a commit or file. Anything the model infers is labelled Inference.',
  },
  {
    icon: ShieldAlert,
    title: 'Risk flags',
    body: 'Auth, migrations, public API, dependency, and CI surfaces are flagged automatically before review starts.',
  },
  {
    icon: Github,
    title: 'GitHub connections',
    body: 'Grant access per repository. Scoped, revocable, and auditable — no blanket organisation install.',
  },
  {
    icon: Command,
    title: 'Keyboard first',
    body: '\u2318K opens everything. Threads, briefs, repos, and actions are reachable without touching the mouse.',
  },
]

const metrics = [
  { value: '68%', label: 'less review back-and-forth' },
  { value: '9 min', label: 'median time to first approval' },
  { value: '100%', label: 'claims cited to evidence' },
]

function HomePage() {
  useSmoothScroll()

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />

      <main>
        {/* Hero */}
        <section className="relative isolate overflow-hidden px-4 pb-16 pt-28 sm:px-6 sm:pb-24 sm:pt-36">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 -z-10 h-[520px] bg-[radial-gradient(ellipse_50%_50%_at_50%_50%,var(--primary),transparent)] opacity-[0.10]"
          />
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <Reveal>
              <div className="measure">
                <Link
                  to="/briefs"
                  className="mb-6 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/70 py-1 pl-1.5 pr-3 text-[11px] text-muted-foreground backdrop-blur transition-colors hover:border-primary/30 hover:text-foreground"
                >
                  <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
                    new
                  </span>
                  Cited change briefs are live
                  <ArrowRight className="size-3" />
                </Link>
                <Eyebrow>evidence over archaeology</Eyebrow>
                <h1 className="mt-4 text-balance text-4xl font-semibold leading-[1.05] tracking-tight sm:text-5xl">
                  Every pull request ships with the reasoning behind it.
                </h1>
                <p className="mt-5 text-pretty text-base leading-relaxed text-muted-foreground">
                  DevBraid watches your branch, collects the commits, and
                  braids them with the decision notes you capture while you
                  work. The result is a change brief where every claim is cited
                  — and every guess is labelled.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-3">
                  <Link to="/auth/register">
                    <span className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-[0.98]">
                      Start free
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                    </span>
                  </Link>
                  <Link to="/dashboard">
                    <span className="inline-flex h-11 items-center rounded-md border border-hairline bg-surface/60 px-5 text-sm font-medium text-foreground transition-colors hover:bg-surface">
                      Explore the product
                    </span>
                  </Link>
                </div>
                <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <span>no card required</span>
                  <span className="hidden sm:inline">·</span>
                  <span>per-repo access</span>
                  <span className="hidden sm:inline">·</span>
                  <span>dark mode first</span>
                </div>
              </div>
            </Reveal>

            <Reveal delay={120}>
              <IsometricHero className="w-full max-w-[420px] mx-auto" />
            </Reveal>
          </div>

          {/* Metric strip */}
          <Reveal delay={200} className="mx-auto mt-16 max-w-6xl">
            <dl className="grid grid-cols-1 divide-y divide-hairline rounded-xl border border-hairline bg-surface/40 backdrop-blur sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {metrics.map((m) => (
                <div key={m.label} className="px-6 py-5">
                  <dt className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    {m.label}
                  </dt>
                  <dd className="mt-1.5 text-2xl font-semibold tracking-tight text-foreground">
                    {m.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <Reveal delay={260} className="mx-auto mt-10 max-w-6xl">
            <div className="flex items-center gap-3">
              <Zap className="size-3.5 shrink-0 text-primary" />
              <div className="flex-1 overflow-hidden">
                <div className="marquee flex gap-8 font-mono text-[11px] uppercase tracking-widest text-muted-foreground">
                  <span>change threads</span>
                  <span>decision notes</span>
                  <span>cited briefs</span>
                  <span>risk flags</span>
                  <span>github evidence</span>
                  <span>keyboard first</span>
                  <span>audit trail</span>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Problem */}
        <section className="border-t border-hairline px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <Reveal>
              <GlowPlate tone="danger">
                <div className="mx-auto flex h-full min-h-[280px] w-full max-w-[360px] items-center justify-center">
                  <span className="text-8xl opacity-50">{'\uD83E\uDDE0'}</span>
                </div>
              </GlowPlate>
            </Reveal>
            <div>
              <SectionHeading
                eyebrow="the problem"
                title="The diff survives. The reasoning doesn't."
                body="A reviewer opens 40 changed files and a one-line description. The two approaches you tried and abandoned, the migration ordering constraint, the reason that abstraction exists — all of it lived in your head, a Slack thread, and a call nobody recorded."
              />
              <Reveal delay={120} className="mt-6 space-y-2.5">
                {[
                  'Reviewers reconstruct intent from diffs, badly.',
                  'The same question gets asked on every PR.',
                  'Six months later, nobody remembers why.',
                ].map((line) => (
                  <div
                    key={line}
                    className="flex items-start gap-3 rounded-lg border border-danger-border bg-danger-bg px-4 py-3"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-danger" />
                    <p className="text-sm text-foreground/85">{line}</p>
                  </div>
                ))}
              </Reveal>
            </div>
          </div>
        </section>

        {/* Lifecycle flow */}
        <section
          id="flow"
          className="scroll-mt-20 border-t border-hairline px-4 py-20 sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              align="center"
              eyebrow="the full cycle"
              title="Six steps from first commit to confident merge."
              body="Scroll the loop. DevBraid sits alongside the way your team already works — it only asks for the thirty seconds of reasoning that everyone else needs later."
            />
            <div className="mt-16 sm:mt-20">
              <LifecycleFlow />
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="scroll-mt-20 border-t border-hairline px-4 py-20 sm:px-6 sm:py-28"
        >
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              eyebrow="the product"
              title="Dense, fast, and built for reviewers."
              body="Six surfaces, one keyboard-first shell. Nothing decorative, nothing that hides evidence behind a click."
            />
            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <Reveal key={f.title} delay={i * 60} className="h-full">
                  <div className="group h-full rounded-lg border border-hairline bg-surface/30 p-6 transition-all hover:border-primary/30 hover:bg-surface/60">
                    <span className="grid size-8 place-items-center rounded-md border border-hairline bg-surface text-primary transition-colors group-hover:border-primary/30 group-hover:bg-primary/10">
                      <f.icon className="size-4" />
                    </span>
                    <h3 className="mt-4 text-sm font-semibold tracking-tight">
                      {f.title}
                    </h3>
                    <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                      {f.body}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Documentation */}
        <section
          id="docs"
          className="scroll-mt-20 border-t border-hairline px-4 py-20 sm:px-6 sm:py-28"
        >
          <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
            <div>
              <SectionHeading
                eyebrow="documentation"
                title="Docs that answer 'why', not just 'what'."
                body="A change brief is readable in ninety seconds and auditable forever. Citations link straight to the commit or file that backs the sentence, and anything the model reasoned rather than observed carries an Inference tag."
              />
              <Reveal delay={120} className="mt-6 space-y-3">
                <div className="rounded-lg border border-hairline bg-surface/50 p-4">
                  <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                    brief excerpt
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                    Session tokens now rotate on refresh
                    <span className="mx-0.5 inline-flex items-baseline gap-1 rounded border border-hairline bg-surface px-1.5 py-0.5 align-middle font-mono text-[10px] leading-none text-muted-foreground">
                      <span className="text-primary/80">c:</span>
                      <span className="text-foreground/90">a91f4c2</span>
                    </span>
                    , which invalidates any client caching the old token
                    <span className="ml-1 inline-flex items-center rounded-full border border-primary/25 bg-primary/10 px-1.5 py-0.5 align-middle text-[9px] font-semibold uppercase tracking-wider text-primary">
                      Inference
                    </span>
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Rollout notes',
                    'Risk summary',
                    'Open questions',
                    'Reviewer checklist',
                  ].map((t) => (
                    <span
                      key={t}
                      className="rounded border border-hairline bg-surface px-2 py-1 text-[11px] text-muted-foreground"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <Link
                  to="/briefs"
                  className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline"
                >
                  <BookOpen className="size-4" />
                  Read a full change brief
                </Link>
              </Reveal>
            </div>
            <Reveal delay={80}>
              <GlowPlate>
                <div className="mx-auto flex aspect-square w-full max-w-[340px] items-center justify-center">
                  <span className="text-8xl opacity-50">{'\uD83D\uDCD6'}</span>
                </div>
              </GlowPlate>
            </Reveal>
          </div>
        </section>

        {/* Quote */}
        <section className="border-t border-hairline px-4 py-20 sm:px-6 sm:py-24">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Quote className="mx-auto size-5 text-primary" />
            <blockquote className="mt-5 text-balance text-lg font-medium leading-relaxed tracking-tight sm:text-xl">
              &ldquo;Our reviewers stopped asking &apos;why is this
              here?&apos; — the brief already answered it, with a commit hash
              attached.&rdquo;
            </blockquote>
            <div className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              staff engineer · platform team
            </div>
          </Reveal>
        </section>

        {/* CTA banner + newsletter */}
        <section className="border-t border-hairline px-4 py-20 sm:px-6 sm:py-28">
          <CtaBanner />
          <NewsletterRow />
        </section>
      </main>

      <SiteFooter />
    </div>
  )
}
