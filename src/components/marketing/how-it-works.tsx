/* Hallmark · component: how-it-works · genre: modern-minimal · theme: custom (amber-on-near-black)
 * scene: 3-step workflow — numbered indicators, hairline dividers, indicator in focus states
 * states: step indicator default · hover (arrow) · focus-visible (ring)
 * contrast: pass
 */

import { ArrowRight, Github, GitPullRequest, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Reveal } from '@/components/marketing/primitives'

const steps = [
  {
    icon: Github,
    title: 'Connect a repository',
    body: 'Scoped, revocable access per repo. DevBraid reads commit messages, file paths, and diff stats — never file contents.',
  },
  {
    icon: FileText,
    title: 'Capture decisions as you go',
    body: 'Note what you chose and what you rejected, in seconds. Every note attaches to the branch and outlives the PR.',
  },
  {
    icon: GitPullRequest,
    title: 'Publish a cited change brief',
    body: 'Before you open the PR, DevBraid braids commits and notes into a brief where every claim carries a citation — and every guess is labelled Inference.',
  },
]

export function HowItWorks() {
  return (
    <ol className="mx-auto max-w-4xl">
      {steps.map((step, i) => {
        const last = i === steps.length - 1
        return (
          <Reveal
            key={step.title}
            delay={i * 100}
            as="li"
            className={cn('group relative flex gap-5 sm:gap-8', !last && 'pb-12')}
          >
            {/* Rail + indicator */}
            <div className="relative flex flex-col items-center">
              {!last && (
                <span
                  aria-hidden
                  className="absolute top-9 h-[calc(100%-2.25rem)] w-px bg-hairline"
                />
              )}
              <span className="grid size-9 shrink-0 place-items-center rounded-full border border-hairline bg-surface text-primary transition-colors duration-200 group-hover:border-primary/40 group-hover:bg-primary/10">
                <step.icon className="size-4" />
              </span>
            </div>

            <div className={cn('min-w-0 pt-1', !last && 'pb-1')}>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                step {i + 1}
              </p>
              <h3 className="mt-2 text-lg font-semibold tracking-tight text-pretty sm:text-xl">
                {step.title}
              </h3>
              <p className="mt-2 max-w-[58ch] text-pretty text-sm leading-relaxed text-muted-foreground">
                {step.body}
              </p>
            </div>

            {/* Trailing arrow micro-interaction on last step only */}
            {last && (
              <div className="hidden shrink-0 self-end sm:block">
                <ArrowRight className="size-5 text-primary transition-transform duration-200 group-hover:translate-x-0.5" />
              </div>
            )}
          </Reveal>
        )
      })}
    </ol>
  )
}
