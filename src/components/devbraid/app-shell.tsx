import { useState, type ReactNode } from 'react'
import { Link, useRouterState, useNavigate } from '@tanstack/react-router'
import { LayoutDashboard, GitPullRequest, FileText, BookOpen, Github, Settings, Search, Menu, X, LogOut } from 'lucide-react'
import { Toaster } from 'sonner'
import { cn } from '../../lib/utils'
import { useAuth } from '../../context/AuthContext'
import authService from '../../services/auth.service'

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

export function AppShell({ children }: AppShellProps) {
  const { location } = useRouterState()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const { user, logout } = useAuth()

  if (location.pathname.startsWith('/auth')) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {children}
        <Toaster position="bottom-right" />
      </div>
    )
  }

  const handleSignOut = async () => {
    try {
      await authService.logout()
    } finally {
      logout()
      navigate({ to: '/auth/login' })
    }
  }

  const userInitials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').toUpperCase()
    : user?.email
      ? user.email.substring(0, 2).toUpperCase()
      : 'DB'

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:border-r lg:border-hairline lg:bg-surface">
        <div className="flex items-center gap-2 px-6 py-4 border-b border-hairline">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-sm font-bold text-primary-foreground">DB</span>
          </div>
          <div>
            <p className="text-sm font-semibold">DevBraid</p>
            <p className="text-xs text-muted-foreground">Change threads</p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-2 text-[11px] font-mono uppercase tracking-wider text-muted-foreground/80">{group.label}</p>
              <div className="space-y-1">
                {group.items.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                      location.pathname === item.to
                        ? 'bg-surface-2 text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-surface-2/50'
                    )}
                  >
                    <item.icon className="h-4 w-4" aria-hidden="true" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </nav>
        <div className="border-t border-hairline px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-full bg-surface-2 flex items-center justify-center text-sm font-medium">
                {userInitials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate">{user?.fullName || user?.email || 'Developer'}</p>
                <p className="text-xs text-muted-foreground truncate">{user?.email || 'Logged in'}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={handleSignOut}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} aria-hidden="true" />
          <aside className="absolute inset-y-0 left-0 w-64 bg-surface border-r border-hairline">
            <div className="flex items-center justify-between px-6 py-4 border-b border-hairline">
              <span className="text-sm font-semibold">DevBraid</span>
              <button type="button" onClick={() => setMobileOpen(false)} className="p-1 rounded-md text-muted-foreground hover:text-foreground" aria-label="Close menu">
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
            <nav className="px-3 py-4 space-y-6">
              {navGroups.map((group) => (
                <div key={group.label}>
                  <p className="px-3 mb-2 text-xs font-mono uppercase tracking-widest text-muted-foreground">{group.label}</p>
                  <div className="space-y-1">
                    {group.items.map((item) => (
                      <Link
                        key={item.to}
                        to={item.to}
                        onClick={() => setMobileOpen(false)}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors',
                          location.pathname === item.to
                            ? 'bg-surface-2 text-foreground'
                            : 'text-muted-foreground hover:text-foreground hover:bg-surface-2/50'
                        )}
                      >
                        <item.icon className="h-4 w-4" aria-hidden="true" />
                        {item.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </nav>
          </aside>
        </div>
      )}

      {/* Main content */}
      <div className="flex flex-col flex-1 min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-40 flex items-center h-14 px-4 border-b border-hairline bg-background">
          <button type="button" onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 rounded-md text-muted-foreground hover:text-foreground mr-3" aria-label="Open menu">
            <Menu className="h-5 w-5" aria-hidden="true" />
          </button>
          <div className="flex-1" />
          <button type="button" className="flex items-center gap-2 px-3 py-1.5 rounded border border-hairline bg-surface/80 text-xs font-mono text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors" aria-label="Search">
            <Search className="h-3.5 w-3.5" aria-hidden="true" />
            <span>find or command…</span>
            <kbd className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-surface-2 font-mono border border-hairline">⌘K</kbd>
          </button>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-5xl px-6 py-8">
            {children}
          </div>
        </main>
      </div>
      <Toaster position="bottom-right" />
    </div>
  )
}


