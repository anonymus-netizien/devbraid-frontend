import { ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Reveal } from '@/components/marketing/primitives'

/** Full-bleed gradient CTA card — final conversion push. */
export function CtaBanner() {
  return (
    <Reveal className="mx-auto max-w-6xl">
      <div className="relative isolate overflow-hidden rounded-2xl border border-hairline">
        <div
          aria-hidden
          className="absolute inset-0 -z-20"
          style={{
            background:
              'linear-gradient(135deg, color-mix(in oklab, var(--info) 70%, transparent) 0%, color-mix(in oklab, var(--neutral-accent) 55%, transparent) 55%, color-mix(in oklab, var(--info) 75%, transparent) 100%)',
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10"
          style={{
            background:
              'radial-gradient(ellipse 60% 70% at 50% 40%, color-mix(in oklab, var(--background) 35%, transparent), transparent 75%)',
          }}
        />

        <div className="relative flex flex-col items-center px-6 py-16 text-center sm:py-24">
          <h2 className="max-w-[22ch] text-balance text-3xl font-semibold leading-tight tracking-tight text-primary-foreground drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)] md:text-4xl">
            Start shipping evidence-backed change briefs.
          </h2>
          <p className="mt-4 max-w-[52ch] text-pretty text-base leading-relaxed text-primary-foreground/80">
            Every pull request ships with the reasoning behind it — cited, labelled, and ready for
            review.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth/register"
              className="group inline-flex h-11 items-center gap-2 rounded-md bg-background px-6 text-sm font-semibold text-foreground shadow-[var(--elevation-2)] transition-colors duration-150 hover:bg-foreground active:scale-[0.98]"
            >
              Get started
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex h-11 items-center rounded-md border border-primary-foreground/30 px-6 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Explore the product
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
