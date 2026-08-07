'use client'

/**
 * Full-viewport ambient backdrop for the workbench.
 * Dark-only (bronze obsidian): graphite canvas with a soft gold wash.
 */
export function AmbientBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-background"
      style={{
        backgroundImage:
          'radial-gradient(100% 55% at 50% -5%, #DFC38C1A 0%, transparent 60%), radial-gradient(70% 45% at 50% 108%, #DFC38C0F 0%, transparent 60%)',
      }}
    />
  )
}
