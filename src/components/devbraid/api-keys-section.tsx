import { useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import * as Dialog from '@radix-ui/react-dialog'
import { Check, Copy, KeyRound, Loader2, Plus, ShieldAlert, Trash2, X } from 'lucide-react'
import { queryKeys, useApiKeysQuery } from '@/hooks/queries'
import { apiKeyService } from '@/services/api-key.service'
import { cn } from '@/lib/utils'

function formatTime(iso?: string) {
  if (!iso) return 'never'
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function ApiKeysSection() {
  const queryClient = useQueryClient()
  const { data: keys = [], isLoading } = useApiKeysQuery()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [scopes, setScopes] = useState('')
  const [rateLimit, setRateLimit] = useState('')
  const [creating, setCreating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [revokingId, setRevokingId] = useState<string | null>(null)

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    setCreating(true)
    setError(null)
    try {
      const result = await apiKeyService.createApiKey({
        name: name.trim(),
        scopes: scopes
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
        rateLimitPerMin: rateLimit.trim() ? Number(rateLimit.trim()) : undefined,
      })
      setCreatedKey(result.fullKey ?? null)
      setCopied(false)
      setName('')
      setScopes('')
      setRateLimit('')
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys })
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to create API key')
    } finally {
      setCreating(false)
    }
  }

  const closeDialog = () => {
    setOpen(false)
    setCreatedKey(null)
    setError(null)
  }

  const copyKey = async () => {
    if (!createdKey) return
    try {
      await navigator.clipboard.writeText(createdKey)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard unavailable — key remains visible for manual copy.
    }
  }

  const revoke = async (id: string | undefined) => {
    if (!id) return
    if (!window.confirm('Revoke this API key? Requests using it will fail immediately.')) return
    setRevokingId(id)
    try {
      await apiKeyService.revokeApiKey(id)
      queryClient.invalidateQueries({ queryKey: queryKeys.apiKeys })
    } finally {
      setRevokingId(null)
    }
  }

  return (
    <section className="space-y-4 rounded-xl bg-surface p-5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <KeyRound className="size-4 text-primary" />
          <div>
            <p className="text-sm font-semibold text-foreground">API Keys</p>
            <p className="text-xs text-muted-foreground">
              Keys for programmatic access. The full key is shown only once, at creation.
            </p>
          </div>
        </div>
        <Dialog.Root open={open} onOpenChange={setOpen}>
          <Dialog.Trigger asChild>
            <button
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-hairline bg-surface-2/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Plus className="size-3.5" /> New key
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 z-50 animate-in fade-in bg-black/60 backdrop-blur-xs duration-200" />
            <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 animate-in zoom-in-95 rounded-xl border border-hairline bg-surface p-4 shadow-elevation-3 duration-200 focus:outline-none sm:p-6">
              <div className="mb-5 flex items-center justify-between pb-4">
                <h2 className="text-sm font-semibold text-foreground">Create API Key</h2>
                <button
                  type="button"
                  onClick={closeDialog}
                  className="grid size-7 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
                >
                  <X className="size-4" />
                </button>
              </div>

              {createdKey ? (
                <div className="space-y-4">
                  <div className="flex items-start gap-2 rounded-lg border border-success-border bg-success-bg p-3 text-xs text-success-fg">
                    <ShieldAlert className="mt-0.5 size-4 shrink-0" />
                    <p>Copy this key now — it will never be shown again.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <code className="min-w-0 flex-1 truncate rounded-lg border border-hairline bg-surface-2 px-3 py-2 font-mono text-[11px] text-foreground">
                      {createdKey}
                    </code>
                    <button
                      type="button"
                      onClick={copyKey}
                      className={cn(
                        'grid size-8 shrink-0 place-items-center rounded-lg border transition-colors',
                        copied
                          ? 'border-success-border bg-success-bg text-success-fg'
                          : 'border-hairline bg-surface-2/60 text-muted-foreground hover:text-foreground',
                      )}
                      title="Copy key"
                    >
                      {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="w-full rounded-lg border border-hairline bg-surface-2/60 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary/40"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={create} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">Name</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="CI pipeline"
                      className="input input-sm w-full border border-hairline bg-surface-2/40 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Scopes (comma-separated, optional)
                    </label>
                    <input
                      type="text"
                      value={scopes}
                      onChange={(e) => setScopes(e.target.value)}
                      placeholder="threads:read, briefs:write"
                      className="input input-sm w-full border border-hairline bg-surface-2/40 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/40"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-foreground">
                      Rate limit per minute (optional)
                    </label>
                    <input
                      type="number"
                      value={rateLimit}
                      onChange={(e) => setRateLimit(e.target.value)}
                      placeholder="60"
                      min={1}
                      className="input input-sm w-full border border-hairline bg-surface-2/40 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:border-primary/40"
                    />
                  </div>
                  {error && <p className="text-xs text-danger-fg">{error}</p>}
                  <button
                    type="submit"
                    disabled={creating || !name.trim()}
                    className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40"
                  >
                    {creating ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="size-4 animate-spin" /> Creating…
                      </span>
                    ) : (
                      'Create key'
                    )}
                  </button>
                </form>
              )}
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      {isLoading ? (
        <p className="flex items-center gap-2 py-6 text-xs text-muted-foreground">
          <Loader2 className="size-3 animate-spin" /> Loading keys…
        </p>
      ) : keys.length === 0 ? (
        <p className="py-6 text-xs text-muted-foreground">
          No API keys yet. Create one to access the API programmatically.
        </p>
      ) : (
        <ul className="divide-y divide-hairline/60">
          {keys.map((k) => (
            <li key={k.id} className="flex items-center gap-3 py-2.5">
              <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-hairline bg-surface-2 text-muted-foreground">
                <KeyRound className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-xs font-medium text-foreground">
                    {k.name || 'Untitled'}
                  </p>
                  {!k.active && (
                    <span className="rounded-full border border-danger-border bg-danger-bg px-1.5 py-px font-mono text-[9px] uppercase tracking-wide text-danger-fg">
                      revoked
                    </span>
                  )}
                </div>
                <p className="mt-0.5 truncate font-mono text-[10px] text-muted-foreground">
                  {k.prefix || 'devbraid_'}…{' '}
                  {k.scopes && k.scopes.length > 0 && `· ${k.scopes.join(', ')}`}
                </p>
              </div>
              <div className="hidden shrink-0 text-right sm:block">
                <p className="text-[10px] text-muted-foreground">
                  last used {formatTime(k.lastUsedAt)}
                </p>
                {k.rateLimitPerMin ? (
                  <p className="font-mono text-[10px] text-muted-foreground">
                    {k.rateLimitPerMin}/min
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => revoke(k.id)}
                disabled={!k.active || revokingId === k.id}
                className="grid size-7 shrink-0 place-items-center rounded-lg text-muted-foreground transition-colors hover:text-danger-fg disabled:opacity-40"
                title="Revoke key"
              >
                {revokingId === k.id ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
