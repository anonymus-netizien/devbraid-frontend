import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useReveal } from '@/hooks/use-motion'

/** Scroll-reveal wrapper. Children fade + rise once, then stay put. */
export function Reveal({
  children,
  delay = 0,
  className,
  as: Tag = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'section' | 'li' | 'header'
}) {
  const { ref, revealed } = useReveal<HTMLDivElement>()
  return (
    <Tag
      ref={ref as never}
      data-revealed={revealed}
      style={{ '--reveal-delay': `${delay}ms` } as React.CSSProperties}
      className={cn('reveal', className)}
    >
      {children}
    </Tag>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return <div className="font-mono text-xs uppercase tracking-[0.2em] text-primary">{children}</div>
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = 'left',
}: {
  eyebrow?: string
  title: string
  body?: string
  align?: 'left' | 'center'
}) {
  return (
    <Reveal className={cn('measure', align === 'center' && 'mx-auto text-center')}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <h2
        className={cn(
          'text-balance text-3xl font-bold tracking-tight md:text-4xl',
          eyebrow && 'mt-3',
        )}
      >
        {title}
      </h2>
      {body && (
        <p className="mt-4 text-pretty text-base leading-relaxed text-muted-foreground">{body}</p>
      )}
    </Reveal>
  )
}

/** Soft amber glow behind an illustration. */
export function GlowPlate({
  children,
  className,
  tone = 'primary',
}: {
  children: ReactNode
  className?: string
  tone?: 'primary' | 'danger' | 'info'
}) {
  const glow = tone === 'danger' ? 'bg-danger/20' : tone === 'info' ? 'bg-info/20' : 'bg-primary/20'
  return (
    <div className={cn('relative isolate', className)}>
      <div
        aria-hidden
        className={cn(
          'pointer-events-none absolute inset-[12%] -z-10 rounded-full blur-3xl grain-mask',
          glow,
        )}
      />
      {children}
    </div>
  )
}
