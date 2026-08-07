import { ArrowRight } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { Reveal } from '@/components/marketing/primitives'

/** Full-bleed gradient CTA card — final conversion push. */
export function CtaBanner() {
  return (
    <Reveal className="mx-auto max-w-6xl">
      <div className="relative isolate overflow-hidden rounded-2xl border border-hairline bg-surface/40">
        <div
          aria-hidden
          className="absolute inset-0 -z-20 bg-gradient-to-br from-primary/15 via-transparent to-primary/10"
        />
        <div
          aria-hidden
          className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_70%_at_50%_40%,var(--color-primary)/12%,transparent_75%)]"
        />

        <div className="relative flex flex-col items-center px-6 py-16 text-center sm:py-24">
          <h2 className="max-w-[22ch] text-balance bg-gradient-to-b from-foreground via-foreground to-foreground/60 bg-clip-text text-3xl font-semibold leading-tight tracking-tight text-transparent md:text-4xl">
            Start shipping evidence-backed change briefs.
          </h2>
          <p className="mt-4 max-w-[52ch] text-pretty text-base leading-relaxed text-muted-foreground">
            Every pull request ships with the reasoning behind it — cited, labelled, and ready for
            review.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/auth/register"
              className="group inline-flex h-11 items-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover active:scale-[0.98] sm:h-10"
            >
              Get started
              <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/dashboard"
              className="inline-flex h-11 items-center rounded-md border border-hairline bg-surface/60 px-6 text-sm font-medium text-foreground transition-colors hover:bg-surface sm:h-10"
            >
              Explore the product
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
