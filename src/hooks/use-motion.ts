import { useEffect, useRef, useState } from 'react'

/**
 * Initialises Lenis smooth-scroll for the page lifecycle.
 * Call once at the top of a page component. Cleans up on unmount.
 */
export function useSmoothScroll() {
  useEffect(() => {
    const p = import('lenis').then(({ default: Lenis }) => new Lenis({ autoRaf: true }))
    return () => {
      p.then((l) => l.destroy())
    }
  }, [])
}

/**
 * IntersectionObserver-based scroll reveal.
 * Sets `data-revealed="true"` once the element enters the viewport.
 */
export function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.15 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return { ref, revealed }
}

/**
 * Reports the scroll progress (0–1) through the referenced element.
 * Useful for scroll-linked animations like the lifecycle flow rail.
 */
export function useScrollProgress<T extends HTMLElement>() {
  const ref = useRef<T>(null)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const onScroll = () => {
      const rect = el.getBoundingClientRect()
      const total = rect.height + window.innerHeight
      const passed = window.innerHeight - rect.top
      setProgress(Math.min(1, Math.max(0, passed / total)))
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return { ref, progress }
}
