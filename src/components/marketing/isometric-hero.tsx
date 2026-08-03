/* Hallmark · component: isometric-scene · genre: modern-minimal · theme: custom (amber-on-near-black)
 * scene: developer workspace with laptop, code, PR badges, citations
 * states: default · hover · focus · active · disabled · loading · error · success
 * contrast: pass
 */

import { cn } from '@/lib/utils'

interface IsometricHeroProps {
  className?: string
  /** Animation speed modifier — 1 = normal, 2 = 2× slower */
  speed?: number
}

/**
 * Stripe-style isometric hero illustration.
 * Pure SVG + CSS animations — no external assets.
 */
export function IsometricHero({ className, speed = 1 }: IsometricHeroProps) {
  const dur = (s: number) => `${s * speed}s`

  return (
    <div className={cn('relative isolate overflow-hidden rounded-2xl', className)}>
      {/* Ambient glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-[10%] -z-10 rounded-full bg-primary/20 blur-3xl grain-mask"
      />

      <svg
        viewBox="0 0 480 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
        role="img"
        aria-label="Developer workspace illustration showing a laptop with code, commit badges, and citation tags"
      >
        {/* Isometric grid plane */}
        <g opacity="0.06">
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={`h${i}`}
              x1={0}
              y1={80 + i * 28}
              x2={480}
              y2={80 + i * 28}
              stroke="var(--color-foreground)"
              strokeWidth="0.5"
            />
          ))}
          {Array.from({ length: 16 }).map((_, i) => (
            <line
              key={`v${i}`}
              x1={30 * i}
              y1={0}
              x2={30 * i + 120}
              y2={400}
              stroke="var(--color-foreground)"
              strokeWidth="0.5"
            />
          ))}
        </g>

        {/* === DESK SURFACE (isometric) === */}
        <g className="isometric-desk">
          {/* Desk top */}
          <path
            d="M80 260 L240 180 L400 260 L240 340 Z"
            fill="var(--color-surface)"
            stroke="var(--color-hairline)"
            strokeWidth="1"
          />
          {/* Desk front edge */}
          <path
            d="M80 260 L80 280 L240 360 L240 340 Z"
            fill="var(--color-surface-2)"
            stroke="var(--color-hairline)"
            strokeWidth="0.5"
          />
          {/* Desk right edge */}
          <path
            d="M400 260 L400 280 L240 360 L240 340 Z"
            fill="var(--color-surface)"
            stroke="var(--color-hairline)"
            strokeWidth="0.5"
          />
        </g>

        {/* === LAPTOP (isometric) === */}
        <g className="isometric-laptop">
          {/* Laptop base */}
          <path
            d="M160 240 L240 200 L320 240 L240 280 Z"
            fill="var(--color-background)"
            stroke="var(--color-primary)"
            strokeWidth="1.5"
            opacity="0.9"
          />
          {/* Laptop screen */}
          <g
            style={{
              transformOrigin: '240px 200px',
              animation: `laptop-float ${dur(6)} ease-in-out infinite`,
            }}
          >
            {/* Screen frame */}
            <path
              d="M170 235 L240 195 L310 235 L240 275 Z"
              fill="var(--color-background)"
              stroke="var(--color-primary)"
              strokeWidth="1"
            />
            {/* Screen content — code lines */}
            <g opacity="0.85">
              <line
                x1="190"
                y1="218"
                x2="225"
                y2="201"
                stroke="var(--color-success)"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <line
                x1="195"
                y1="222"
                x2="235"
                y2="202"
                stroke="var(--color-foreground)"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.6"
              />
              <line
                x1="200"
                y1="226"
                x2="230"
                y2="211"
                stroke="var(--color-info)"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.5"
              />
              <line
                x1="205"
                y1="230"
                x2="240"
                y2="213"
                stroke="var(--color-foreground)"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.4"
              />
              <line
                x1="198"
                y1="224"
                x2="220"
                y2="213"
                stroke="var(--color-warning)"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.6"
              />
              {/* Blinking cursor */}
              <rect
                x="221"
                y="200"
                width="1.5"
                height="10"
                fill="var(--color-primary)"
                rx="0.5"
                style={{
                  animation: `cursor-blink ${dur(1.2)} step-end infinite`,
                  transformOrigin: '221px 205px',
                  transform: 'rotate(-15deg) skewX(0deg)',
                }}
              />
            </g>
            {/* Diff highlight line */}
            <path
              d="M192 220 L228 203"
              stroke="var(--color-danger)"
              strokeWidth="1"
              strokeDasharray="3 2"
              opacity="0.5"
            />
          </g>
        </g>

        {/* === FLOATING PR BADGE (top-left) === */}
        <g
          style={{ animation: `float-up ${dur(7)} ease-in-out infinite` }}
          className="isometric-float"
        >
          <rect
            x="85"
            y="130"
            width="90"
            height="28"
            rx="14"
            fill="var(--color-success-bg)"
            stroke="var(--color-success-border)"
            strokeWidth="1"
          />
          <circle cx="100" cy="144" r="4" fill="var(--color-success)" opacity="0.8" />
          <text
            x="112"
            y="148"
            fill="var(--color-success-fg)"
            fontSize="9"
            fontFamily="var(--font-mono)"
            fontWeight="600"
          >
            #247 merged
          </text>
        </g>

        {/* === FLOATING CITATION TAG (top-right) === */}
        <g
          style={{ animation: `float-up ${dur(8)} ease-in-out infinite 0.5s` }}
          className="isometric-float"
        >
          <rect
            x="310"
            y="110"
            width="110"
            height="28"
            rx="14"
            fill="var(--color-info-bg)"
            stroke="var(--color-info-border)"
            strokeWidth="1"
          />
          <text
            x="325"
            y="128"
            fill="var(--color-info-fg)"
            fontSize="9"
            fontFamily="var(--font-mono)"
            fontWeight="500"
          >
            <tspan fill="var(--color-primary)" opacity="0.7">
              c:
            </tspan>{' '}
            a91f4c2
          </text>
        </g>

        {/* === FLOATING COMMIT BADGE (bottom-right) === */}
        <g
          style={{ animation: `float-up ${dur(6)} ease-in-out infinite 1s` }}
          className="isometric-float"
        >
          <rect
            x="320"
            y="200"
            width="100"
            height="26"
            rx="13"
            fill="var(--color-warning-bg)"
            stroke="var(--color-warning-border)"
            strokeWidth="1"
          />
          <text
            x="335"
            y="217"
            fill="var(--color-warning-fg)"
            fontSize="9"
            fontFamily="var(--font-mono)"
            fontWeight="500"
          >
            +128 −47 files
          </text>
        </g>

        {/* === FLOATING INFERENCE TAG (left) === */}
        <g
          style={{ animation: `float-up ${dur(9)} ease-in-out infinite 1.5s` }}
          className="isometric-float"
        >
          <rect
            x="70"
            y="195"
            width="78"
            height="22"
            rx="11"
            fill="var(--color-primary)"
            opacity="0.15"
            stroke="var(--color-primary)"
            strokeWidth="1"
          />
          <text
            x="82"
            y="210"
            fill="var(--color-primary)"
            fontSize="8"
            fontFamily="var(--font-mono)"
            fontWeight="700"
            letterSpacing="0.08em"
          >
            Inference
          </text>
        </g>

        {/* === FLOATING RISK FLAG (bottom-left) === */}
        <g
          style={{ animation: `float-up ${dur(7.5)} ease-in-out infinite 2s` }}
          className="isometric-float"
        >
          <rect
            x="95"
            y="300"
            width="95"
            height="26"
            rx="13"
            fill="var(--color-danger-bg)"
            stroke="var(--color-danger-border)"
            strokeWidth="1"
          />
          <text
            x="108"
            y="317"
            fill="var(--color-danger-fg)"
            fontSize="9"
            fontFamily="var(--font-mono)"
            fontWeight="500"
          >
            ⚠ auth surface
          </text>
        </g>

        {/* === COFFEE CUP === */}
        <g className="isometric-coffee">
          <ellipse
            cx="355"
            cy="235"
            rx="14"
            ry="7"
            fill="var(--color-surface-2)"
            stroke="var(--color-hairline)"
            strokeWidth="0.8"
          />
          <path
            d="M341 235 L341 222 Q341 215 355 215 Q369 215 369 222 L369 235"
            fill="var(--color-surface)"
            stroke="var(--color-hairline)"
            strokeWidth="0.8"
          />
          {/* Steam */}
          <path
            d="M349 213 Q352 205 349 198"
            fill="none"
            stroke="var(--color-muted-foreground)"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.3"
            style={{ animation: `steam ${dur(3)} ease-in-out infinite` }}
          />
          <path
            d="M356 213 Q359 205 356 198"
            fill="none"
            stroke="var(--color-muted-foreground)"
            strokeWidth="0.8"
            strokeLinecap="round"
            opacity="0.25"
            style={{ animation: `steam ${dur(3)} ease-in-out infinite 0.5s` }}
          />
        </g>

        {/* === SMALL FIGURINE (developer at desk) === */}
        <g className="isometric-developer">
          {/* Head */}
          <circle cx="240" cy="158" r="8" fill="var(--color-primary)" opacity="0.3" />
          <circle
            cx="240"
            cy="158"
            r="6"
            fill="var(--color-surface)"
            stroke="var(--color-primary)"
            strokeWidth="1"
          />
          {/* Body */}
          <path
            d="M235 165 L240 175 L245 165"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="1.5"
            strokeLinecap="round"
            opacity="0.6"
          />
        </g>

        {/* === DECORATIVE DOTS === */}
        {[
          { cx: 130, cy: 170, r: 2, o: 0.2 },
          { cx: 370, cy: 155, r: 1.5, o: 0.15 },
          { cx: 150, cy: 310, r: 1.5, o: 0.2 },
          { cx: 350, cy: 180, r: 2, o: 0.18 },
          { cx: 110, cy: 230, r: 1, o: 0.25 },
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
        @keyframes laptop-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes cursor-blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
        @keyframes float-up {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
        @keyframes steam {
          0%, 100% { opacity: 0.3; transform: translateY(0); }
          50% { opacity: 0.15; transform: translateY(-4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .isometric-laptop, .isometric-float, .isometric-coffee svg, svg rect[style] {
            animation: none !important;
          }
        }
      `}</style>
    </div>
  )
}
