import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { AnimatePresence, LazyMotion, domAnimation, m } from 'framer-motion'
import {
  Braces,
  ChevronDown,
  Github,
  LayoutDashboard,
  Linkedin,
  LogOut,
  Menu,
  User,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { FooterBackgroundGradient, TextHoverEffect } from '@/components/ui/hover-footer'

const links = [
  { label: 'How it works', to: '/how-it-works' as const },
  { label: 'Features', to: '/features' as const },
  { label: 'Docs', to: '/docs' as const },
  { label: 'Pricing', to: '/pricing' as const },
]

function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

/** N5 — Floating pill. Detached frosted glass chip; hides on scroll-down, returns on scroll-up. */
export function SiteHeader() {
  const [visible, setVisible] = useState(true)
  const [open, setOpen] = useState(false)
  const [accountOpen, setAccountOpen] = useState(false)
  const { user, isAuthenticated, logout } = useAuth()

  useEffect(() => {
    let lastY = window.scrollY
    const onScroll = () => {
      const y = window.scrollY
      setVisible(y <= lastY || y < 80)
      lastY = y
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const userInitials = user?.fullName
    ? user.fullName
        .split(' ')
        .map((n: string) => n[0])
        .join('')
        .toUpperCase()
    : user?.email
      ? user.email.substring(0, 2).toUpperCase()
      : 'DB'

  const handleSignOut = async () => {
    setAccountOpen(false)
    await logout()
  }

  const avatar = (
    <button
      type="button"
      onClick={() => setAccountOpen((v) => !v)}
      aria-label="Account menu"
      aria-expanded={accountOpen}
      className="flex items-center gap-2 rounded-full border border-hairline bg-surface/60 py-1 pl-1 pr-2 transition-colors hover:bg-surface"
    >
      <span className="grid size-7 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
        {userInitials}
      </span>
      <ChevronDown className="size-3 text-muted-foreground" />
    </button>
  )

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 px-4 pt-3 transition-transform duration-300 sm:px-6',
        visible ? 'translate-y-0' : '-translate-y-[calc(100%+0.75rem)]',
      )}
    >
      <div className="mx-auto flex h-12 max-w-[720px] items-center justify-between gap-3 rounded-full border border-hairline bg-background/75 px-4 shadow-[0_8px_32px_-16px_rgba(0,0,0,0.4)] backdrop-blur-xl sm:px-5">
        <Link to="/" onClick={scrollToTop} className="flex shrink-0 items-center gap-2 py-3 -my-3">
          <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
            <Braces className="size-3.5" />
          </span>
          <span className="text-sm font-semibold tracking-tight text-foreground">DevBraid</span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Site">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="rounded-full px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <div className="relative hidden items-center sm:flex">
            {isAuthenticated && avatar}
            {/* ponytail: backdrop has no exit animation, so it lives outside AnimatePresence,
                which stays mounted to observe the menu's exit */}
            {isAuthenticated && accountOpen && (
              <button
                type="button"
                aria-label="Close menu"
                onClick={() => setAccountOpen(false)}
                className="fixed inset-0 z-40 cursor-default focus:outline-none"
              />
            )}
            <LazyMotion features={domAnimation}>
              <AnimatePresence>
                {isAuthenticated && accountOpen && (
                  <m.div
                    key="account-menu"
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 top-full z-50 mt-2 w-52 overflow-hidden rounded-xl border border-hairline bg-background/95 p-1.5 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.45)] backdrop-blur-xl"
                  >
                    <div className="border-b border-hairline px-3 py-2">
                      <p className="truncate text-xs font-medium text-foreground">
                        {user?.fullName || 'Developer'}
                      </p>
                      <p className="truncate text-[10px] text-muted-foreground">
                        {user?.email || 'Not signed in'}
                      </p>
                    </div>
                    <Link
                      to="/dashboard"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                    >
                      <LayoutDashboard className="size-3.5" /> Dashboard
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setAccountOpen(false)}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                    >
                      <User className="size-3.5" /> Profile
                    </Link>
                    <button
                      type="button"
                      onClick={handleSignOut}
                      className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
                    >
                      <LogOut className="size-3.5" /> Sign out
                    </button>
                  </m.div>
                )}
              </AnimatePresence>
            </LazyMotion>
          </div>
          {!isAuthenticated && (
            <>
              <Link
                to="/auth/login"
                search={{ redirect: undefined }}
                className="hidden rounded-full px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:inline-flex"
              >
                Log in
              </Link>
              <Link
                to="/auth/register"
                className="inline-flex h-11 items-center rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover md:h-9"
              >
                Start free
              </Link>
            </>
          )}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="grid size-11 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-surface hover:text-foreground md:hidden"
          >
            {open ? <X className="size-4" /> : <Menu className="size-4" />}
          </button>
        </div>
      </div>

      {open && (
        <nav
          className="mx-auto mt-2 max-w-[720px] rounded-2xl border border-hairline bg-background/95 p-2 shadow-[0_16px_48px_-24px_rgba(0,0,0,0.45)] backdrop-blur-xl md:hidden"
          aria-label="Site"
        >
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="block rounded-xl px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <>
              <Link
                to="/dashboard"
                onClick={() => setOpen(false)}
                className="mt-1 block rounded-xl border-t border-hairline px-4 py-2.5 text-sm text-foreground"
              >
                Dashboard
              </Link>
              <button
                type="button"
                onClick={handleSignOut}
                className="block w-full rounded-xl px-4 py-2.5 text-left text-sm text-muted-foreground"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link
              to="/auth/login"
              search={{ redirect: undefined }}
              onClick={() => setOpen(false)}
              className="mt-1 block rounded-xl border-t border-hairline px-4 py-2.5 text-sm text-foreground"
            >
              Log in
            </Link>
          )}
        </nav>
      )}
    </header>
  )
}

const footerLinkGroups = [
  {
    title: 'Product',
    links: [
      { label: 'How it works', to: '/how-it-works' as const },
      { label: 'Features', to: '/features' as const },
      { label: 'Documentation', to: '/docs' as const },
      { label: 'Pricing', to: '/pricing' as const },
    ],
  },
  {
    title: 'Workspace',
    links: [
      { label: 'Change Threads', to: '/threads' as const },
      { label: 'Decision Notes', to: '/notes' as const },
      { label: 'Change Briefs', to: '/briefs' as const },
      { label: 'GitHub Connections', to: '/connections' as const },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', to: '/about' as const },
      { label: 'Dashboard', to: '/dashboard' as const },
      { label: 'GitHub Connections', to: '/connections' as const },
      { label: 'Settings', to: '/settings' as const },
    ],
  },
]

const socialLinks = [
  { icon: <Github size={18} />, label: 'GitHub', href: 'https://github.com/anonymus-netizien' },
  {
    icon: <Linkedin size={18} />,
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/vishweshwarraokolluru/',
  },
]

/** Footer — link columns, concise contact bar, full-bleed DevBraid wordmark. */
export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden rounded-3xl border border-hairline bg-surface/40 lg:m-8">
      <div className="relative z-10 mx-auto max-w-7xl p-10 md:p-14">
        <div className="grid grid-cols-1 gap-10 pb-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-16">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center space-x-2">
              <span className="grid size-7 place-items-center rounded-md bg-primary text-primary-foreground">
                <Braces className="size-4" />
              </span>
              <span className="text-2xl font-bold tracking-tight">DevBraid</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Evidence-backed change briefs, braided from your commits and your reasoning.
            </p>
          </div>

          {footerLinkGroups.map((group) => (
            <div key={group.title}>
              <h4 className="mb-5 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {group.title}
              </h4>
              <ul className="space-y-3">
                {group.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-foreground/80 transition-colors hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col items-center justify-between gap-4 border-t border-hairline pt-8 sm:flex-row">
          <a
            href="mailto:devbraid@proton.me"
            className="text-sm text-muted-foreground transition-colors hover:text-primary"
          >
            devbraid@proton.me
          </a>
          <div className="flex items-center gap-5 text-muted-foreground">
            {socialLinks.map(({ icon, label, href }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                target="_blank"
                rel="noreferrer"
                className="transition-colors hover:text-primary"
              >
                {icon}
              </a>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} DevBraid. All rights reserved.
          </p>
        </div>
      </div>

      <div className="relative z-10 hidden h-[22vw] w-full lg:block">
        <TextHoverEffect text="DevBraid" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  )
}
