import type { ReactNode } from 'react'

export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
      {children}
    </div>
  )
}
