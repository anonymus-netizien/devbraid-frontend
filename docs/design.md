# Design — DevBraid

Canonical design system: **DevBraid Design System v2.0 — Bronze Obsidian** (locked 2026-08-06).

Future design work reads this file first; pages and components defer to it. Amend
intentionally — the file is the rule.

Source: `stitch_devbraid_design_system/bronze_obsidian/DESIGN.md` + the 7 page
mockups in `stitch_devbraid_design_system/devbraid_*`.

---

# Design System v2.0 — Bronze Obsidian

## Design Philosophy

DevBraid is not another AI chatbot. It is an engineering workspace.

Every design decision should reinforce:

- Trust
- Clarity
- Evidence
- Documentation
- Engineering quality

The UI should feel closer to reading an engineering design document than
browsing a marketing website — "multi-million-dollar" prestige: authoritative,
understated, deep obsidian canvas, muted metallic bronze accents.

## Design Principles

- **Calm Interface** — no unnecessary visual noise; the interface disappears behind the work.
- **Evidence First** — evidence is the product; it always receives stronger visual hierarchy than AI-generated text.
- **Readability Over Decoration** — typography is the primary visual language; whitespace over borders; hierarchy over colors.
- **Engineering Feel** — the product resembles an IDE mixed with GitHub documentation; never a generic AI SaaS dashboard.
- **Dark-only** — no light theme is built or planned. One theme to design, build, and maintain.

## Typography

### Fonts
- **Primary:** Inter (400/500/600/700/800/900) — body, navigation, cards, forms, buttons, documentation.
- **Code:** JetBrains Mono (12–14px/500) — labels, commit hashes, evidence IDs, code blocks, API payloads, file paths. Never use monospace for paragraphs.

### Scale
| Token | Size | Weight | Notes |
|-------|------|--------|-------|
| Display (hero) | 56px | 600 | leading 64px, letter-spacing -0.02em |
| Display mobile | 36px | 600 | leading 44px |
| Page Heading | 32px | 500 | leading 40px, letter-spacing -0.01em |
| Card Title | 18–20px | 600 | |
| Body | 16px | 400 | leading 24px |
| Body large | 18px | 400 | leading 28px |
| Mono label | 12px | 500 | uppercase, letter-spacing 0.05em |
| Code | 14px | 400 | leading 20px |

### Hierarchy
Display → Page Heading → Card Title → Body → Mono label / Code

## Layout & Spacing

- Content container: 1280px max, 24px gutters, 64px desktop margins / 20px mobile
- Spacing unit: 8px (8/16/24/32/40/48/64)
- Corner radius: 8px default (cards, buttons, inputs); 12px on thread/brief cards; 4px on small chips
- Borders: 1px hairline only — **bronze at 15% opacity** (`rgba(166,141,91,0.15)`), never a heavy border
- Depth via tonal layering (canvas → surface → elevated), not shadows; outer glow (soft bronze) only for active states / primary buttons
- Glassmorphism: top bars and floating modals use `backdrop-blur` (24px) over a semi-transparent dark fill

## Color — Dark Only

### Surfaces
| Token | Value | Role |
|-------|-------|------|
| Canvas / Background | `#131313` | Page background |
| Surface (cards) | `#1c1b1b` | Cards, panels, sidebar |
| Surface-2 | `#201f1f` | Hover fills, active nav bg |
| Elevated / Popover | `#2a2a2a` | Menus, popovers, chips |
| Hairline | `rgba(166,141,91,0.15)` | 1px borders only |

### Text
| Token | Value | Role |
|-------|-------|------|
| Primary Text (on-surface) | `#e5e2e1` | Headings, primary content |
| Secondary Text (on-surface-variant) | `#cfc5b6` | Body, secondary content |
| Muted | `#989082` | Captions, timestamps |

### Accents
| Token | Value | Meaning | Use |
|-------|-------|---------|-----|
| Primary Bronze (surface-tint) | `#dfc38c` | Brand, verified fact | Primary CTA, links, active nav, evidence chips |
| Primary hover (primary-fixed) | `#fddfa6` | Hover brightening | Button hover, link hover |
| Primary container | `#a78d5b` | Muted bronze | Tertiary accents, chip text, secondary borders |
| On-primary | `#3f2e04` | Text on gold | Button labels on `--primary` fills |
| AI Inference | `#a39db3` | Model-inferred (not cited) | Inference chips, AI confidence — the only violet in the system |
| Error / Risk Red | `#ffb4ab` | Danger, critical risk | Risk flags, destructive actions, error states |
| Confirm Green | `#34d399` | Success, approved | Published/approved states, success dots |
| Info Blue | `#60a5fa` | Neutral information | Informational callouts, commit accents |

Gold (`#dfc38c`) and violet (`#a39db3`) carry the actual product meaning —
cited evidence vs. AI inference. Every other element stays restrained so those
two read as signal, not decoration.

### Risk Levels (desaturated bronze tints — information, not alarm)
| Level | Background | Border | Text |
|-------|-----------|--------|------|
| Critical | `#ffb4ab14` | `#ffb4ab4d` | `#ffb4ab` |
| High | `#dfc38c14` | `#dfc38c4d` | `#dfc38c` |
| Medium | `#c8c6c514` | `#c8c6c54d` | `#c8c6c5` |
| Low | `#a78d5b14` | `#a78d5b4d` | `#a78d5b` |
| Safe | `#34d39914` | `#34d3994d` | `#34d399` |

### DevBraid-Specific
Evidence `#dfc38c` · Inference `#a39db3` · Commit `#60a5fa` · Branch `#989082` ·
Decision Notes `#34d399` · Thread `#a78d5b`

## Components

### Buttons
Height 40px · radius 8px · variants:
- **Primary:** solid bronze (`--primary`) fill, dark text (`--primary-foreground`), soft bronze glow on hover
- **Secondary:** ghost with 1px bronze hairline border, 10% bronze fill on hover
- **Danger:** red (`#ffb4ab`) text on transparent, destructive only
- One primary button per view — never two gold buttons competing

### Cards
Surface background, 8px radius (12px on thread/brief/decision cards), hairline bronze border, no shadow at rest; hover = brightened surface + soft lift, or bronze border tint.

### Evidence / Inference chips
Small muted-tint pills, mono or 12px label: gold tint (`#dfc38c`) for cited evidence, violet tint (`#a39db3`) for inference. Never bright/saturated fills.

### Risk badges
Small, text-forward, severity-colored (`--risk-*` tokens), uppercase mono labels. Information, not warning banners.

### Inputs
Height 40px, radius 8px, darker than container, bronze border that brightens on focus (gold ring).

### Code blocks
Deepest inset surface (`#0e0e0e`-family), 8px radius, hairline border, JetBrains Mono 14px. Terminal-style: header bar with language label + copy button.

### Navigation
App sidebar w-64, surface bg, mono label-caps group headers, active item = gold left rail (`border-l-2 border-primary`) or filled elevated surface. Marketing top nav: fixed, `backdrop-blur`, hairline bottom border, gold active link underline.

### Markdown
GitHub-style: H1 40px, H2 32px, H3 24px, paragraph 16px, line-height 1.8, code in JetBrains Mono on inset surface.

## Motion

Minimal. Duration 150–250ms. Use: hover, focus, page transitions, expand/collapse.
Avoid: bounce, elastic, overshoot, large entrance animations. Respect
`prefers-reduced-motion`.

## Accessibility

- Minimum WCAG AA contrast
- Visible keyboard focus
- 44px touch targets
- Never rely on color alone

## Things to Avoid

❌ Light theme · ❌ Multiple accent colors competing · ❌ Large saturated
gradients (gradients only in marketing hero, dark-to-darker) · ❌ Heavy shadows
· ❌ Thick borders · ❌ Neon colors · ❌ Excessive animations · ❌ Stock
photography / illustrated people

---

## Token Implementation

`src/index.css` is the source of truth. Tailwind v4 `@theme inline` maps tokens
to utilities. Component markup consumes `bg-surface`, `text-muted-foreground`,
`border-hairline`, `bg-primary`, `ring-ring`, `text-hero`, `text-page`, etc.

Semantic + risk tokens are registered as `--color-*` utilities: `evidence`,
`inference`, `commit`, `branch`, `decision-notes`, `thread`,
`risk-critical/high/medium/low/safe-{bg,border,text}`.

## Provenance

- v2.0 authored 2026-08-06: bronze obsidian tokens (dark-only) adopted from
  `stitch_devbraid_design_system` (bronze_obsidian/DESIGN.md + page mockups).
- Supersedes v1.0 (amber-on-near-black, 2026-08-05) and the earlier Launch UI /
  Blink DNA extraction.
- Token regeneration allowed only by explicit amendment of this file.
