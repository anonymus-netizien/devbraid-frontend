import type { ReactNode } from 'react'
import { SiteFooter, SiteHeader } from './site-chrome'

export function MarketingPage({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
