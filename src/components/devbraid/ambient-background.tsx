'use client'

import { useSyncExternalStore } from 'react'
import { LiquidChrome } from '@/components/marketing/liquid-chrome'

function subscribeIsDark(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

function getIsDark(): boolean {
  if (typeof document === 'undefined') return true
  return document.documentElement.classList.contains('dark')
}

function subscribeReducedMotion(onChange: () => void) {
  const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
  mq.addEventListener('change', onChange)
  return () => mq.removeEventListener('change', onChange)
}

function getReducedMotion(): boolean {
  if (typeof window === 'undefined') return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

/**
 * Full-viewport ambient backdrop for the workbench.
 * Dark theme: subtle LiquidChrome liquid (graphite base, calm drift).
 * Light theme: static soft gradient. Reduced motion: static in both.
 */
export function AmbientBackground() {
  const isDark = useSyncExternalStore(subscribeIsDark, getIsDark, () => true)
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotion, () => false)

  if (isDark && !reducedMotion) {
    return (
      <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
        <LiquidChrome
          baseColor={[0.0157, 0.0196, 0.102]}
          speed={0.25}
          amplitude={0.35}
          frequencyX={2.5}
          frequencyY={1.5}
          interactive={false}
          className="h-full w-full opacity-70"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-transparent to-background/70" />
      </div>
    )
  }

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed inset-0 -z-10 bg-background"
      style={{
        backgroundImage: isDark
          ? undefined
          : 'radial-gradient(120% 100% at 50% 0%, #FBBF2414 0%, transparent 60%)',
      }}
    />
  )
}
