import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Command,
  FileText,
  GitPullRequest,
  Github,
  Quote,
  ShieldAlert,
  Sparkles,
} from 'lucide-react'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@radix-ui/react-accordion'
import { ChevronDown } from 'lucide-react'
import { useSmoothScroll } from '@/hooks/use-motion'
import { Eyebrow, Reveal, SectionHeading } from '@/components/marketing/primitives'
import { SiteFooter, SiteHeader } from '@/components/marketing/site-chrome'
import { CtaBanner } from '@/components/marketing/cta-banner'
import { NewsletterSection } from '@/components/marketing/newsletter'
import { ProductDemo } from '@/components/marketing/product-demo'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { LiquidChrome } from '@/components/marketing/liquid-chrome'
import { cn } from '@/lib/utils'

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

const featureRows = [
  {
    eyebrow: 'the workspace',
    title: 'A living workspace per branch.',
    body: 'Commits, touched files, diff stats, and open questions — all in one dense timeline. Nothing decorative, nothing hiding evidence behind a click.',
    items: [
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
    ],
  },
  {
    eyebrow: 'the output',
    title: 'Briefs that survive review.',
    body: 'Readable in ninety seconds, auditable forever. Every sentence carries a citation to the commit or file that backs it.',
    items: [
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
    ],
  },
  {
    eyebrow: 'the fit',
    title: 'Scoped, revocable, keyboard-first.',
    body: 'Per-repository access you can audit at any time — and a shell where every surface answers to ⌘K.',
    items: [
      {
        icon: Github,
        title: 'GitHub connections',
        body: 'Grant access per repository. Scoped, revocable, and auditable — no blanket organisation install.',
      },
      {
        icon: Command,
        title: 'Keyboard first',
        body: '⌘K opens everything. Threads, briefs, repos, and actions are reachable without touching the mouse.',
      },
    ],
  },
]

const faqItems = [
  {
    q: 'Does DevBraid read my code?',
    a: 'DevBraid indexes commit messages, file paths, and diff stats — never file contents. Risk flags surface when auth, migration, or public API surfaces are touched.',
  },
  {
    q: 'How do change briefs get cited?',
    a: 'Every sentence in a brief carries a citation to a specific commit SHA or file path. Anything the model inferred rather than observed carries an explicit Inference tag.',
  },
  {
    q: 'Can I control which repositories DevBraid accesses?',
    a: 'Yes. Grant access per repository, revoke at any time. No blanket organisation install. Every access event is auditable.',
  },
  {
    q: 'What does the free tier include?',
    a: 'All core features — change threads, decision notes, cited briefs, and risk flags. No card required to start.',
  },
]

function HomePage() {
  useSmoothScroll()

  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />

      <main>
        {/* Hero — centered, full-bleed LiquidChrome */}
        <section className="relative isolate min-h-[88vh] overflow-hidden">
          <div className="absolute inset-0 -z-20">
            <LiquidChrome
              baseColor={[0.0157, 0.0196, 0.102]}
              speed={0.25}
              amplitude={0.35}
              frequencyX={2.5}
              frequencyY={1.5}
              interactive={false}
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-background to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-32 bg-gradient-to-b from-background/60 to-transparent"
          />

          <div className="relative z-10 mx-auto flex min-h-[88vh] max-w-4xl flex-col items-center justify-center px-4 pb-20 pt-32 text-center sm:px-6">
            <Reveal className="flex flex-col items-center">
              <Link
                to="/briefs"
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/70 py-1 pl-1.5 pr-3 text-[11px] text-muted-foreground backdrop-blur transition-colors hover:border-primary/30 hover:text-foreground"
              >
                <span className="rounded-full bg-primary/15 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-primary">
                  new
                </span>
                Cited change briefs are live
                <ArrowRight className="size-3" />
              </Link>

              <Eyebrow>evidence over archaeology</Eyebrow>

              <h1 className="mt-5 max-w-[16ch] text-balance bg-gradient-to-b from-foreground via-foreground to-foreground/60 bg-clip-text text-5xl font-bold leading-[1.05] tracking-tight text-transparent sm:text-6xl lg:text-7xl">
                Every pull request ships with the reasoning behind it.
              </h1>

              <p className="mt-6 max-w-[62ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
                DevBraid watches your branch, collects the commits, and braids them with the
                decision notes you capture while you work. The result is a change brief where every
                claim is cited — and every guess is labelled.
              </p>

              <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
                <Link to="/auth/register">
                  <span className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]">
                    Start free
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Link>
                <Link to="/dashboard">
                  <span className="inline-flex h-11 items-center rounded-md border border-hairline bg-surface/60 px-6 text-sm font-medium text-foreground transition-colors hover:bg-surface">
                    Explore the product
                  </span>
                </Link>
              </div>

              <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                <span>no card required</span>
                <span className="hidden sm:inline">·</span>
                <span>per-repo access</span>
                <span className="hidden sm:inline">·</span>
                <span>dark mode first</span>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Product demo — cited change brief */}
        <section id="product" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-28">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              align="center"
              eyebrow="see it in action"
              title="One brief, every claim cited."
              body="A change brief is readable in ninety seconds and auditable forever. Citations link straight to the commit or file that backs the sentence — and anything the model reasoned rather than observed carries an Inference tag."
            />
            <div className="mt-12">
              <ProductDemo />
            </div>
          </div>
        </section>

        {/* Features — alternating split rows */}
        <section id="features" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl space-y-24 sm:space-y-32">
            {featureRows.map((row, i) => {
              const flip = i % 2 === 1
              return (
                <div
                  key={row.title}
                  className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-center"
                >
                  <Reveal className={cn('min-w-0', flip && 'lg:order-2')}>
                    <Eyebrow>{row.eyebrow}</Eyebrow>
                    <h2 className="mt-3 text-balance text-3xl font-semibold tracking-tight md:text-4xl">
                      {row.title}
                    </h2>
                    <p className="mt-4 max-w-[52ch] text-pretty text-base leading-relaxed text-muted-foreground">
                      {row.body}
                    </p>
                  </Reveal>

                  <Reveal
                    delay={120}
                    className={cn('grid gap-4 sm:grid-cols-2', flip && 'lg:order-1')}
                  >
                    {row.items.map((f) => (
                      <div
                        key={f.title}
                        className="group rounded-lg border border-hairline bg-surface/30 p-5 transition-colors duration-200 hover:border-primary/30 hover:bg-surface/60"
                      >
                        <span className="grid size-8 place-items-center rounded-md border border-hairline bg-surface text-primary transition-colors duration-200 group-hover:border-primary/30 group-hover:bg-primary/10">
                          <f.icon className="size-4" />
                        </span>
                        <h3 className="mt-4 text-sm font-semibold tracking-tight">{f.title}</h3>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                          {f.body}
                        </p>
                      </div>
                    ))}
                  </Reveal>
                </div>
              )
            })}
          </div>
        </section>

        {/* How it works */}
        <section id="flow" className="scroll-mt-20 px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-6xl">
            <SectionHeading
              align="center"
              eyebrow="how it works"
              title="From branch to brief in three steps."
            />
            <div className="mt-14">
              <HowItWorks />
            </div>
          </div>
        </section>

        {/* Quote */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <Reveal className="mx-auto max-w-3xl text-center">
            <Quote className="mx-auto size-5 text-primary" />
            <blockquote className="mt-5 text-balance text-lg font-medium leading-relaxed tracking-tight sm:text-xl">
              &ldquo;Our reviewers stopped asking &apos;why is this here?&apos; — the brief already
              answered it, with a commit hash attached.&rdquo;
            </blockquote>
            <div className="mt-5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              staff engineer · platform team
            </div>
          </Reveal>
        </section>

        {/* FAQ */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <SectionHeading align="center" eyebrow="questions" title="Frequently asked" />
            <Accordion type="single" collapsible className="mt-10 space-y-3">
              {faqItems.map((item) => (
                <AccordionItem
                  key={item.q}
                  value={item.q}
                  className="rounded-lg border border-hairline bg-surface/30"
                >
                  <AccordionTrigger className="group flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-medium text-foreground transition-colors hover:text-foreground">
                    {item.q}
                    <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                  </AccordionTrigger>
                  <AccordionContent className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden data-[state=closed]:hidden">
                    <div className="border-t border-hairline px-5 py-4 text-sm leading-relaxed text-muted-foreground">
                      {item.a}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <CtaBanner />
        </section>

        {/* Newsletter */}
        <NewsletterSection />
      </main>

      <SiteFooter />
    </div>
  )
}
