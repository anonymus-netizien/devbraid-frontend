import { useState } from 'react'
import { ArrowRight, Sparkles, GitPullRequest, FileText, ShieldAlert } from 'lucide-react'
import { toast } from 'sonner'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Reveal } from '@/components/marketing/primitives'

/** Dark navy-blue launch-newsletter band with an in-phone change-brief mockup. */
export function NewsletterSection() {
  const [email, setEmail] = useState('')

  return (
    <section className="relative isolate overflow-hidden bg-background px-4 py-16 sm:px-6 sm:py-24">
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-br from-info/10 via-neutral-accent/5 to-primary/5"
      />
      <div
        aria-hidden
        className="absolute -top-40 right-0 -z-10 h-[28rem] w-[28rem] rounded-full bg-info/10 blur-3xl"
      />
      <div className="relative mx-auto grid w-full max-w-6xl grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
        <Reveal className="flex flex-col items-start">
          <h2 className="max-w-[18ch] text-balance text-3xl font-semibold leading-tight tracking-tight text-foreground md:text-4xl lg:text-[2.75rem]">
            Be the first to know when we launch
          </h2>
          <p className="mt-4 max-w-[46ch] text-pretty text-base leading-relaxed text-muted-foreground md:mt-6 md:text-lg">
            We&apos;re still building. Subscribe for updates and 20% off when we launch — one email
            per milestone, no noise.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              if (!email.trim()) return
              toast.success("You're on the list", {
                description: `We'll send DevBraid updates to ${email}.`,
              })
              setEmail('')
            }}
            className="mt-8 flex w-full max-w-md flex-col gap-3 md:mt-10 md:flex-row"
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              aria-label="Email address"
              className="h-11 border-hairline bg-surface px-3.5 text-sm text-foreground placeholder:text-muted-foreground focus-visible:border-primary/60 focus-visible:ring-primary/30 sm:h-10"
            />
            <Button
              type="submit"
              className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-6 text-sm font-semibold text-primary-foreground transition-colors duration-150 hover:bg-primary-hover active:scale-[0.98] sm:h-10"
            >
              Subscribe
              <ArrowRight className="size-3.5" />
            </Button>
          </form>

          <p className="mt-3 text-xs text-muted-foreground">
            We care about your data. Read our{' '}
            <a href="#" className="underline underline-offset-2 hover:text-foreground">
              privacy policy
            </a>
            .
          </p>
        </Reveal>

        <Reveal delay={120} className="mx-auto w-full max-w-sm lg:max-w-none">
          <div className="space-y-3">
            <div className="rounded-lg border border-hairline bg-surface p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <GitPullRequest className="size-3 text-primary" />
                  change thread
                </span>
                <span className="flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                  <Sparkles className="size-2.5" />
                  Inference
                </span>
              </div>
              <p className="mt-2.5 text-sm font-medium leading-snug text-foreground">
                Session tokens now rotate on refresh
              </p>
              <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">
                Replaced the long-lived cookie with a rotating pair&hellip;
              </p>
              <div className="mt-2.5 font-mono text-[11px] text-muted-foreground">
                <span className="text-primary">c:</span> a1b2c3d
              </div>
            </div>

            <div className="rounded-lg border border-hairline bg-surface p-4">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                  <FileText className="size-3 text-primary" />
                  decision note
                </span>
                <span className="rounded-full border border-hairline bg-background px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-muted-foreground">
                  cited
                </span>
              </div>
              <p className="mt-2.5 text-sm font-medium leading-snug text-foreground">
                Why not refresh tokens? Reuse requires a server-side store we can&apos;t audit yet.
              </p>
            </div>

            <div className="rounded-lg border border-danger-border bg-danger-bg p-4">
              <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-danger">
                <ShieldAlert className="size-3" />
                risk flag · auth
              </div>
              <p className="mt-1.5 text-[13px] leading-snug text-foreground/90">
                Token issuance path touched &mdash; verify rotation invalidation.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
