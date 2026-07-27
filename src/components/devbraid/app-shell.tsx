import { Link, Outlet, useRouterState } from '@tanstack/react-router'
import { cn } from '../../lib/utils'
import {
  LayoutDashboard,
  GitPullRequest,
  FileText,
  BookOpen,
  Github,
  Settings,
  Menu,
  Search,
  LogOut,
} from 'lucide-react'
import { useEffect, useState } from 'react'
import { CommandPalette, useCommandPalette } from './command-palette'

const items = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'Workspace' },
  { to: '/threads', label: 'Change Threads', icon: GitPullRequest, group: 'Workspace' },
  { to: '/notes', label: 'Decision Notes', icon: FileText, group: 'Workspace' },
  { to: '/briefs', label: 'Change Briefs', icon: BookOpen, group: 'Workspace' },
  { to: '/connections', label: 'GitHub Connections', icon: Github, group: 'Platform' },
  { to: '/settings', label: 'Settings', icon: Settings, group: 'Platform' },
] as const

function useActivePath() {
  return useRouterState({ select: (s) => s.location.pathname })
}

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useActivePath()
  const groups = ['Workspace', 'Platform'] as const
  return (
    <>
      <div className="flex h-14 items-center gap-2.5 border-b border-hairline px-5">
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
        {groups.map((g) => (
          <div key={g} className="space-y-1">
            <div className="px-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {g}
            </div>
            {items
              .filter((i) => i.group === g)
              .map((i) => {
                const active =
                  pathname === i.to ||
                  (i.to !== '/dashboard' && pathname.startsWith(i.to))
                const Icon = i.icon
                return (
                  <Link
                    key={i.to}
                    to={i.to}
                    onClick={onNavigate}
                    className={cn(
                      'flex items-center gap-2.5 rounded-md px-3 py-1.5 text-[13px] transition-colors',
                      active
                        ? 'bg-surface text-foreground'
                        : 'text-muted-foreground hover:bg-surface/60 hover:text-foreground',
                    )}
                  >
                    <Icon className="size-4 shrink-0" />
                    <span className="truncate">{i.label}</span>
                  </Link>
                )
              })}
          </div>
        ))}
      </nav>

      <div className="border-t border-hairline p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-1.5">
          <div className="grid size-7 place-items-center rounded-full border border-hairline bg-surface text-[10px] font-semibold uppercase">
            U
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">User</p>
            <p className="truncate text-[10px] text-muted-foreground">ROLE_USER</p>
          </div>
          <Link
            to="/auth/login"
            aria-label="Sign out"
            className="grid size-7 place-items-center rounded text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
          >
            <LogOut className="size-3.5" />
          </Link>
        </div>
      </div>
    </>
  )
}

function DesktopSidebar() {
  return (
    <aside className="hidden w-64 shrink-0 flex-col border-r border-hairline bg-background lg:flex">
      <SidebarContent />
    </aside>
  )
}

function MobileSidebar({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <div
      className={cn(
        'fixed inset-0 z-40 lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none',
      )}
      aria-hidden={!open}
    >
      <div
        onClick={onClose}
        className={cn(
          'absolute inset-0 bg-background/70 backdrop-blur-sm transition-opacity',
          open ? 'opacity-100' : 'opacity-0',
        )}
      />
      <aside
        className={cn(
          'absolute left-0 top-0 flex h-dvh w-72 max-w-[85vw] flex-col border-r border-hairline bg-background shadow-2xl transition-transform',
          open ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <SidebarContent onNavigate={onClose} />
      </aside>
    </div>
  )
}

function crumbsFor(pathname: string): { label: string; to?: string }[] {
  if (pathname === '/' || pathname === '/dashboard')
    return [{ label: 'Dashboard' }]
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
  const out: { label: string; to?: string }[] = [
    { label: map[first] ?? first, to: `/${first}` },
  ]
  if (parts.length > 1) out.push({ label: parts.slice(1).join('/') })
  return out
}

function TopBar({
  onOpenPalette,
  onOpenNav,
}: {
  onOpenPalette: () => void
  onOpenNav: () => void
}) {
  const pathname = useActivePath()
  const crumbs = crumbsFor(pathname)

  return (
    <header className="sticky top-0 z-10 flex h-14 shrink-0 items-center justify-between gap-3 border-b border-hairline bg-background/85 px-4 backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          onClick={onOpenNav}
          aria-label="Open navigation"
          className="grid size-8 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-surface hover:text-foreground lg:hidden"
        >
          <Menu className="size-4" />
        </button>
        <div className="flex min-w-0 items-center gap-2 text-xs">
          {crumbs.map((c, i) => (
            <span key={i} className="flex min-w-0 items-center gap-2">
              {i > 0 && <span className="text-muted-foreground/60">/</span>}
              {c.to && i < crumbs.length - 1 ? (
                <Link
                  to={c.to}
                  className="truncate text-muted-foreground hover:text-foreground"
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
          onClick={onOpenPalette}
          aria-label="Search"
          className="grid size-8 place-items-center rounded-md border border-hairline bg-surface/60 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground sm:hidden"
        >
          <Search className="size-3.5" />
        </button>
        <button
          onClick={onOpenPalette}
          className="hidden h-8 items-center gap-2 rounded-md border border-hairline bg-surface/60 px-2.5 text-xs text-muted-foreground transition-colors hover:border-hairline/80 hover:bg-surface sm:inline-flex"
        >
          <Search className="size-3.5" />
          <span>Search or jump to</span>
          <kbd className="ml-4 rounded border border-hairline bg-background px-1.5 py-0.5 font-mono text-[10px]">
            ⌘K
          </kbd>
        </button>
      </div>
    </header>
  )
}

export function AppShell() {
  const { open, setOpen } = useCommandPalette()
  const [navOpen, setNavOpen] = useState(false)

  const pathname = useActivePath()
  useEffect(() => setNavOpen(false), [pathname])

  return (
    <div className="flex h-dvh w-full bg-background text-foreground">
      <DesktopSidebar />
      <MobileSidebar open={navOpen} onClose={() => setNavOpen(false)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar
          onOpenPalette={() => setOpen(true)}
          onOpenNav={() => setNavOpen(true)}
        />
        <main className="min-w-0 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <CommandPalette open={open} onOpenChange={setOpen} />
    </div>
  )
}
