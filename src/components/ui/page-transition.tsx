import { LazyMotion, domAnimation, m } from 'framer-motion'
import type { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  className?: string
}

const variants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

/**
 * Framer Motion page transition wrapper.
 * Wrap route content to get smooth fade + slide on every navigation.
 */
export function PageTransition({ children, className }: PageTransitionProps) {
  return (
    <LazyMotion features={domAnimation}>
      <m.div
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.32, ease: [0.05, 0.7, 0.1, 1] }}
        className={className}
      >
        {children}
      </m.div>
    </LazyMotion>
  )
}
