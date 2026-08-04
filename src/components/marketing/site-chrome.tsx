import { Link } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { Braces, Github, Mail, Menu, MessageSquare, Twitter, Linkedin, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FooterBackgroundGradient, TextHoverEffect } from '@/components/ui/hover-footer'

const links = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#flow' },
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
    <header className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          'border-b transition-colors duration-300',
          scrolled
            ? 'border-hairline bg-background/85 backdrop-blur-xl'
            : 'border-transparent bg-background/40 backdrop-blur-sm',
        )}
      >
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="grid size-6 place-items-center rounded-md bg-primary text-primary-foreground">
              <Braces className="size-3.5" />
            </span>
            <span className="text-sm font-semibold tracking-tight">DevBraid</span>
          </Link>

          <nav className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 md:flex">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="rounded-md px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-surface/60 hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/auth/login"
              className="hidden rounded-md px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-surface/60 sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              to="/auth/register"
              className="inline-flex h-8 items-center rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary-hover"
            >
              Start free
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Toggle menu"
              aria-expanded={open}
              className="grid size-8 place-items-center rounded-md border border-hairline bg-surface/60 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground md:hidden"
            >
              {open ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>
      </div>

      {open && (
        <nav className="border-b border-hairline bg-background/95 px-4 py-3 backdrop-blur-xl md:hidden">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  )
}

const footerLinkGroups = [
  {
    title: 'Products',
    links: [
      { label: 'Change Threads', to: '/threads' as const },
      { label: 'Decision Notes', to: '/notes' as const },
      { label: 'Change Briefs', to: '/briefs' as const },
      { label: 'Code Index', to: '/indexing' as const },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Dashboard', to: '/dashboard' as const },
      { label: 'GitHub Connections', to: '/connections' as const },
      { label: 'Settings', to: '/settings' as const },
    ],
  },
]

const contactInfo = [
  {
    icon: <Mail size={18} className="text-primary" />,
    text: 'hello@devbraid.dev',
    href: 'mailto:hello@devbraid.dev',
  },
  {
    icon: <MessageSquare size={18} className="text-primary" />,
    text: 'GitHub Discussions',
    href: 'https://github.com/anonymus-netizien',
  },
  { icon: <Braces size={18} className="text-primary" />, text: 'Built for reviewers' },
]

const socialLinks = [
  { icon: <Github size={18} />, label: 'GitHub', href: 'https://github.com/anonymus-netizien' },
  { icon: <Twitter size={18} />, label: 'Twitter', href: '#' },
  { icon: <Linkedin size={18} />, label: 'LinkedIn', href: '#' },
]

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden rounded-3xl border border-hairline bg-surface/40 lg:m-8 lg:p-0">
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

          <div>
            <h4 className="mb-5 font-mono text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Contact Us
            </h4>
            <ul className="space-y-3">
              {contactInfo.map((item, i) => (
                <li key={i} className="flex items-center space-x-3 text-sm text-muted-foreground">
                  {item.icon}
                  {item.href ? (
                    <a href={item.href} className="transition-colors hover:text-primary">
                      {item.text}
                    </a>
                  ) : (
                    <span>{item.text}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <hr className="my-8 border-hairline" />

        <div className="flex flex-col items-center justify-between space-y-4 text-sm md:flex-row md:space-y-0">
          <div className="flex space-x-6 text-muted-foreground">
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
          <p className="text-center text-muted-foreground">
            &copy; {new Date().getFullYear()} DevBraid. All rights reserved.
          </p>
        </div>
      </div>

      <div className="hidden h-[30rem] -mt-52 -mb-36 lg:block">
        <TextHoverEffect text="DevBraid" className="z-50" />
      </div>

      <FooterBackgroundGradient />
    </footer>
  )
}
