# Plan: Align index.css tokens to DevBraid Design System v1.0

## Goal
Update src/index.css token values to match the new v1.0 design spec. No component file changes.

## File to edit
src/index.css — the only file changed.

## Changes

### 1. Surface hierarchy
Dark: --surface #18181B -> #111113, --surface-2 #27272A -> #18181B, --hairline #3F3F46 -> rgba(255,255,255,0.08), add --elevated: #1F1F23
Light: --surface #FFFFFF -> #F4F4F5, --surface-2 #F4F4F5 -> #FFFFFF, add --elevated: #FFFFFF

### 2. Primary accent + hover
Dark: --primary #C9A84C -> #A68B3A, --primary-hover #A68B3A -> #C9A84C, --primary-foreground oklch(0.16 0.005 264) -> oklch(0.16 0.02 60)
Light: --primary #A68B3A -> #C9A84C, --primary-hover #8A7230 -> #D9B75D

### 3. Ring / focus
Dark: --ring #C9A84C -> #D4AF37
Light: --ring #A68B3A -> #B58B22

### 4. Sidebar tokens
Dark: --sidebar-primary #C9A84C -> #A68B3A, --sidebar-ring #C9A84C -> #D4AF37, --sidebar-border #3F3F46 -> rgba(255,255,255,0.08)
Light: --sidebar-primary #A68B3A -> #C9A84C, --sidebar-ring #A68B3A -> #B58B22

### 5. Neutral accent
Dark: --neutral-accent #A68B3A -> #8A7230
Light: --neutral-accent #8A7230 -> #A68B3A

### 6. Remove elevation shadows
Delete --elevation-1, --elevation-2, --elevation-3 from both themes. Keep --glow-primary.

### 7. DevBraid semantic colors (new)
--evidence: #C9A84C; --inference: #8B5CF6; --commit: #3B82F6; --branch: #64748B; --decision-notes: #10B981; --thread: #A68B3A;

### 8. Risk-level tokens (new)
--risk-critical-bg/border/text, --risk-high-bg/border/text, --risk-medium-bg/border/text, --risk-low-bg/border/text, --risk-safe-bg/border/text

### 9. Typography scale tokens (new)
--text-hero: 4.5rem; --text-page: 3rem; --text-section: 2.25rem; --text-card: 1.5rem; --text-subheading: 1.25rem; --text-body: 1rem; --text-caption: 0.8125rem; --text-mono: 0.875rem;

### 10. Layout token (new)
--max-content: 80rem;

### 11. Reveal animation
Reduce from 500ms to 250ms.

### 12. Register in @theme inline
Map all new CSS vars to Tailwind color names.

## Validation
1. npx tsc --noEmit
2. npm run build
3. npx vitest run
