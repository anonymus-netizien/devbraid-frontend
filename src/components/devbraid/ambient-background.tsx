'use client'

import { useSyncExternalStore } from 'react'

function subscribeIsDark(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

function getIsDark(): boolean {
  if (typeof document === 'undefined') return true
  return document.documentElement.classList.contains('dark')
}

/**
 * Full-viewport ambient backdrop for the workbench.
 * Dark theme: graphite base with a soft gold wash (rebrand accent).
 * Light theme: soft gold radial over background. Static in both.
 */
export function AmbientBackground() {
  const isDark = useSyncExternalStore(subscribeIsDark, getIsDark, () => true)

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-background"
      style={{
        backgroundImage: isDark
          ? 'radial-gradient(100% 55% at 50% -5%, #FBBF241A 0%, transparent 60%), radial-gradient(70% 45% at 50% 108%, #FBBF240F 0%, transparent 60%)'
          : 'radial-gradient(120% 100% at 50% 0%, #FBBF2414 0%, transparent 60%)',
      }}
    />
  )
}
