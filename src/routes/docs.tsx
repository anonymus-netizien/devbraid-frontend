import { createFileRoute } from '@tanstack/react-router'
import { useEffect, useMemo, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MarketingPage } from '@/components/marketing/marketing-page'
import { DocsGuides, DocsReference } from '@/components/marketing/docs-sections'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/docs')({
  head: () => ({
    meta: [
      { title: 'Documentation · DevBraid' },
      {
        name: 'description',
        content:
          'Docs for DevBraid: quick start, configuration, architecture, data models, authentication, and the API reference.',
      },
    ],
  }),
  component: DocsPage,
})

const groups = [
  {
    label: 'Getting Started',
    sections: [
      { id: 'introduction', title: 'Introduction' },
      { id: 'installation', title: 'Installation' },
      { id: 'configuration', title: 'Configuration' },
    ],
  },
  {
    label: 'Core Concepts',
    sections: [
      { id: 'architecture', title: 'Architecture' },
      { id: 'data-models', title: 'Data Models' },
      { id: 'authentication', title: 'Authentication' },
    ],
  },
  {
    label: 'API Reference',
    sections: [
      { id: 'endpoints', title: 'Endpoints' },
      { id: 'webhooks', title: 'Webhooks' },
      { id: 'rate-limits', title: 'Rate Limits' },
    ],
  },
]

// ponytail: pure + stateless — module scope so it isn't rebuilt every render
const scrollToSection = (id: string) => {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

function DocsPage() {
  const allSections = useMemo(
    () => groups.flatMap((g) => g.sections.map((s) => ({ ...s, group: g.label }))),
    [],
  )
  const [activeId, setActiveId] = useState('introduction')

  // Scroll-spy: highlight the section currently in the middle band of the viewport.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveId(entry.target.id)
        }
      },
      { rootMargin: '-35% 0px -55% 0px' },
    )
    allSections.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [allSections])

  const currentIndex = allSections.findIndex((s) => s.id === activeId)
  const prev = currentIndex > 0 ? allSections[currentIndex - 1] : null
  const next =
    currentIndex >= 0 && currentIndex < allSections.length - 1
      ? allSections[currentIndex + 1]
      : null
  const active = allSections.find((s) => s.id === activeId)

  return (
    <MarketingPage>
      <div className="mx-auto flex max-w-[1280px] px-4 pt-28 sm:px-6">
        {/* Docs sidebar */}
        <aside className="sticky top-24 hidden h-[calc(100vh-8rem)] w-64 shrink-0 overflow-y-auto pr-4 lg:block">
          {groups.map((g) => (
            <div key={g.label} className="mb-6">
              <p className="mb-2 px-2 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                {g.label}
              </p>
              <ul className="space-y-0.5">
                {g.sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      onClick={(e) => {
                        e.preventDefault()
                        scrollToSection(s.id)
                      }}
                      className={cn(
                        'block rounded border-l-2 border-transparent px-2 py-1 font-mono text-[13px] transition-colors hover:bg-surface hover:text-foreground',
                        activeId === s.id
                          ? 'border-primary bg-surface text-foreground'
                          : 'text-muted-foreground',
                      )}
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </aside>

        {/* Main content */}
        <article className="mx-auto min-w-0 max-w-4xl flex-1 pb-24 pr-0 lg:px-10">
          <nav className="mb-4 flex items-center gap-1.5 font-mono text-xs text-muted-foreground">
            <span>Docs</span>
            <ChevronRight className="size-3" />
            <span>{active?.group ?? 'Getting Started'}</span>
            <ChevronRight className="size-3" />
            <span className="text-foreground">{active?.title ?? 'Introduction'}</span>
          </nav>

          <h1 className="text-balance text-4xl font-bold tracking-tight sm:text-5xl">
            Introduction to DevBraid
          </h1>

          <DocsGuides />
          <DocsReference />

          {/* Pagination */}
          <div className="mt-16 flex items-center justify-between gap-4 border-t border-hairline pt-8">
            <button
              type="button"
              onClick={() => prev && scrollToSection(prev.id)}
              disabled={!prev}
              className={cn(
                'flex items-center gap-1.5 text-sm font-medium transition-colors',
                prev
                  ? 'text-muted-foreground hover:text-primary'
                  : 'cursor-not-allowed text-muted-foreground/40',
              )}
            >
              <ChevronLeft className="size-4" />
              <span className="hidden sm:inline">Previous:</span> {prev?.title ?? 'None'}
            </button>
            <button
              type="button"
              onClick={() => next && scrollToSection(next.id)}
              disabled={!next}
              className={cn(
                'flex items-center gap-1.5 text-sm font-medium transition-colors',
                next
                  ? 'text-primary hover:text-primary-hover'
                  : 'cursor-not-allowed text-muted-foreground/40',
              )}
            >
              <span className="hidden sm:inline">Next:</span> {next?.title ?? 'None'}
              <ChevronRight className="size-4" />
            </button>
          </div>
        </article>

        {/* Right TOC */}
        <aside className="sticky top-24 hidden w-48 shrink-0 xl:block">
          <p className="mb-3 font-mono text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground">
            On this page
          </p>
          <ul className="space-y-0.5 border-l border-hairline">
            {allSections.map((s) => (
              <li key={s.id}>
                <a
                  href={`#${s.id}`}
                  onClick={(e) => {
                    e.preventDefault()
                    scrollToSection(s.id)
                  }}
                  className={cn(
                    'block border-l-2 border-transparent px-3 py-1 font-mono text-[13px] transition-colors hover:border-primary hover:text-foreground',
                    activeId === s.id ? 'border-primary text-foreground' : 'text-muted-foreground',
                  )}
                >
                  {s.title}
                </a>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </MarketingPage>
  )
}
