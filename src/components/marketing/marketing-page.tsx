import { useEffect, type ReactNode } from 'react'
import { SiteFooter, SiteHeader } from './site-chrome'

export function MarketingPage({ children }: { children: ReactNode }) {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])
  return (
    <div className="min-h-dvh bg-background">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  )
}
