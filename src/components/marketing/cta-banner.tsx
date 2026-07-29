import { useState } from 'react'
import { ArrowRight, Mail } from 'lucide-react'
import { Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { Reveal } from '@/components/marketing/primitives'

/** Full-bleed gradient CTA card with the headline. */
export function CtaBanner() {
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

        <div className="relative grid place-items-center px-6 py-16 text-center sm:py-24">
          <div className="relative">
            <h2 className="text-balance text-2xl font-semibold uppercase leading-tight tracking-tight text-primary-foreground drop-shadow-[0_2px_18px_rgba(0,0,0,0.45)] sm:text-4xl">
              Start shipping
              <br />
              evidence-backed change briefs
            </h2>
            <Link
              to="/auth/register"
              className="mt-8 inline-flex h-11 items-center gap-2 rounded-full bg-background px-6 text-xs font-semibold uppercase tracking-[0.16em] text-foreground shadow-[var(--elevation-2)] transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]"
            >
              Get started
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </Reveal>
  )
}

/** Newsletter capture row — frontend only. */
export function NewsletterRow() {
  const [email, setEmail] = useState('')

  return (
    <Reveal className="mx-auto mt-20 max-w-6xl">
      <div className="grid gap-8 md:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] md:items-center">
        <div>
          <h3 className="text-xl font-semibold uppercase tracking-tight sm:text-2xl">
            Join our newsletter
          </h3>
          <p className="mt-3 max-w-[38ch] text-sm leading-relaxed text-muted-foreground">
            Get all the latest DevBraid news — new surfaces, brief formats, and
            review workflow ideas — delivered to your inbox.
          </p>
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
          className="flex flex-col gap-3 sm:flex-row"
        >
          <label className="relative flex-1">
            <span className="sr-only">Email address</span>
            <Mail className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.dev"
              className="h-12 w-full rounded-lg border border-hairline bg-surface pl-10 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <button
            type="submit"
            className="h-12 shrink-0 rounded-lg bg-foreground px-6 text-sm font-semibold text-background transition-opacity hover:opacity-90 active:scale-[0.98]"
          >
            Sign Up
          </button>
        </form>
      </div>
    </Reveal>
  )
}
