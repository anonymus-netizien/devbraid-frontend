# Design — DevBraid

Locked design system. Future Hallmark runs read this file first; pages defer
to it. Amend intentionally — the file is the rule.

Primary DNA extracted from https://www.launchuicomponents.com/ (public
reference for DevBraid's own brand, 2026-08-04) via `hallmark study` URL
mode. Secondary axes from https://blink.daisyui.com/ (motion, micro-label
discipline, marquee hero option). Tokens exact; fonts exact; rhythm unknown
(URL mode).

## System
- Genre · modern-minimal (developer tool, B2B)
- Macrostructure · Centered-Screenshot Hero: badge → clipped-gradient H1 →
  CTAs → product screenshot (light/dark) → logos strip → features/bento →
  FAQ → CTA panel → footer newsletter join
- Theme · studied-DNA (primary: launchuicomponents.com; secondary:
  blink.daisyui.com)
- Axes · dark near-black (L 3 %) + light cool variant / single grotesque
  display (Inter) / ember-amber accent

## Tokens (canonical · `tokens.css` is the source of truth)
```css
:root {
  /* dark (data-theme="dark" is the cinematic identity; light follows) */
  --color-paper:      oklch(3% .002 262);        /* #09090b, near-black */
  --color-paper-2:    oklch(14% .006 262);       /* card elevation */
  --color-paper-3:    oklch(20% .008 262);       /* raised / hover */
  --color-ink:        oklch(96% .01 260);        /* primary text */
  --color-ink-2:      oklch(72% .02 260);        /* muted body */
  --color-rule:       oklch(26% .015 260);       /* hairline borders, line-width 0 */
  --color-accent:     #fb923c;                   /* ember-foreground: amber-400 */
  --color-accent-ink: #e9680c;                   /* light-mode ember; dark uses lighter #fdba72 */
  --color-secondary:  oklch(60% .126 221.723);   /* cyan-blue — rare, tech accents (Blink axis) */
  --color-focus:      #fb923c;

  --font-display: "Inter", "Geist", system-ui, sans-serif;
  --font-body:    "Inter", "Geist", system-ui, sans-serif;
  --font-mono:    "IBM Plex Mono", "JetBrains Mono", ui-monospace, monospace;

  /* 4-pt spacing scale, named: --space-3xs … --space-4xl. See tokens.css. */
  /* Type scale, 1.25 (major-third) ratio: --text-xs … --text-display.    */

  --ease-out: cubic-bezier(0.16, 1, 0.3, 1);
  --dur-fast: 180ms;  --dur-base: 240ms;  --dur-slow: 320ms;

  --radius-card: .5rem;  --radius-large: 1rem;  --radius-input: .25rem;
}
```

## Provenance
- Source mode · URL. Sources · https://www.launchuicomponents.com/ (primary),
  https://blink.daisyui.com/ (secondary axes).
- Extracted · 2026-08-04. Attestation · (b) public references for own brand
  (disclosed during phase planning; carried forward).
- Confidence · tokens exact, fonts exact, rhythm unknown (URL mode).
- Note · supersedes the earlier Folio + Blink-only extractions; primary moved
  from Blink to Launch UI by explicit user choice.

## CTA voice
- Primary · #fb923c fill, near-black text, .5rem radius, px-5 py-2.5, arrow
  icon on hover (translate-x)
- Secondary · outline, hairline rule, same radius, ghost fill

## Motion stance
- Primitives · mount-reveal gated by `.mounted` class (appear / appear-slide /
  appear-zoom; animations paused until hydration) · hover/hover-reverse
  micro-interactions · optional marquee strip · optional orbit ornament ·
  accordion for FAQ
- Reduced-motion fallback · ≤150 ms opacity crossfade, no transform, no
  marquee.

## Notes
- Do NOT carry over: nothing flagged — both sources are clean (no
  transition-all, no hover-scale, no bouncy hovers).
- Carry forward: hairline rules with line-width 0, small .5rem radii with a
  single 1rem large radius for callout panels, uppercase micro-labels with
  tracking, badge chips with icon+text, clipped-gradient H1 on dark with
  drop-shadow, logo strip with greyed monochrome marks.
- Token regeneration is allowed: per Provenance, values may be re-tuned to
  DevBraid's brand identity (charcoal-blue + amber) — amber is already the
  primary accent here; charcoal blue folds into paper/blue-secondary roles.

## Exports
`tokens.css` (in this project) is the source of truth. For Tailwind v4
`@theme`, DTCG `tokens.json`, or shadcn/ui CSS variables, ask *"extend
design.md with Tailwind exports"* — Hallmark will append them.