import { useEffect, useMemo, useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import * as Dialog from '@radix-ui/react-dialog'
import {
  Activity,
  Braces,
  Boxes,
  CircleDot,
  FileCode2,
  GitBranch,
  Loader2,
  Plus,
  Search,
  X,
} from 'lucide-react'
import { PageHeader, LoadingRows, EmptyState, ErrorPanel } from '@/components/devbraid/states'
import { Skeleton } from '@/components/ui/skeleton'
import {
  queryKeys,
  useIndexesQuery,
  useIndexFilesQuery,
  useIndexGraphQuery,
  useIndexSearchQuery,
} from '@/hooks/queries'
import { indexingService } from '@/services/indexing.service'
import type { CodebaseIndex } from '@/types/indexing'
import { cn } from '@/lib/utils'

export const Route = createFileRoute('/indexing')({
  component: IndexingPage,
})

function IndexStatusBadge({ status }: { status?: string }) {
  const s = (status || '').toLowerCase()
  const className =
    s === 'completed' || s === 'ready'
      ? 'bg-success-bg text-success-fg border-success-border'
      : s === 'failed'
        ? 'bg-danger-bg text-danger-fg border-danger-border'
        : s === 'indexing' || s === 'running'
          ? 'bg-info-bg text-info-fg border-info-border'
          : 'bg-surface-2 text-muted-foreground border-hairline'
  return (
    <span
      className={cn(
        'rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide',
        className,
      )}
    >
      {s || 'unknown'}
    </span>
  )
}

export function StartIndexDialog({ onStarted }: { onStarted: () => void }) {
  const [open, setOpen] = useState(false)
  const [repository, setRepository] = useState('')
  const [branch, setBranch] = useState('')
  const [fileContents, setFileContents] = useState('')
  const [starting, setStarting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!repository.trim() && !fileContents.trim()) return
    setStarting(true)
    setError(null)
    try {
      await indexingService.startIndexing({
        repository: repository.trim() || undefined,
        branch: branch.trim() || undefined,
        fileContents: fileContents
          .split('\n')
          .map((l) => l.trim())
          .filter(Boolean),
      })
      setRepository('')
      setBranch('')
      setFileContents('')
      setOpen(false)
      onStarted()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to start indexing')
    } finally {
      setStarting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-all hover:bg-primary/90 active:scale-98"
        >
          <Plus className="size-4" aria-hidden="true" />
          <span>Start Index</span>
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 animate-in fade-in bg-black/60 backdrop-blur-xs duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 animate-in zoom-in-95 rounded-xl bg-surface p-4 shadow-elevation-3 duration-200 focus:outline-none sm:p-6">
          <div className="mb-5 flex items-center justify-between pb-4">
            <div className="flex items-center gap-2">
              <Boxes className="size-4 text-primary" />
              <h2 className="text-sm font-semibold text-foreground">Start Code Index</h2>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Repository</label>
              <input
                type="text"
                value={repository}
                onChange={(e) => setRepository(e.target.value)}
                placeholder="owner/repo (e.g. acme/api)"
                className="input input-md w-full border border-hairline bg-surface-2/40 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">Branch (optional)</label>
              <input
                type="text"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                placeholder="main"
                className="input input-md w-full border border-hairline bg-surface-2/40 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-foreground">
                Raw file contents (one path per line, optional)
              </label>
              <textarea
                value={fileContents}
                onChange={(e) => setFileContents(e.target.value)}
                placeholder={'src/main/java/A.java\nsrc/main/java/B.java'}
                rows={4}
                className="input w-full resize-y border border-hairline bg-surface-2/40 px-3 py-2 font-mono text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/40"
              />
            </div>
            {error && <p className="text-xs text-danger-fg">{error}</p>}
            <button
              type="submit"
              disabled={starting || (!repository.trim() && !fileContents.trim())}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40"
            >
              {starting ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="size-4 animate-spin" /> Starting…
                </span>
              ) : (
                'Start indexing'
              )}
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function IndexDetail({ index }: { index: CodebaseIndex }) {
  const [pattern, setPattern] = useState('')
  const { data: files = [], isLoading } = useIndexFilesQuery(index.id ?? '')
  const { data: graph } = useIndexGraphQuery(index.id ?? '')
  const { data: searchResults = [], isFetching: searching } = useIndexSearchQuery(
    index.id ?? '',
    pattern,
  )

  const languages = useMemo(() => {
    const map = new Map<string, number>()
    for (const f of files) {
      const lang = f.language || 'other'
      map.set(lang, (map.get(lang) ?? 0) + 1)
    }
    return [...map.entries()].sort((a, b) => b[1] - a[1])
  }, [files])

  const visibleFiles = pattern.trim() ? searchResults : files

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-xl bg-surface p-4">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Files</p>
          <p className="mt-1 font-mono text-xl text-foreground tabular-nums">
            {index.indexedFiles ?? 0}
            <span className="text-xs text-muted-foreground">/{index.totalFiles ?? 0}</span>
          </p>
        </div>
        <div className="rounded-xl bg-surface p-4">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Functions
          </p>
          <p className="mt-1 font-mono text-xl text-foreground tabular-nums">
            {index.totalFunctions ?? 0}
          </p>
        </div>
        <div className="rounded-xl bg-surface p-4">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Classes
          </p>
          <p className="mt-1 font-mono text-xl text-foreground tabular-nums">
            {index.totalClasses ?? 0}
          </p>
        </div>
        <div className="rounded-xl bg-surface p-4">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            Dependencies
          </p>
          <p className="mt-1 font-mono text-xl text-foreground tabular-nums">
            {index.totalDependencies ?? 0}
          </p>
        </div>
      </div>

      {index.errorMessage && (
        <div className="rounded-xl border border-danger-border bg-danger-bg px-4 py-3 text-xs text-danger-fg">
          {index.errorMessage}
        </div>
      )}

      {/* Language breakdown */}
      <div className="rounded-xl bg-surface p-4">
        <p className="mb-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Languages
        </p>
        {languages.length === 0 ? (
          <p className="text-xs text-muted-foreground">No files indexed yet.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {languages.map(([lang, count]) => (
              <span
                key={lang}
                className="flex items-center gap-1.5 rounded-full bg-surface-2 px-2.5 py-1 font-mono text-[10px] text-foreground"
              >
                <Braces className="size-3 text-muted-foreground" />
                {lang}
                <span className="text-muted-foreground">{count}</span>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* File search */}
      <div className="rounded-xl bg-surface p-4">
        <div className="mb-3 flex items-center justify-between">
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Files</p>
          <div className="relative w-56">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 size-3 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={pattern}
              onChange={(e) => setPattern(e.target.value)}
              placeholder="Search files…"
              className="input input-md w-full border border-hairline bg-surface-2/40 py-1 pl-7 pr-3 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/40"
            />
          </div>
        </div>
        {isLoading ? (
          <Skeleton className="mt-3 h-10 w-full rounded-md" />
        ) : searching ? (
          <p className="flex items-center gap-2 py-6 text-xs text-muted-foreground">
            <Loader2 className="size-3 animate-spin" /> Searching…
          </p>
        ) : visibleFiles.length === 0 ? (
          <p className="py-6 text-xs text-muted-foreground">
            {pattern.trim() ? 'No files match that pattern.' : 'No indexed files yet.'}
          </p>
        ) : (
          <ul className="max-h-80 overflow-y-auto">
            {visibleFiles.map((f) => (
              <li key={f.id} className="flex items-center gap-3 py-2">
                <FileCode2 className="size-3.5 shrink-0 text-muted-foreground" />
                <p className="min-w-0 flex-1 truncate font-mono text-xs text-foreground">
                  {f.filePath}
                </p>
                <span className="hidden font-mono text-[10px] text-muted-foreground sm:inline">
                  {f.language}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground tabular-nums">
                  {f.functionCount ?? 0} fn
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Dependency graph summary */}
      <div className="rounded-xl bg-surface p-4">
        <p className="mb-3 text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Dependency Graph
        </p>
        {!graph ? (
          <p className="text-xs text-muted-foreground">Graph not available for this index.</p>
        ) : (
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <CircleDot className="size-3.5 text-info-fg" /> {graph.nodes?.length ?? 0} nodes
            </span>
            <span className="flex items-center gap-1.5">
              <Activity className="size-3.5 text-info-fg" /> {graph.edges?.length ?? 0} edges
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

function IndexingPage() {
  const queryClient = useQueryClient()
  const { data: indexes, isLoading, isError, refetch } = useIndexesQuery()
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const selected = indexes?.find((i) => i.id === selectedId) ?? null

  useEffect(() => {
    if (!selectedId && indexes?.length) setSelectedId(indexes[0].id ?? null)
  }, [indexes, selectedId])

  const refetchIndexes = () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.indexing.indexes })
    refetch()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <PageHeader
          title="Code Index"
          description="Explore indexed codebases: files, languages, and dependency graphs."
        />
        <StartIndexDialog onStarted={refetchIndexes} />
      </div>

      {isLoading ? (
        <LoadingRows />
      ) : isError ? (
        <ErrorPanel onRetry={refetch} />
      ) : !indexes || indexes.length === 0 ? (
        <EmptyState
          title="No indexes yet"
          description="Start indexing a repository to explore its structure."
        />
      ) : (
        <div className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {indexes.map((idx) => {
              const pct = idx.totalFiles
                ? Math.round(((idx.indexedFiles ?? 0) / idx.totalFiles) * 100)
                : 0
              return (
                <button
                  key={idx.id}
                  type="button"
                  onClick={() => setSelectedId(idx.id ?? null)}
                  className={cn(
                    'rounded-xl bg-surface p-4 text-left transition-colors',
                    selectedId === idx.id ? 'ring-1 ring-primary/50' : 'hover:bg-surface-2/50',
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate font-mono text-xs text-foreground">
                      {idx.repository || 'raw contents'}
                    </p>
                    <IndexStatusBadge status={idx.status} />
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                    <GitBranch className="size-3" /> {idx.branch || '—'}
                  </p>
                  <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-surface-2">
                    <div
                      className="h-full bg-primary/70 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="mt-1.5 font-mono text-[10px] text-muted-foreground tabular-nums">
                    {idx.indexedFiles ?? 0}/{idx.totalFiles ?? 0} files indexed
                  </p>
                </button>
              )
            })}
          </div>

          {selected && (
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Boxes className="size-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground">
                  {selected.repository || 'Raw contents'}
                </h2>
                <IndexStatusBadge status={selected.status} />
              </div>
              <IndexDetail key={selected.id} index={selected} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}
