# Design — DevBraid

Canonical design system: **DevBraid Design System v1.0** (locked 2026-08-05).

Future Hallmark runs and design work read this file first; pages and components
defer to it. Amend intentionally — the file is the rule.

---

# Design System v1.0

## Design Philosophy

DevBraid is not another AI chatbot. It is an engineering workspace.

Every design decision should reinforce:

- Trust
- Clarity
- Evidence
- Documentation
- Engineering quality

The UI should feel closer to reading an engineering design document than
browsing a marketing website.

Primary inspirations: ASCII Magic, Raycast, Linear, Vercel, GitHub, Cursor,
OpenCode.

## Design Principles

- **Calm Interface** — no unnecessary visual noise; the interface disappears behind the work.
- **Evidence First** — evidence is the product; it always receives stronger visual hierarchy than AI-generated text.
- **Readability Over Decoration** — typography is the primary visual language; whitespace over borders; hierarchy over colors.
- **Engineering Feel** — the product resembles an IDE mixed with GitHub documentation; never a generic AI SaaS dashboard.

## Typography

### Fonts
- **Primary:** Inter Variable (400/500/600/700/800/900) — body, navigation, cards, forms, buttons, documentation.
- **Code:** JetBrains Mono (14px/500) — commit IDs, branch names, file paths, evidence IDs, stack traces, JSON, API payloads. Never use monospace for paragraphs.

### Scale
| Token | Size | Weight | Notes |
|-------|------|--------|-------|
| Hero | 72px | 900 | letter-spacing -0.06em |
| Page Heading | 48px | 800 | |
| Section | 36px | 700 | |
| Card Title | 24px | 700 | |
| Subheading | 20px | 600 | |
| Body | 16px | 400 | line-height 1.65 |
| Caption | 13px | 400 | |
| Mono | 14px | 500 | |

### Hierarchy
Hero → Page → Section → Card → Paragraph → Evidence → Metadata

## Layout

- Content width: 1280px max (`--max-content: 80rem`)
- Documentation: 68ch max (`--measure: 68ch`)
- Spacing scale: 4/8/12/16/24/32/48/64/96
- Corner radius: controls 6px, cards 8px, panels 10px
- Borders: 1px hairline only. Avoid heavy shadows.

## Color

Dark-first. Minimal. One primary accent. No rainbow dashboards. Color
communicates meaning, never decoration.

### Dark Theme
| Token | Value |
|-------|-------|
| Background | `#09090B` |
| Surface | `#111113` |
| Secondary Surface | `#18181B` |
| Elevated Surface | `#1F1F23` |
| Border | `rgba(255,255,255,0.08)` |
| Primary Text | `#FAFAFA` |
| Secondary Text | `#A1A1AA` |
| Muted | `#71717A` |
| Primary Accent | `#A68B3A` |
| Hover Accent | `#C9A84C` |
| Focus Ring | `#D4AF37` |

### Light Theme
| Token | Value |
|-------|-------|
| Background | `#FAFAFA` |
| Surface | `#F4F4F5` |
| Secondary Surface | `#FFFFFF` |
| Border | `#E4E4E7` |
| Primary Text | `#18181B` |
| Secondary Text | `#52525B` |
| Muted | `#71717A` |
| Primary Accent | `#C9A84C` |
| Hover Accent | `#D9B75D` |
| Focus Ring | `#B58B22` |

### Semantic Colors
Success `#22C55E` · Info `#3B82F6` · Warning `#F59E0B` · Error `#EF4444`

### DevBraid-Specific
- Evidence — Gold `#C9A84C`
- Inference — Muted Violet `#8B5CF6`
- Commit — Blue `#3B82F6`
- Branch — Slate `#64748B`
- Decision Notes — Emerald `#10B981`
- Thread — Gold `#A68B3A`

### Risk Levels
| Level | Background | Border | Text |
|-------|-----------|--------|------|
| Critical | `#450A0A` | `#B91C1C` | `#FCA5A5` |
| High | `#4C1D06` | `#EA580C` | `#FDBA74` |
| Medium | `#422006` | `#F59E0B` | `#FCD34D` |
| Low | `#052E16` | `#22C55E` | `#BBF7D0` |
| Safe | `#022C22` | `#10B981` | `#A7F3D0` |

## Components

### Buttons
Height 40px · radius 6px · variants: primary (gold), secondary (surface), ghost (transparent), danger (red)

### Cards
Padding 24px · hairline border · no elevation

### Inputs
Height 40px · radius 6px · gold focus ring

### Tables
Header 14px semibold · body 14px regular · mono for IDs

### Navigation
Sidebar 15px medium · topbar 14px medium

### Markdown
GitHub-style: H1 40px, H2 32px, H3 24px, paragraph 16px, line-height 1.8, code in JetBrains Mono

## Motion

Minimal. Duration 150–250ms. Use: hover, focus, page transitions, expand/collapse.
Avoid: bounce, elastic, overshoot, large entrance animations.

## Accessibility

- Minimum WCAG AA contrast
- Visible keyboard focus
- 44px touch targets
- Never rely on color alone

## Things to Avoid

❌ Multiple accent colors · ❌ Large gradients · ❌ Glassmorphism · ❌ Heavy
shadows · ❌ Rounded pills everywhere · ❌ Neon colors · ❌ Excessive
animations · ❌ Marketing-style UI

---

## Token Implementation

`src/index.css` is the source of truth. Tailwind v4 `@theme inline` maps tokens
to utilities. Component markup consumes `bg-surface`, `text-muted-foreground`,
`border-hairline`, `bg-primary`, `ring-ring`, `text-hero`, `text-page`, etc.

Semantic + risk tokens are registered as `--color-*` utilities: `evidence`,
`inference`, `commit`, `branch`, `decision-notes`, `thread`,
`risk-critical/high/medium/low/safe-{bg,border,text}`.

## Provenance

- v1.0 authored by the team (2026-08-05) as the single canonical design rule.
- Supersedes the earlier Launch UI / Blink DNA extraction (URL-mode study of
  launchuicomponents.com + blink.daisyui.com, 2026-08-04). Launch UI remains a
  reference for marketing-page structure; v1.0 governs all tokens, type,
  spacing, motion, and component sizing.
- Token regeneration allowed only by explicit amendment of this file.
