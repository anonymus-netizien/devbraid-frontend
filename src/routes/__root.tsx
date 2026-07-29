import { createRootRoute, Outlet, useRouterState } from '@tanstack/react-router'
import { Toaster } from 'sonner'
import { AppShell } from '../components/devbraid/app-shell'

function RootLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isBare = pathname === '/' || pathname.startsWith('/auth')

  if (isBare) {
    return (
      <div className="min-h-dvh bg-background text-foreground">
        <Outlet />
        <Toaster position="bottom-right" />
      </div>
    )
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
