# UI Overhaul Phase — Tickets

Branch: `feature/ui-overhaul` → merge to `develop` when all tickets done + verified.

## Ticket 01 — Theme system (light + dark, toggle, persistence)

- [x] daisyui `themes: false` — components source colors from our tokens only
- [x] `:root` = light palette (warm light, same amber identity); `.dark` = current dark palette
- [x] `useTheme` hook: localStorage `devbraid-theme` + `prefers-color-scheme` + system toggle
- [x] No-flash inline script in `index.html` before first paint
- [x] Toggle control in app shell (desktop sidebar + mobile header)
- [x] Landing + auth routes forced `.dark` (cinematic marketing identity preserved)

## Ticket 02 — File Changes panel redesign

- [x] Extract `FileChangesPanel` component from `threads.$id.tsx`
- [x] Diff-bar visualization (proportional +/− per file), status badges, path breadcrumbs
- [x] Typed against `ChangedFileDto` from generated schema
- [x] Commits list gets matching typographic treatment

## Ticket 03 — Cross-theme polish pass

- [x] Contrast/severity token check in light mode (danger/warning/success/info triplets)
- [x] daisyui components (btn, stats, badge) verified in both themes
- [x] Empty/error states copy pass
