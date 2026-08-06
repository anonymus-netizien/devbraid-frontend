import { createFileRoute, Link } from '@tanstack/react-router'
import {
  ArrowRight,
  Command,
  FileText,
  GitPullRequest,
  Github,
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

const bentoTiles = [
  {
    icon: GitPullRequest,
    title: 'Change threads',
    body: 'Commits, touched files, diff stats, and open questions in one dense timeline. Nothing decorative, nothing hiding evidence behind a click.',
    code: 'git log --oneline HEAD~6',
    span: 'md:col-span-2',
  },
  {
    icon: FileText,
    title: 'Decision notes',
    body: 'Capture what you chose and what you rejected in seconds. Notes attach to the thread and outlive the PR.',
    code: 'note: drop refresh-token rotation',
    span: '',
  },
  {
    icon: Sparkles,
    title: 'Cited change briefs',
    body: 'Every sentence carries a citation to a commit or file. Anything the model infers is labelled Inference.',
    code: 'c:a91f4c2 — tokens rotate on refresh',
    span: '',
  },
  {
    icon: ShieldAlert,
    title: 'Risk flags',
    body: 'Auth, migrations, public API, dependency, and CI surfaces are flagged automatically before review starts.',
    code: '⚠ auth surface · migration',
    span: 'md:col-span-2',
  },
  {
    icon: Github,
    title: 'GitHub connections',
    body: 'Grant access per repository. Scoped, revocable, and auditable — no blanket organisation install.',
    code: 'repo: devbraid-backend · scoped',
    span: 'md:col-span-2',
  },
  {
    icon: Command,
    title: 'Keyboard first',
    body: '⌘K opens everything. Threads, briefs, repos, and actions are reachable without touching the mouse.',
    code: '⌘K → briefs',
    span: '',
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
                className="mb-8 inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/70 py-3 pl-1.5 pr-3 text-[11px] text-muted-foreground backdrop-blur transition-colors hover:border-primary/30 hover:text-foreground sm:py-1"
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
                  <span className="group relative inline-flex h-11 items-center gap-2 overflow-hidden rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98] sm:h-10">
                    Start free
                    <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-0.5" />
                  </span>
                </Link>
                <Link to="/dashboard">
                  <span className="inline-flex h-11 items-center rounded-md border border-hairline bg-surface/60 px-6 text-sm font-medium text-foreground transition-colors hover:bg-surface sm:h-10">
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
              title="One brief, every claim cited."
              body="A change brief is readable in ninety seconds and auditable forever. Citations link straight to the commit or file that backs the sentence — and anything the model reasoned rather than observed carries an Inference tag."
            />
            <div className="mt-12">
              <ProductDemo />
            </div>
          </div>
        </section>

        {/* Features — irregular bento mosaic with inline snippets */}
        <section id="features" className="scroll-mt-20 px-4 py-12 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-6xl">
            <Reveal>
              <h2 className="max-w-[22ch] text-balance text-3xl font-bold tracking-tight md:text-4xl">
                The workspace is the evidence.
              </h2>
              <p className="mt-4 max-w-[52ch] text-pretty text-base leading-relaxed text-muted-foreground">
                Six surfaces, one thread per branch. Each one keeps the proof one line away — no
                buried panels, no decorative chrome.
              </p>
            </Reveal>
            <div className="mt-10 grid gap-4 md:grid-cols-3">
              {bentoTiles.map((tile, i) => (
                <Reveal key={tile.title} delay={(i % 3) * 80} className={cn('min-w-0', tile.span)}>
                  <div className="flex h-full flex-col rounded-lg border border-hairline bg-surface/30 p-5 transition-colors duration-200 hover:border-primary/30 hover:bg-surface/60">
                    <div className="flex items-center gap-2">
                      <tile.icon className="size-4 shrink-0 text-primary" />
                      <h3 className="text-sm font-semibold tracking-tight">{tile.title}</h3>
                    </div>
                    <p className="mt-2.5 text-[13px] leading-relaxed text-muted-foreground">
                      {tile.body}
                    </p>
                    <p className="mt-4 overflow-x-auto whitespace-nowrap rounded-md border border-hairline bg-surface px-3 py-2 font-mono text-[11px] text-foreground/80">
                      {tile.code}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section id="flow" className="scroll-mt-20 px-4 py-24 sm:px-6 sm:py-32">
          <div className="mx-auto max-w-6xl">
            <SectionHeading align="center" title="From branch to brief in three steps." />
            <div className="mt-14">
              <HowItWorks />
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-3xl">
            <SectionHeading align="center" title="Frequently asked" />
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
        <section className="px-4 py-24 sm:px-6 sm:py-28">
          <CtaBanner />
        </section>

        {/* Newsletter */}
        <NewsletterSection />
      </main>

      <SiteFooter />
    </div>
  )
}
