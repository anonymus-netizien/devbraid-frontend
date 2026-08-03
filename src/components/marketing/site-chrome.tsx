import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Braces, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { label: 'How it works', href: '#flow' },
  { label: 'Features', href: '#features' },
  { label: 'Documentation', href: '#docs' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-colors duration-300',
        scrolled
          ? 'border-b border-hairline bg-background/85 backdrop-blur-xl'
          : 'border-b border-transparent',
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-6 px-4 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded bg-primary text-primary-foreground">
            <Braces className="size-3.5" />
          </span>
          <span className="text-sm font-semibold tracking-tight">DevBraid</span>
        </Link>

        <nav className="ml-2 hidden items-center gap-5 md:flex">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className="text-xs text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            to="/auth/login"
            className="hidden rounded-md px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
          >
            Sign in
          </Link>
          <Link
            to="/auth/register"
            className="inline-flex items-center rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Start free
          </Link>
          <button
            type="button"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
            className="grid size-8 place-items-center rounded-md border border-hairline text-muted-foreground md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-hairline bg-background/95 px-4 py-3 backdrop-blur-xl md:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
            <Link
              to="/auth/login"
              onClick={() => setOpen(false)}
              className="rounded-md px-2 py-2 text-sm text-muted-foreground hover:bg-surface hover:text-foreground"
            >
              Sign in
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export function SiteFooter() {
  return (
    <footer className="border-t border-hairline">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:px-6 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="grid size-5 place-items-center rounded bg-primary text-primary-foreground">
              <Braces className="size-3" />
            </span>
            <span className="text-sm font-semibold tracking-tight">DevBraid</span>
          </div>
          <p className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
            Evidence-backed change briefs, braided from your commits and your reasoning.
          </p>
        </div>
        <nav className="grid grid-cols-2 gap-x-10 gap-y-2 text-xs sm:grid-cols-3">
          <Link to="/dashboard" className="text-muted-foreground hover:text-foreground">
            Dashboard
          </Link>
          <Link to="/threads" className="text-muted-foreground hover:text-foreground">
            Change threads
          </Link>
          <Link to="/notes" className="text-muted-foreground hover:text-foreground">
            Decision notes
          </Link>
          <Link to="/briefs" className="text-muted-foreground hover:text-foreground">
            Change briefs
          </Link>
          <Link
            to="/connections"
            search={{}}
            className="text-muted-foreground hover:text-foreground"
          >
            Connections
          </Link>
        </nav>
      </div>
      <div className="border-t border-hairline px-4 py-4 text-center font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
        &copy; {new Date().getFullYear()} DevBraid &middot; built for reviewers
      </div>
    </footer>
  )
}
