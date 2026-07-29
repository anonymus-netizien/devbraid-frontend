/* Hallmark · component: isometric-scene · genre: modern-minimal · theme: custom (amber-on-near-black)
 * scene: scattered post-its, Slack thread bubble, confused developer, vanishing notes
 * contrast: pass
 */

import { cn } from '@/lib/utils'

interface IsometricProblemProps {
  className?: string
}

/**
 * Stripe-style isometric problem illustration.
 * Shows the chaos of lost context — scattered post-its, a Slack thread,
 * and a confused developer icon.
 */
export function IsometricProblem({ className }: IsometricProblemProps) {
  const dur = (s: number) => `${s}s`

  return (
    <div
      className={cn(
        'relative isolate overflow-hidden rounded-2xl',
        className,
      )}
    >
      {/* Ambient glow - danger tone */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[10%] -z-10 rounded-full bg-danger/15 blur-3xl grain-mask"
      />

      <svg
        viewBox="0 0 400 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Illustration showing scattered notes, a Slack thread, and a confused developer"
      >
        {/* Grid plane */}
        <g opacity="0.04">
          {Array.from({ length: 10 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={50 + i * 30}
              x2={400}
              y2={50 + i * 30}
              stroke="var(--color-foreground)"
              strokeWidth="0.5"
            />
          ))}
          {Array.from({ length: 14 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={28 * i}
              y1={0}
              x2={28 * i + 100}
              y2={340}
              stroke="var(--color-foreground)"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* === SCATTERED POST-ITS === */}
        {/* Post-it 1 - top left */}
        <g
          style={{
            animation: `problem-float ${dur(5)} ease-in-out infinite`,
            transformOrigin: '60px 70px',
          }}
        >
          <rect x="40" y="55" width="44" height="36" rx="2" fill="var(--color-warning-bg)" stroke="var(--color-warning-border)" strokeWidth="0.8" opacity="0.7" />
          <text x="48" y="72" fill="var(--color-warning-fg)" fontSize="6" fontFamily="var(--font-mono)" opacity="0.7">WIP</text>
          <text x="48" y="80" fill="var(--color-warning-fg)" fontSize="5" fontFamily="var(--font-mono)" opacity="0.5">migration</text>
        </g>

        {/* Post-it 2 - floating center */}
        <g
          style={{
            animation: `problem-float ${dur(6)} ease-in-out infinite 0.3s`,
            transformOrigin: '120px 110px',
            transform: 'rotate(-8deg)',
          }}
        >
          <rect x="100" y="95" width="48" height="34" rx="2" fill="var(--color-danger-bg)" stroke="var(--color-danger-border)" strokeWidth="0.8" opacity="0.6" />
          <text x="108" y="112" fill="var(--color-danger-fg)" fontSize="6" fontFamily="var(--font-mono)" opacity="0.6">DON'T</text>
          <text x="108" y="120" fill="var(--color-danger-fg)" fontSize="5" fontFamily="var(--font-mono)" opacity="0.5">MERGE</text>
        </g>

        {/* Post-it 3 - right side */}
        <g
          style={{
            animation: `problem-float ${dur(7)} ease-in-out infinite 0.6s`,
            transformOrigin: '300px 80px',
            transform: 'rotate(5deg)',
          }}
        >
          <rect x="280" y="65" width="52" height="38" rx="2" fill="var(--color-info-bg)" stroke="var(--color-info-border)" strokeWidth="0.8" opacity="0.5" />
          <text x="288" y="82" fill="var(--color-info-fg)" fontSize="6" fontFamily="var(--font-mono)" opacity="0.5">API v2</text>
          <text x="288" y="90" fill="var(--color-info-fg)" fontSize="5" fontFamily="var(--font-mono)" opacity="0.4">breaking</text>
        </g>

        {/* === SLACK/CONVERSATION THREAD BUBBLE (center) === */}
        <g
          style={{
            animation: `problem-slack ${dur(4)} ease-in-out infinite`,
          }}
        >
          {/* Bubble body */}
          <path
            d="M160 120 L200 100 L240 120 L240 168 Q240 178 230 178 L170 178 Q160 178 160 168 Z"
            fill="var(--color-surface)"
            stroke="var(--color-hairline)"
            strokeWidth="1"
            opacity="0.8"
          />
          {/* Thread title */}
          <text x="175" y="130" fill="var(--color-muted-foreground)" fontSize="7" fontFamily="var(--font-mono)" fontWeight="600" letterSpacing="0.05em" opacity="0.6">
            # PR-247 review
          </text>
          {/* Message lines */}
          <rect x="175" y="138" width="48" height="4" rx="2" fill="var(--color-foreground)" opacity="0.2" />
          <rect x="175" y="146" width="38" height="4" rx="2" fill="var(--color-foreground)" opacity="0.15" />
          <rect x="175" y="154" width="42" height="4" rx="2" fill="var(--color-foreground)" opacity="0.18" />
          <rect x="175" y="162" width="28" height="4" rx="2" fill="var(--color-foreground)" opacity="0.12" />
        </g>

        {/* === Vanishing arrows (context lost) === */}
        <g opacity="0.15">
          {[
            { x1: 100, y1: 140, x2: 145, y2: 135 },
            { x1: 240, y1: 145, x2: 270, y2: 140 },
            { x1: 170, y1: 105, x2: 170, y2: 118 },
          ].map((line, i) => (
            <line
              key={i}
              x1={line.x1}
              y1={line.y1}
              x2={line.x2}
              y2={line.y2}
              stroke="var(--color-danger)"
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.4"
              style={{
                animation: `dash-flow ${dur(3)} linear infinite`,
                animationDelay: `${i * 0.5}s`,
              }}
            />
          ))}
        </g>

        {/* === CONFUSED DEVELOPER FIGURINE (bottom-right) === */}
        <g
          className="problem-developer"
          style={{
            animation: `problem-float ${dur(4)} ease-in-out infinite`,
          }}
        >
          {/* Head */}
          <circle cx="280" cy="210" r="10" fill="var(--color-surface-2)" stroke="var(--color-hairline)" strokeWidth="0.8" />
          {/* Question mark on head */}
          <text x="276" y="196" fill="var(--color-danger)" fontSize="14" fontFamily="serif" fontWeight="700" opacity="0.7">
            ?
          </text>
          {/* Body */}
          <path
            d="M274 220 L280 240 L286 220"
            fill="none"
            stroke="var(--color-muted-foreground)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.4"
          />
          {/* Arms (confused shrug) */}
          <path
            d="M268 222 Q260 218 255 225"
            fill="none"
            stroke="var(--color-muted-foreground)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.3"
          />
          <path
            d="M292 222 Q300 218 305 225"
            fill="none"
            stroke="var(--color-muted-foreground)"
            strokeWidth="1"
            strokeLinecap="round"
            opacity="0.3"
          />
        </g>

        {/* === SCATTERED PAPER SHEETS (bottom left) === */}
        <g className="problem-papers">
          <rect
            x="60"
            y="220"
            width="36"
            height="48"
            rx="2"
            fill="var(--color-surface)"
            stroke="var(--color-hairline)"
            strokeWidth="0.6"
            transform="rotate(-12, 78, 244)"
            opacity="0.5"
          />
          <rect
            x="80"
            y="225"
            width="36"
            height="48"
            rx="2"
            fill="var(--color-surface)"
            stroke="var(--color-hairline)"
            strokeWidth="0.6"
            transform="rotate(4, 98, 249)"
            opacity="0.4"
          />
          <rect
            x="48"
            y="240"
            width="36"
            height="48"
            rx="2"
            fill="var(--color-surface)"
            stroke="var(--color-hairline)"
            strokeWidth="0.6"
            transform="rotate(-6, 66, 264)"
            opacity="0.35"
          />
          {/* Faint text on papers */}
          <text x="68" y="252" fill="var(--color-muted-foreground)" fontSize="5" fontFamily="var(--font-mono)" opacity="0.3" transform="rotate(-12, 78, 244)">???</text>
        </g>

        {/* === DASHED CONNECTION LINES (disconnected context) === */}
        <g opacity="0.1">
          <line x1="148" y1="178" x2="170" y2="220" stroke="var(--color-danger)" strokeWidth="0.8" strokeDasharray="3 4" />
          <line x1="230" y1="178" x2="270" y2="210" stroke="var(--color-danger)" strokeWidth="0.8" strokeDasharray="3 4" />
        </g>

        {/* === DECORATIVE DOTS === */}
        {[
          { cx: 200, cy: 70, r: 1.5, o: 0.15 },
          { cx: 320, cy: 120, r: 1, o: 0.12 },
          { cx: 60, cy: 180, r: 1.5, o: 0.18 },
          { cx: 350, cy: 200, r: 1, o: 0.1 },
          { cx: 120, cy: 260, r: 1.5, o: 0.12 },
        ].map((dot, i) => (
          <circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="var(--color-danger)"
            opacity={dot.o}
          />
        ))}
      </svg>

      <style>{`
        @keyframes problem-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes problem-slack {
          0%, 100% { transform: translateY(0); opacity: 0.8; }
          50% { transform: translateY(-3px); opacity: 0.9; }
        }
        @keyframes dash-flow {
          to { stroke-dashoffset: -20; }
        }
        @media (prefers-reduced-motion: reduce) {
          .problem-developer, .problem-papers, [style*="animation"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
