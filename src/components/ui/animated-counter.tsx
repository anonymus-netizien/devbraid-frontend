import { useEffect, useState } from 'react'
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useSpring,
} from 'framer-motion'
import { cn } from '@/lib/utils'

interface AnimatedCounterProps {
  /** Target number to count up to */
  to: number
  /** Duration in ms (used to calculate spring damping) — default 1400 */
  duration?: number
  /** Number of decimal places — default 0 for integers */
  decimals?: number
  /** Prefix string (e.g. "$") */
  prefix?: string
  /** Suffix string (e.g. "%") */
  suffix?: string
  /** CSS class */
  className?: string
  /** Whether to show the number with commas (e.g. 1,234) — default false */
  separator?: boolean
}

/**
 * Smooth animated counter using Framer Motion spring physics.
 * Inspired by React Bits CountUp and 21st.dev animated stats.
 *
 * Uses `useSpring` for natural deceleration (counts fast at first,
 * slows down towards the target) instead of linear RAF intervals.
 */
export function AnimatedCounter({
  to,
  duration = 1400,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  separator = false,
}: AnimatedCounterProps) {
  // Map duration to spring damping (longer duration = higher damping = slower)
  const damping = Math.max(20, Math.min(80, duration / 25))
  const stiffness = 100

  const [displayValue, setDisplayValue] = useState(0)
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { damping, stiffness })

  // Subscribe to spring changes so React re-renders the display
  useMotionValueEvent(spring, 'change', (latest) => {
    setDisplayValue(latest)
  })

  useEffect(() => {
    motionValue.set(to)
  }, [to, motionValue])

  const formatNumber = (n: number) => {
    const fixed = n.toFixed(decimals)
    if (!separator) return fixed
    const [int, dec] = fixed.split('.')
    const withCommas = int.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return dec ? `${withCommas}.${dec}` : withCommas
  }

  return (
    <motion.span
      className={cn('tabular-nums', className)}
      aria-live="polite"
      aria-atomic="true"
      aria-label={`${prefix}${formatNumber(to)}${suffix}`}
    >
      {prefix}{formatNumber(displayValue)}{suffix}
    </motion.span>
  )
}
