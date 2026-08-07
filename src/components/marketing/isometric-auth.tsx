/* Hallmark · component: isometric-auth · genre: modern-minimal · theme: custom (amber-on-near-black)
 * scene: developer reviewing PR with cited brief, split composition for auth panels
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass
 */

import { cn } from '@/lib/utils'

interface IsometricAuthProps {
  className?: string
  variant?: 'login' | 'register'
}

const dur = (s: number) => `${s}s`

/** Stripe-style isometric illustration: developer workspace with a change brief. */
function IsometricArt() {
  return (
    <svg
      viewBox="0 0 400 360"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-auto max-w-sm mx-auto"
      role="img"
      aria-label="Developer workspace illustration"
    >
      {/* Grid plane */}
      <g opacity="0.05">
        {Array.from({ length: 10 }).map((_, i) => (
          <line
            key={`h${i}`}
            x1={0}
            y1={60 + i * 30}
            x2={400}
            y2={60 + i * 30}
            stroke="var(--color-foreground)"
            strokeWidth="0.5"
          />
        ))}
      </g>

      {/* === DOCUMENT / CHANGE BRIEF (center) === */}
      <g style={{ animation: `float-gentle ${dur(7)} ease-in-out infinite` }}>
        {/* Paper */}
        <rect
          x="130"
          y="80"
          width="140"
          height="180"
          rx="8"
          fill="var(--color-surface)"
          stroke="var(--color-hairline)"
          strokeWidth="1"
        />
        {/* Header stripe */}
        <rect
          x="130"
          y="80"
          width="140"
          height="28"
          rx="8"
          fill="var(--color-primary)"
          opacity="0.15"
        />
        <rect x="130" y="100" width="140" height="8" fill="var(--color-primary)" opacity="0.15" />
        {/* Title */}
        <text
          x="148"
          y="100"
          fill="var(--color-foreground)"
          fontSize="9"
          fontFamily="var(--font-mono)"
          fontWeight="700"
          letterSpacing="0.05em"
        >
          CHANGE BRIEF
        </text>
        {/* Content lines */}
        {[
          { y: 122, w: 100, o: 0.7 },
          { y: 134, w: 120, o: 0.5 },
          { y: 146, w: 80, o: 0.4 },
          { y: 158, w: 110, o: 0.5 },
          { y: 170, w: 90, o: 0.35 },
          { y: 182, w: 115, o: 0.45 },
          { y: 194, w: 70, o: 0.3 },
          { y: 206, w: 105, o: 0.5 },
          { y: 218, w: 85, o: 0.4 },
          { y: 230, w: 100, o: 0.35 },
        ].map((line) => (
          <rect
            key={`line-${line.y}`}
            x="148"
            y={line.y}
            width={line.w}
            height="5"
            rx="2.5"
            fill="var(--color-foreground)"
            opacity={line.o}
          />
        ))}
        {/* Citation pill */}
        <rect
          x="200"
          y="143"
          width="52"
          height="12"
          rx="6"
          fill="var(--color-info-bg)"
          stroke="var(--color-info-border)"
          strokeWidth="0.5"
        />
        <text
          x="210"
          y="152"
          fill="var(--color-info-fg)"
          fontSize="7"
          fontFamily="var(--font-mono)"
        >
          c:a91f4c2
        </text>
        {/* Inference tag */}
        <rect
          x="175"
          y="215"
          width="48"
          height="12"
          rx="6"
          fill="var(--color-primary)"
          opacity="0.2"
        />
        <text
          x="180"
          y="224"
          fill="var(--color-primary)"
          fontSize="6.5"
          fontFamily="var(--font-mono)"
          fontWeight="700"
          letterSpacing="0.1em"
        >
          Inference
        </text>
      </g>

      {/* === FLOATING BADGES === */}
      {/* Status badge */}
      <g style={{ animation: `float-gentle ${dur(8)} ease-in-out infinite 1s` }}>
        <rect
          x="50"
          y="120"
          width="68"
          height="22"
          rx="11"
          fill="var(--color-success-bg)"
          stroke="var(--color-success-border)"
          strokeWidth="0.8"
        />
        <circle cx="64" cy="131" r="3" fill="var(--color-success)" opacity="0.7" />
        <text
          x="72"
          y="135"
          fill="var(--color-success-fg)"
          fontSize="8"
          fontFamily="var(--font-mono)"
          fontWeight="600"
        >
          READY
        </text>
      </g>

      {/* Commit count badge */}
      <g style={{ animation: `float-gentle ${dur(6.5)} ease-in-out infinite 0.7s` }}>
        <rect
          x="290"
          y="100"
          width="72"
          height="22"
          rx="11"
          fill="var(--color-warning-bg)"
          stroke="var(--color-warning-border)"
          strokeWidth="0.8"
        />
        <text
          x="300"
          y="114"
          fill="var(--color-warning-fg)"
          fontSize="8"
          fontFamily="var(--font-mono)"
          fontWeight="500"
        >
          14 commits
        </text>
      </g>

      {/* Risk flag */}
      <g style={{ animation: `float-gentle ${dur(9)} ease-in-out infinite 1.5s` }}>
        <rect
          x="40"
          y="200"
          width="78"
          height="22"
          rx="11"
          fill="var(--color-danger-bg)"
          stroke="var(--color-danger-border)"
          strokeWidth="0.8"
        />
        <text
          x="52"
          y="214"
          fill="var(--color-danger-fg)"
          fontSize="8"
          fontFamily="var(--font-mono)"
          fontWeight="500"
        >
          ⚠ API surface
        </text>
      </g>

      {/* Diff stats */}
      <g style={{ animation: `float-gentle ${dur(7.5)} ease-in-out infinite 2s` }}>
        <rect
          x="290"
          y="180"
          width="82"
          height="22"
          rx="11"
          fill="var(--color-surface)"
          stroke="var(--color-hairline)"
          strokeWidth="0.8"
        />
        <text
          x="302"
          y="194"
          fill="var(--color-success-fg)"
          fontSize="8"
          fontFamily="var(--font-mono)"
          fontWeight="500"
        >
          +128 −47
        </text>
      </g>

      {/* === DECORATIVE ELEMENTS === */}
      {/* Small desk plant */}
      <g>
        <rect
          x="310"
          y="260"
          width="16"
          height="20"
          rx="3"
          fill="var(--color-surface-2)"
          stroke="var(--color-hairline)"
          strokeWidth="0.5"
        />
        <path d="M318 260 Q314 245 322 250" fill="var(--color-success)" opacity="0.4" />
        <path d="M318 260 Q322 242 318 248" fill="var(--color-success)" opacity="0.3" />
        <path d="M318 260 Q312 248 316 252" fill="var(--color-success)" opacity="0.35" />
      </g>

      {/* Decorative dots */}
      {[
        { cx: 80, cy: 160, r: 2, o: 0.2 },
        { cx: 340, cy: 150, r: 1.5, o: 0.15 },
        { cx: 100, cy: 280, r: 1.5, o: 0.2 },
        { cx: 320, cy: 240, r: 2, o: 0.18 },
        { cx: 60, cy: 250, r: 1, o: 0.25 },
        { cx: 360, cy: 220, r: 1.5, o: 0.12 },
      ].map((dot) => (
        <circle
          key={`dot-${dot.cx}-${dot.cy}`}
          cx={dot.cx}
          cy={dot.cy}
          r={dot.r}
          fill="var(--color-primary)"
          opacity={dot.o}
        />
      ))}

      {/* Connection lines (subtle) */}
      <line
        x1="118"
        y1="131"
        x2="130"
        y2="131"
        stroke="var(--color-hairline)"
        strokeWidth="0.5"
        strokeDasharray="2 2"
        opacity="0.4"
      />
      <line
        x1="270"
        y1="111"
        x2="290"
        y2="111"
        stroke="var(--color-hairline)"
        strokeWidth="0.5"
        strokeDasharray="2 2"
        opacity="0.4"
      />
    </svg>
  )
}

/**
 * Stripe-style isometric illustration for auth pages.
 * Shows a developer workspace with a change brief, citations, and workflow elements.
 */
export function IsometricAuth({ className, variant = 'login' }: IsometricAuthProps) {
  return (
    <div className={cn('relative isolate overflow-hidden', className)}>
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[8%] -z-10 rounded-full bg-primary/15 blur-3xl grain-mask"
      />

      <IsometricArt />

      {/* Variant-specific tagline */}
      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground/70 leading-relaxed">
          {variant === 'login'
            ? 'Pick up where you left off. Your reasoning is waiting.'
            : 'Start capturing your engineering narrative today.'}
        </p>
      </div>

      <style>{`
        @keyframes float-gentle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="animation"] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
