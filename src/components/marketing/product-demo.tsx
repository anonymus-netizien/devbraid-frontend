/* Hallmark · component: product-demo · genre: modern-minimal · theme: custom (amber-on-near-black)
 * scene: cited change brief mockup — sentence, commit citation, inference tag, risk chips, diff stat
 * states: none (static illustration)
 * contrast: pass (amber on near-black; borderline tokens at small size — mono labels muted)
 */

import { CheckCircle2, GitCommit, ShieldAlert, Sparkles } from 'lucide-react'
import { GlowPlate, Reveal } from '@/components/marketing/primitives'

/**
 * Product demo — a cited change brief shown as an editorial card, not a
 * re-drawn browser frame. Mirrors the shapes used in change threads so the
 * mock matches the real product.
 */
export function ProductDemo() {
  return (
    <Reveal delay={120} className="w-full">
      <GlowPlate className="mx-auto max-w-[560px]">
        <div className="rounded-2xl border border-hairline bg-surface/70 shadow-[var(--elevation-3)] backdrop-blur-sm">
          {/* Card chrome — header row only, no fake browser frame */}
          <div className="flex items-center justify-between border-b border-hairline px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-primary">
              change brief{'\u00a0'}·{'\u00a0'}cited
            </p>
            <div className="flex items-center gap-1.5">
              <span className="inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-primary">
                <Sparkles className="size-2.5" />
                Inference
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-danger-bg bg-danger-bg/40 px-2 py-0.5 text-[9px] font-semibold uppercase tracking-wider text-danger-fg">
                <ShieldAlert className="size-2.5" />
                Risk
              </span>
            </div>
          </div>

          <div className="space-y-4 p-4 sm:p-5">
            {/* Title */}
            <h3 className="text-balance text-sm font-medium leading-snug text-foreground">
              Session tokens now rotate on refresh
            </h3>

            {/* Cited sentence — the persuasive core */}
            <p className="text-pretty text-[13px] leading-relaxed text-muted-foreground">
              Which invalidates any client caching the old token
              <span className="mx-1 inline-flex items-baseline gap-1 rounded border border-hairline bg-surface px-1.5 py-0.5 align-middle font-mono text-[10px] leading-none text-muted-foreground">
                <span className="text-primary/80">c:</span>
                <span className="text-foreground/90">a91f4c2</span>
              </span>
              and forces a single re-auth on the next request.
            </p>

            {/* Risk chips — bounded inline row */}
            <div className="flex flex-wrap gap-1.5">
              {['auth surface', 'public API', 'migration'].map((flag) => (
                <span
                  key={flag}
                  className="inline-flex items-center gap-1 rounded border border-danger-border bg-danger-bg/40 px-2 py-0.5 text-[10px] text-danger-fg"
                >
                  <ShieldAlert className="size-2.5" />
                  {flag}
                </span>
              ))}
            </div>

            {/* Evidence footer — live data, no invented metrics */}
            <div className="flex items-center gap-4 border-t border-hairline pt-3 font-mono text-[10px] tabular-nums text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <GitCommit className="size-3 text-primary/80" />4 commits
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="text-success-fg">+128</span>
                <span className="text-danger-fg">−47</span>
              </span>
              <span className="ml-auto inline-flex items-center gap-1 text-info-fg">
                <CheckCircle2 className="size-3" />2 questions answered
              </span>
            </div>
          </div>
        </div>
      </GlowPlate>
    </Reveal>
  )
}
