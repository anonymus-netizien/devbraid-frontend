import { useEffect, useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../ui/command'
import { threads, briefs, connections } from '../../lib/mock/data'
import {
  LayoutDashboard,
  GitPullRequest,
  FileText,
  BookOpen,
  Github,
  Settings,
  Plus,
  Search,
  Sparkles,
  ArrowRight,
  History,
} from 'lucide-react'

const RECENTS_KEY = 'devbraid:cmdk:recents'
const MAX_RECENTS = 5

type Recent = { to: string; label: string; group: string }

function loadRecents(): Recent[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(RECENTS_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENTS) : []
  } catch {
    return []
  }
}

function saveRecent(item: Recent) {
  if (typeof window === 'undefined') return
  const current = loadRecents().filter((r) => r.to !== item.to)
  const next = [item, ...current].slice(0, MAX_RECENTS)
  window.localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
}

const navItems = [
  { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
  { label: 'Change Threads', to: '/threads', icon: GitPullRequest },
  { label: 'Decision Notes', to: '/notes', icon: FileText },
  { label: 'Change Briefs', to: '/briefs', icon: BookOpen },
  { label: 'GitHub Connections', to: '/connections', icon: Github },
  { label: 'Settings', to: '/settings', icon: Settings },
]

const quickActions = [
  { label: 'New change thread', to: '/threads', icon: Plus, kbd: 'N' },
  { label: 'Connect GitHub repository', to: '/connections', icon: Github, kbd: 'G' },
  { label: 'Generate a brief', to: '/threads', icon: Sparkles, kbd: 'B' },
]

export function CommandPalette({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (v: boolean) => void
}) {
  const navigate = useNavigate()
  const [recents, setRecents] = useState<Recent[]>([])

  useEffect(() => {
    if (open) setRecents(loadRecents())
  }, [open])

  const go = (item: Recent) => {
    saveRecent(item)
    onOpenChange(false)
    navigate({ to: item.to as never })
  }

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <div className="flex items-center gap-2 border-b border-hairline px-3">
        <Search className="size-4 text-muted-foreground" />
        <CommandInput
          placeholder="Search threads, briefs, repos, or jump to a page…"
          className="flex-1 border-0 focus:ring-0"
        />
        <kbd className="rounded border border-hairline bg-background px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
          ESC
        </kbd>
      </div>

      <CommandList className="max-h-[440px]">
        <CommandEmpty>
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No matches. Try a repo, branch, or thread title.
          </div>
        </CommandEmpty>

        {recents.length > 0 && (
          <>
            <CommandGroup heading="Recent">
              {recents.map((r) => (
                <CommandItem
                  key={r.to}
                  value={`recent ${r.label}`}
                  onSelect={() => go(r)}
                >
                  <History className="mr-2 size-3.5 text-muted-foreground" />
                  <span className="truncate">{r.label}</span>
                  <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                    {r.group}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
            <CommandSeparator />
          </>
        )}

        <CommandGroup heading="Quick actions">
          {quickActions.map((q) => (
            <CommandItem
              key={q.label}
              value={`action ${q.label}`}
              onSelect={() => go({ to: q.to, label: q.label, group: 'Action' })}
            >
              <q.icon className="mr-2 size-3.5 text-primary" />
              <span>{q.label}</span>
              <div className="ml-auto flex items-center gap-1">
                <kbd className="rounded border border-hairline bg-background px-1.5 py-0.5 font-mono text-[9px] text-muted-foreground">
                  {q.kbd}
                </kbd>
                <ArrowRight className="size-3 text-muted-foreground" />
              </div>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Navigate">
          {navItems.map((n) => (
            <CommandItem
              key={n.to}
              value={`nav ${n.label}`}
              onSelect={() => go({ to: n.to, label: n.label, group: 'Page' })}
            >
              <n.icon className="mr-2 size-3.5 text-muted-foreground" />
              <span>{n.label}</span>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                {n.to}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Change threads">
          {threads.map((t) => (
            <CommandItem
              key={t.id}
              value={`thread ${t.title} ${t.repo} ${t.headBranch}`}
              onSelect={() =>
                go({
                  to: `/threads/${t.id}`,
                  label: t.title,
                  group: 'Thread',
                })
              }
            >
              <GitPullRequest className="mr-2 size-3.5 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <div className="truncate">{t.title}</div>
                <div className="truncate font-mono text-[10px] text-muted-foreground">
                  {t.repo} · {t.headBranch}
                </div>
              </div>
              <span className="ml-2 shrink-0 rounded border border-hairline bg-surface px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                {t.status}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="Change briefs">
          {briefs.map((b) => (
            <CommandItem
              key={b.id}
              value={`brief ${b.title}`}
              onSelect={() => go({ to: `/briefs/${b.id}`, label: b.title, group: 'Brief' })}
            >
              <FileText className="mr-2 size-3.5 text-muted-foreground" />
              <span className="truncate">{b.title}</span>
              <span className="ml-auto font-mono text-[10px] text-muted-foreground">
                {b.id}
              </span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandGroup heading="GitHub connections">
          {connections.map((c) => (
            <CommandItem
              key={c.id}
              value={`repo ${c.githubUsername}`}
              onSelect={() =>
                go({ to: '/connections', label: c.githubUsername, group: 'Repo' })
              }
            >
              <Github className="mr-2 size-3.5 text-muted-foreground" />
              <span className="font-mono">{c.githubUsername}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>

      <div className="flex items-center justify-between border-t border-hairline px-3 py-2 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-hairline bg-background px-1.5 py-0.5 font-mono">
              ↑↓
            </kbd>
            navigate
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-hairline bg-background px-1.5 py-0.5 font-mono">
              ↵
            </kbd>
            select
          </span>
          <span className="flex items-center gap-1">
            <kbd className="rounded border border-hairline bg-background px-1.5 py-0.5 font-mono">
              esc
            </kbd>
            close
          </span>
        </div>
        <span className="font-mono uppercase tracking-widest">devbraid ⌘K</span>
      </div>
    </CommandDialog>
  )
}

export function useCommandPalette() {
  const [open, setOpen] = useState(false)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])
  return { open, setOpen }
}
