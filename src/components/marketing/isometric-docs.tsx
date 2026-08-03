/* Hallmark · component: isometric-scene · genre: modern-minimal · theme: custom (amber-on-near-black)
 * scene: organized change brief with citations, inference tags, checkmark verification
 * contrast: pass
 */

import { cn } from '@/lib/utils'

interface IsometricDocsProps {
  className?: string
}

/**
 * Stripe-style isometric documentation illustration.
 * Shows a clean, organized change brief with cited evidence,
 * inference labels, and a verification checkmark.
 */
export function IsometricDocs({ className }: IsometricDocsProps) {
  const dur = (s: number) => `${s}s`

  return (
    <div className={cn('relative isolate overflow-hidden rounded-2xl', className)}>
      {/* Ambient glow - info tone */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[10%] -z-10 rounded-full bg-primary/15 blur-3xl grain-mask"
      />

      <svg
        viewBox="0 0 400 340"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Illustration showing an organized change brief with citations, inference tags, and a verified checkmark"
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
        </g>

        {/* === MAIN CHANGE BRIEF DOCUMENT (center) === */}
        <g
          style={{
            animation: `docs-float ${dur(6)} ease-in-out infinite`,
          }}
        >
          {/* Document shadow */}
          <rect
            x="134"
            y="102"
            width="152"
            height="200"
            rx="8"
            fill="var(--color-background)"
            opacity="0.15"
          />
          {/* Document body */}
          <rect
            x="130"
            y="95"
            width="152"
            height="200"
            rx="8"
            fill="var(--color-surface)"
            stroke="var(--color-hairline)"
            strokeWidth="1"
          />

          {/* Header stripe */}
          <rect
            x="130"
            y="95"
            width="152"
            height="30"
            rx="8"
            fill="var(--color-primary)"
            opacity="0.12"
          />
          <rect x="130" y="117" width="152" height="8" fill="var(--color-primary)" opacity="0.08" />

          {/* Title */}
          <text
            x="148"
            y="116"
            fill="var(--color-foreground)"
            fontSize="9"
            fontFamily="var(--font-mono)"
            fontWeight="700"
            letterSpacing="0.06em"
          >
            CHANGE BRIEF #247
          </text>

          {/* Content sections */}
          {/* Section 1 - Context */}
          <text
            x="148"
            y="140"
            fill="var(--color-muted-foreground)"
            fontSize="7"
            fontFamily="var(--font-mono)"
            fontWeight="600"
            letterSpacing="0.04em"
            opacity="0.7"
          >
            CONTEXT
          </text>
          <rect
            x="148"
            y="146"
            width="116"
            height="4"
            rx="2"
            fill="var(--color-foreground)"
            opacity="0.4"
          />
          <rect
            x="148"
            y="154"
            width="98"
            height="4"
            rx="2"
            fill="var(--color-foreground)"
            opacity="0.3"
          />
          <rect
            x="148"
            y="162"
            width="108"
            height="4"
            rx="2"
            fill="var(--color-foreground)"
            opacity="0.25"
          />

          {/* Citation pill 1 */}
          <rect
            x="198"
            y="150"
            width="52"
            height="12"
            rx="6"
            fill="var(--color-info-bg)"
            stroke="var(--color-info-border)"
            strokeWidth="0.5"
          />
          <text
            x="206"
            y="158"
            fill="var(--color-info-fg)"
            fontSize="6"
            fontFamily="var(--font-mono)"
          >
            c:e4f8a1d
          </text>

          {/* Section 2 - Changes */}
          <text
            x="148"
            y="182"
            fill="var(--color-muted-foreground)"
            fontSize="7"
            fontFamily="var(--font-mono)"
            fontWeight="600"
            letterSpacing="0.04em"
            opacity="0.7"
          >
            CHANGES
          </text>
          <rect
            x="148"
            y="188"
            width="116"
            height="4"
            rx="2"
            fill="var(--color-foreground)"
            opacity="0.35"
          />
          <rect
            x="148"
            y="196"
            width="88"
            height="4"
            rx="2"
            fill="var(--color-foreground)"
            opacity="0.25"
          />

          {/* Diff stat inline */}
          <text
            x="148"
            y="212"
            fill="var(--color-success-fg)"
            fontSize="7"
            fontFamily="var(--font-mono)"
            fontWeight="600"
          >
            +128
          </text>
          <text
            x="176"
            y="212"
            fill="var(--color-danger-fg)"
            fontSize="7"
            fontFamily="var(--font-mono)"
            fontWeight="600"
          >
            −47
          </text>
          <text
            x="198"
            y="212"
            fill="var(--color-muted-foreground)"
            fontSize="6"
            fontFamily="var(--font-mono)"
          >
            files
          </text>

          {/* Inference tag */}
          <rect
            x="200"
            y="225"
            width="48"
            height="14"
            rx="7"
            fill="var(--color-primary)"
            opacity="0.2"
          />
          <text
            x="206"
            y="235"
            fill="var(--color-primary)"
            fontSize="6.5"
            fontFamily="var(--font-mono)"
            fontWeight="700"
            letterSpacing="0.1em"
          >
            Inference
          </text>
          <rect
            x="148"
            y="230"
            width="44"
            height="4"
            rx="2"
            fill="var(--color-foreground)"
            opacity="0.2"
          />

          {/* Risk badges row */}
          <rect
            x="148"
            y="248"
            width="32"
            height="10"
            rx="5"
            fill="var(--color-success-bg)"
            stroke="var(--color-success-border)"
            strokeWidth="0.5"
          />
          <text
            x="154"
            y="256"
            fill="var(--color-success-fg)"
            fontSize="5"
            fontFamily="var(--font-mono)"
            fontWeight="600"
          >
            safe
          </text>
          <rect
            x="186"
            y="248"
            width="38"
            height="10"
            rx="5"
            fill="var(--color-warning-bg)"
            stroke="var(--color-warning-border)"
            strokeWidth="0.5"
          />
          <text
            x="192"
            y="256"
            fill="var(--color-warning-fg)"
            fontSize="5"
            fontFamily="var(--font-mono)"
            fontWeight="600"
          >
            review
          </text>
        </g>

        {/* === FLOATING CHECKMARK BADGE (top-right) === */}
        <g
          style={{
            animation: `docs-float ${dur(5)} ease-in-out infinite 0.5s`,
          }}
        >
          <circle
            cx="330"
            cy="120"
            r="20"
            fill="var(--color-success-bg)"
            stroke="var(--color-success-border)"
            strokeWidth="1.5"
          />
          <path
            d="M322 120 L328 126 L338 114"
            stroke="var(--color-success-fg)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            style={{
              strokeDasharray: 30,
              strokeDashoffset: 0,
              animation: `docs-check ${dur(2)} ease-out infinite`,
            }}
          />
        </g>

        {/* === FLOATING APPROVED BADGE (top-left) === */}
        <g
          style={{
            animation: `docs-float ${dur(5.5)} ease-in-out infinite 1s`,
          }}
        >
          <rect
            x="40"
            y="90"
            width="72"
            height="26"
            rx="13"
            fill="var(--color-success-bg)"
            stroke="var(--color-success-border)"
            strokeWidth="0.8"
          />
          <circle cx="56" cy="103" r="4" fill="var(--color-success)" opacity="0.8" />
          <text
            x="66"
            y="107"
            fill="var(--color-success-fg)"
            fontSize="8"
            fontFamily="var(--font-mono)"
            fontWeight="600"
          >
            Approved
          </text>
        </g>

        {/* === FLOATING CITATION BADGE (left-center) === */}
        <g
          style={{
            animation: `docs-float ${dur(6)} ease-in-out infinite 0.7s`,
          }}
        >
          <rect
            x="40"
            y="160"
            width="68"
            height="24"
            rx="12"
            fill="var(--color-info-bg)"
            stroke="var(--color-info-border)"
            strokeWidth="0.8"
          />
          <text
            x="52"
            y="176"
            fill="var(--color-info-fg)"
            fontSize="7"
            fontFamily="var(--font-mono)"
            fontWeight="500"
          >
            <tspan fill="var(--color-primary)" opacity="0.7">
              c:
            </tspan>{' '}
            b3f2c91
          </text>
        </g>

        {/* === FLOATING TIMESTAMP BADGE (right-center) === */}
        <g
          style={{
            animation: `docs-float ${dur(4.5)} ease-in-out infinite 1.2s`,
          }}
        >
          <rect
            x="310"
            y="190"
            width="62"
            height="22"
            rx="11"
            fill="var(--color-surface-2)"
            stroke="var(--color-hairline)"
            strokeWidth="0.8"
          />
          <text
            x="320"
            y="204"
            fill="var(--color-muted-foreground)"
            fontSize="7"
            fontFamily="var(--font-mono)"
            fontWeight="500"
          >
            14 Mar 2026
          </text>
        </g>

        {/* === BOTTOM CITATION STRIP === */}
        <g
          style={{
            animation: `docs-float ${dur(5.5)} ease-in-out infinite 1.5s`,
          }}
        >
          <rect
            x="100"
            y="310"
            width="200"
            height="18"
            rx="9"
            fill="var(--color-surface)"
            stroke="var(--color-hairline)"
            strokeWidth="0.5"
            opacity="0.8"
          />
          <text
            x="130"
            y="322"
            fill="var(--color-muted-foreground)"
            fontSize="6.5"
            fontFamily="var(--font-mono)"
            fontWeight="500"
            letterSpacing="0.03em"
          >
            3 citations · 2 inferences · 90s read
          </text>
        </g>

        {/* === CONNECTION LINES (traceability) === */}
        <g opacity="0.08">
          <line x1="112" y1="103" x2="130" y2="130" stroke="var(--color-primary)" strokeWidth="1" />
          <line x1="282" y1="120" x2="310" y2="120" stroke="var(--color-success)" strokeWidth="1" />
          <line x1="108" y1="172" x2="130" y2="172" stroke="var(--color-info)" strokeWidth="1" />
          <line
            x1="282"
            y1="201"
            x2="310"
            y2="201"
            stroke="var(--color-muted-foreground)"
            strokeWidth="1"
          />
        </g>

        {/* === DECORATIVE DOTS === */}
        {[
          { cx: 200, cy: 60, r: 1.5, o: 0.12 },
          { cx: 50, cy: 240, r: 1, o: 0.1 },
          { cx: 350, cy: 260, r: 1.5, o: 0.15 },
          { cx: 80, cy: 290, r: 1, o: 0.12 },
          { cx: 320, cy: 155, r: 1.5, o: 0.1 },
        ].map((dot, i) => (
          <circle
            key={i}
            cx={dot.cx}
            cy={dot.cy}
            r={dot.r}
            fill="var(--color-primary)"
            opacity={dot.o}
          />
        ))}
      </svg>

      <style>{`
        @keyframes docs-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @keyframes docs-check {
          0% { stroke-dashoffset: 30; }
          30% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 0; }
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
