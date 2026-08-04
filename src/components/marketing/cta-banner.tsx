import { useState } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Reveal } from '@/components/marketing/primitives'

/** Full-bleed gradient CTA card — final conversion push with newsletter capture merged in. */
export function CtaBanner() {
  const [email, setEmail] = useState('')

  return (
    <Reveal className="mx-auto max-w-6xl">
      <div className="relative isolate overflow-hidden rounded-2xl border border-hairline">
        <div
          aria-hidden
          className="absolute inset-0 -z-20"
          style={{
            background:
              'linear-gradient(135deg, color-mix(in oklab, var(--primary) 85%, transparent), color-mix(in oklab, var(--neutral-accent) 80%, transparent) 55%, color-mix(in oklab, var(--info) 70%, transparent))',
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

        <div className="relative grid gap-10 px-6 py-16 sm:py-24 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:items-center lg:gap-12">
          <div>
            <h2 className="text-balance text-3xl font-semibold leading-tight tracking-tight text-primary-foreground drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)] md:text-4xl">
              Start shipping evidence-backed change briefs.
            </h2>
            <div className="mt-6 flex flex-wrap items-center gap-3">
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

          <div>
            <div className="rounded-xl border border-primary-foreground/15 bg-background/10 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-primary-foreground/90">
                <Mail className="size-3.5" />
                Launch updates
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (!email.trim()) return
                  toast.success("You're on the list", {
                    description: `We'll send DevBraid updates to ${email}.`,
                  })
                  setEmail('')
                }}
                className="mt-4 flex flex-col gap-2.5"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.dev"
                  aria-label="Email address"
                  className="h-11 w-full rounded-md border border-primary-foreground/20 bg-background/15 px-3.5 text-sm text-foreground outline-none transition-colors placeholder:text-primary-foreground/60 focus:border-primary-foreground/50 focus:ring-2 focus:ring-primary-foreground/20"
                />
                <button
                  type="submit"
                  className="inline-flex h-11 items-center justify-center gap-2 rounded-md bg-primary px-5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 active:scale-[0.98]"
                >
                  Sign up for updates
                  <ArrowRight className="size-3.5" />
                </button>
              </form>
              <p className="mt-3 text-xs text-primary-foreground/70">
                No card required. Unsubscribe anytime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Reveal>
  )
}
