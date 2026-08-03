# UI Overhaul Phase — Tickets

Branch: `feature/ui-overhaul` → merge to `develop` when all tickets done + verified.

## Ticket 01 — Theme system (light + dark, toggle, persistence)

- [ ] daisyui `themes: false` — components source colors from our tokens only
- [ ] `:root` = light palette (warm light, same amber identity); `.dark` = current dark palette
- [ ] `useTheme` hook: localStorage `devbraid-theme` + `prefers-color-scheme` + system toggle
- [ ] No-flash inline script in `index.html` before first paint
- [ ] Toggle control in app shell (desktop sidebar + mobile header)
- [ ] Landing + auth routes forced `.dark` (cinematic marketing identity preserved)

## Ticket 02 — File Changes panel redesign

- [ ] Extract `FileChangesPanel` component from `threads.$id.tsx`
- [ ] Diff-bar visualization (proportional +/− per file), status badges, path breadcrumbs
- [ ] Typed against `ChangedFileDto` from generated schema
- [ ] Commits list gets matching typographic treatment

## Ticket 03 — Cross-theme polish pass

- [ ] Contrast/severity token check in light mode (danger/warning/success/info triplets)
- [ ] daisyui components (btn, stats, badge) verified in both themes
- [ ] Empty/error states copy pass
