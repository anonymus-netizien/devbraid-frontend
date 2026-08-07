import { createFileRoute, Link } from '@tanstack/react-router'
import { Check } from 'lucide-react'
import { MarketingPage } from '@/components/marketing/marketing-page'
import { Eyebrow, Reveal } from '@/components/marketing/primitives'

export const Route = createFileRoute('/pricing')({
  head: () => ({
    meta: [
      { title: 'Pricing · DevBraid' },
      {
        name: 'description',
        content:
          'DevBraid is free while it is in development. All core features, no card required.',
      },
    ],
  }),
  component: PricingPage,
})

const included = [
  'Unlimited change threads',
  'Decision notes',
  'Deterministic risk analysis',
  'Cited change briefs',
  'One-click PR publishing',
  'GitHub connections',
]

function PricingPage() {
  return (
    <MarketingPage>
      <section className="mx-auto max-w-4xl px-4 pb-24 pt-32 sm:px-6 sm:pt-36">
        <Reveal className="measure">
          <Eyebrow>pricing</Eyebrow>
          <h1 className="mt-4 text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            One plan. Free, while we build.
          </h1>
          <p className="mt-5 max-w-[58ch] text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            DevBraid is a developer tool in development — not a commercial product yet. Every
            feature is available, no card required.
          </p>
        </Reveal>

        <Reveal className="mt-14">
          <div className="relative overflow-hidden rounded-2xl border border-primary/25 bg-surface p-8 sm:p-10">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 -top-24 h-48 bg-primary/10 blur-3xl grain-mask"
            />
            <div className="relative">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-primary">Free</p>
                  <p className="mt-3 text-5xl font-bold tracking-tight">$0</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    for as long as DevBraid is in development
                  </p>
                </div>
                <Link
                  to="/auth/register"
                  className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
                >
                  Start free
                </Link>
              </div>

              <ul className="mt-8 grid gap-2.5 sm:grid-cols-2">
                {included.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-foreground/85">
                    <Check className="size-4 shrink-0 text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal className="mt-10 text-center">
          <p className="text-sm text-muted-foreground">
            Questions about what comes after?{' '}
            <a
              href="mailto:devbraid@proton.me"
              className="text-primary underline-offset-2 hover:underline"
            >
              devbraid@proton.me
            </a>
          </p>
        </Reveal>
      </section>
    </MarketingPage>
  )
}
