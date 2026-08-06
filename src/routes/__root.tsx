import { AnimatePresence } from 'framer-motion'
import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { AppShell } from '../components/devbraid/app-shell'
import { PageTransition } from '../components/ui/page-transition'

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isBare = pathname === '/' || pathname.startsWith('/auth')

  if (isBare) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        <AnimatePresence mode="wait">
          <PageTransition key={pathname}>
            <Outlet />
          </PageTransition>
        </AnimatePresence>
        <Toaster position="bottom-right" />
      </div>
    )
  }

  return (
    <AppShell>
      <AnimatePresence mode="wait">
        <PageTransition key={pathname}>
          <Outlet />
        </PageTransition>
      </AnimatePresence>
    </AppShell>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
