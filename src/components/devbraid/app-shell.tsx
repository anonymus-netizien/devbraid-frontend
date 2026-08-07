import { useState, useEffect, type ReactNode } from 'react'
import { Link, useRouterState, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import {
  LayoutDashboard,
  GitPullRequest,
  FileText,
  BookOpen,
  Github,
  Settings,
  Search,
  Menu,
  X,
  LogOut,
} from 'lucide-react'
import { Toaster } from 'sonner'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { CommandPalette, useCommandPalette } from './command-palette'
import { AmbientBackground } from './ambient-background'
import { shortcutLabel } from '@/lib/platform'

const navGroups = [
  {
    label: 'Workspace',
    items: [
      { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/threads', label: 'Change Threads', icon: GitPullRequest },
      { to: '/notes', label: 'Decision Notes', icon: FileText },
      { to: '/briefs', label: 'Change Briefs', icon: BookOpen },
    ],
  },
  {
    label: 'Platform',
    items: [
      { to: '/connections', label: 'GitHub Connections', icon: Github },
      { to: '/settings', label: 'Settings', icon: Settings },
    ],
  },
]

interface AppShellProps {
  children: ReactNode
}

function crumbsFor(pathname: string): { label: string; to?: string }[] {
  if (pathname === '/' || pathname === '/dashboard') return [{ label: 'Dashboard' }]
  const parts = pathname.split('/').filter(Boolean)
  const first = parts[0]
  const map: Record<string, string> = {
    threads: 'Change Threads',
    notes: 'Decision Notes',
    briefs: 'Change Briefs',
    connections: 'GitHub Connections',
    settings: 'Settings',
    dashboard: 'Dashboard',
  }
  const out: { label: string; to?: string }[] = [{ label: map[first] ?? first, to: `/${first}` }]
  if (parts.length > 1) out.push({ label: parts.slice(1).join('/') })
  return out
}

export function AppShell({ children }: AppShellProps) {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const navigate = useNavigate()
  const [navOpen, setNavOpen] = useState(false)
  const { user, logout } = useAuth()
  const queryClient = useQueryClient()
  const { open: paletteOpen, setOpen: setPaletteOpen } = useCommandPalette()

  // Close mobile nav on route change
  useEffect(() => setNavOpen(false), [pathname])

  const handleSignOut = async () => {
    await queryClient.cancelQueries()
    queryClient.clear()
    await logout()
    navigate({ to: '/auth/login', search: { redirect: undefined }, replace: true })
  }

  const userInitials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : user?.email
      ? user.email.substring(0, 2).toUpperCase()
      : 'DB'

  const crumbs = crumbsFor(pathname)

  return (
    <div className="relative flex h-dvh text-foreground">
      {/* Ambient backdrop — liquid in dark, soft gradient in light */}
      <AmbientBackground />

      {/* Desktop sidebar */}
      <aside className="relative hidden w-64 shrink-0 flex-col bg-background lg:flex">
        <div className="flex h-14 items-center gap-2.5 px-5">
          <div className="grid size-6 place-items-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">
            DB
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[13px] font-semibold tracking-tight">DevBraid</span>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground">
              Change threads
            </span>
          </div>
        </div>

        <nav className="flex-1 space-y-6 overflow-y-auto p-3">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {group.label}
              </div>
              {group.items.map((item) => {
                const active =
                  pathname === item.to || (item.to !== '/dashboard' && pathname.startsWith(item.to))
                const Icon = item.icon
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[15px] font-medium transition-colors',
                      active
                        ? 'bg-surface text-foreground'
                        : 'text-muted-foreground hover:bg-surface/60 hover:text-foreground',
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                )
              })}
            </div>
          ))}
        </nav>

        {/* User section */}
        <div className="p-3">
          <div className="flex items-center gap-3 rounded-md px-2 py-1.5">
            <div className="grid size-7 place-items-center rounded-full border border-hairline bg-surface text-[10px] font-semibold uppercase">
              {userInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium">
                {user?.fullName || user?.email || 'Developer'}
              </p>
              <p className="truncate text-[10px] text-muted-foreground">
                {user?.email || 'Not signed in'}
              </p>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              aria-label="Sign out"
              className="grid size-7 place-items-center rounded text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              <LogOut className="size-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <div
        className={cn(
          'fixed inset-0 z-40 lg:hidden',
          navOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
        aria-hidden={!navOpen}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setNavOpen(false)}
          className={cn(
            'absolute inset-0 cursor-default bg-background/70 backdrop-blur-sm transition-opacity focus:outline-none',
            navOpen ? 'opacity-100' : 'opacity-0',
          )}
        />
        <aside
          className={cn(
            'absolute left-0 top-0 flex h-dvh w-72 max-w-[85vw] flex-col bg-background shadow-2xl transition-transform',
            navOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex h-14 items-center gap-2.5 px-5">
            <div className="grid size-6 place-items-center rounded-md bg-primary text-[10px] font-bold text-primary-foreground">
              DB
            </div>
            <span className="text-[13px] font-semibold tracking-tight">DevBraid</span>
            <button
              type="button"
              onClick={() => setNavOpen(false)}
              className="ml-auto grid size-7 place-items-center rounded text-muted-foreground hover:bg-surface hover:text-foreground"
              aria-label="Close menu"
            >
              <X className="size-3.5" />
            </button>
          </div>
          <nav className="flex-1 space-y-6 overflow-y-auto p-3">
            {navGroups.map((group) => (
              <div key={group.label} className="space-y-1">
                <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  {group.label}
                </div>
                {group.items.map((item) => {
                  const active = pathname === item.to || pathname.startsWith(item.to)
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      onClick={() => setNavOpen(false)}
                      className={cn(
                        'flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[15px] font-medium transition-colors',
                        active
                          ? 'bg-surface text-foreground'
                          : 'text-muted-foreground hover:bg-surface/60 hover:text-foreground',
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{item.label}</span>
                    </Link>
                  )
                })}
              </div>
            ))}
          </nav>
        </aside>
      </div>

      {/* Main content */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-3 bg-background/85 px-4 backdrop-blur sm:px-6">
          <div className="flex min-w-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setNavOpen(true)}
              aria-label="Open navigation"
              className="grid size-10 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground lg:hidden"
            >
              <Menu className="size-4" />
            </button>
            <div className="flex min-w-0 items-center gap-2 text-sm">
              {crumbs.map((c, i) => (
                <span key={c.label} className="flex min-w-0 items-center gap-2">
                  {i > 0 && <span className="text-muted-foreground/60">/</span>}
                  {c.to && i < crumbs.length - 1 ? (
                    <Link
                      to={c.to}
                      className="truncate font-medium text-muted-foreground hover:text-foreground"
                    >
                      {c.label}
                    </Link>
                  ) : (
                    <span className="truncate font-medium">{c.label}</span>
                  )}
                </span>
              ))}
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search"
              className="hidden h-10 items-center gap-2 rounded-md border border-hairline bg-surface/60 px-2.5 text-sm text-muted-foreground transition-colors hover:border-hairline/80 hover:bg-surface sm:inline-flex"
            >
              <Search className="size-3.5" />
              <span>Search or jump to</span>
              <kbd className="ml-4 rounded border border-hairline bg-background px-1.5 py-0.5 font-mono text-[10px]">
                {shortcutLabel()}
              </kbd>
            </button>
            <button
              type="button"
              onClick={() => setPaletteOpen(true)}
              aria-label="Search"
              className="grid size-10 place-items-center rounded-md border border-hairline bg-surface/60 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground sm:hidden"
            >
              <Search className="size-3.5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="min-w-0 flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
            {children}
          </div>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      <Toaster position="bottom-right" />
    </div>
  )
}
