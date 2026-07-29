import { useScrollProgress } from '@/hooks/use-motion'
import { Reveal } from './primitives'
import { cn } from '@/lib/utils'

type Step = {
  id: string
  step: string
  title: string
  body: string
  meta: string
  icon: string
}

const steps: Step[] = [
  {
    id: 'plan',
    step: '01',
    title: 'Plan the change',
    body: 'Open a change thread the moment work starts. Scope, branch pair, and intended outcome live in one place instead of five chat threads.',
    meta: 'thread_opened',
    icon: '\uD83D\uDCCB',
  },
  {
    id: 'build',
    step: '02',
    title: 'Write the code',
    body: 'DevBraid watches the branch and collects commits, touched files, and diff stats as evidence — no extra tooling in your editor.',
    meta: 'commits_indexed',
    icon: '\uD83D\uDCBB',
  },
  {
    id: 'debug',
    step: '03',
    title: 'Hit the wall',
    body: 'The dead ends, the failed approach, the flaky test — the context reviewers never see is captured while it\'s fresh.',
    meta: 'risk_flagged',
    icon: '\uD83D\uDC1B',
  },
  {
    id: 'decide',
    step: '04',
    title: 'Capture the reasoning',
    body: 'One decision note: what you chose, what you rejected, and why. Thirty seconds now saves a reviewer twenty minutes later.',
    meta: 'note_saved',
    icon: '\uD83D\uDCA1',
  },
  {
    id: 'ship',
    step: '05',
    title: 'Publish the brief',
    body: 'Evidence and reasoning are braided into a Change Brief. Every claim is cited to a commit or a file — inferences are labelled as inferences.',
    meta: 'brief_published',
    icon: '\uD83D\uDCC4',
  },
  {
    id: 'merge',
    step: '06',
    title: 'Ship with confidence',
    body: 'Reviewers approve on evidence instead of archaeology. Review cycles shorten, and the reasoning outlives the pull request.',
    meta: 'merged',
    icon: '\uD83D\uDE80',
  },
]

export function LifecycleFlow() {
  const { ref, progress } = useScrollProgress<HTMLDivElement>()
  const railHeight = Math.min(100, Math.max(0, (progress - 0.12) / 0.68) * 100)
  const activeIndex = Math.min(
    steps.length - 1,
    Math.floor((railHeight / 100) * steps.length),
  )

  return (
    <div ref={ref} className="relative">
      {/* Rail */}
      <div
        aria-hidden
        className="absolute left-4 top-0 hidden h-full w-px bg-hairline md:block lg:left-1/2"
      >
        <div
          className="w-px bg-gradient-to-b from-primary/10 via-primary to-primary/10 transition-[height] duration-200 ease-out"
          style={{ height: `${railHeight}%` }}
        />
      </div>

      <ol className="space-y-14 md:space-y-16">
        {steps.map((s, i) => (
          <li key={s.id} className="relative">
            <div
              className={cn(
                'grid items-center gap-8 md:grid-cols-2 md:gap-12',
                i % 2 === 1 && 'md:[&>*:first-child]:order-2',
              )}
            >
              <Reveal delay={60}>
                <div className="relative">
                  <div
                    aria-hidden
                    className={cn(
                      'pointer-events-none absolute inset-[16%] -z-10 rounded-full blur-3xl transition-opacity duration-700',
                      i <= activeIndex
                        ? 'bg-primary/20 opacity-100'
                        : 'bg-primary/10 opacity-40',
                    )}
                  />
                  <div className="mx-auto flex w-full max-w-[180px] items-center justify-center text-7xl sm:max-w-[220px] sm:text-8xl">
                    {s.icon}
                  </div>
                </div>
              </Reveal>

              <Reveal delay={140}>
                <div className="measure">
                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        'grid size-7 place-items-center rounded-full border font-mono text-[10px] transition-colors duration-500',
                        i <= activeIndex
                          ? 'border-primary/40 bg-primary/15 text-primary'
                          : 'border-hairline bg-surface text-muted-foreground',
                      )}
                    >
                      {s.step}
                    </span>
                    <span className="rounded border border-hairline bg-surface px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
                      {s.meta}
                    </span>
                  </div>
                  <h3 className="mt-4 text-xl font-semibold tracking-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {s.body}
                  </p>
                </div>
              </Reveal>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}
