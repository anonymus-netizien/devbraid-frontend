import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Plus, X, GitBranch, FolderGit2, Loader2, Sparkles } from 'lucide-react'
import { githubService } from '../../services/github.service'
import { threadService } from '../../services/thread.service'
import type { GitRepository, Branch } from '../../types/github'
import type { ChangeThread } from '../../types/thread'

interface CreateThreadDialogProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onThreadCreated?: (thread: ChangeThread) => void
}

export function CreateThreadDialog({
  open: controlledOpen,
  onOpenChange: setControlledOpen,
  onThreadCreated,
}: CreateThreadDialogProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const open = isControlled ? controlledOpen : uncontrolledOpen
  const setOpen = (val: boolean) => {
    if (isControlled && setControlledOpen) {
      setControlledOpen(val)
    } else {
      setUncontrolledOpen(val)
    }
  }
  const [loadingRepos, setLoadingRepos] = useState(false)
  const [repos, setRepos] = useState<GitRepository[]>([])
  const [selectedRepo, setSelectedRepo] = useState<string>('')

  const [loadingBranches, setLoadingBranches] = useState(false)
  const [branches, setBranches] = useState<Branch[]>([])
  const [headBranch, setHeadBranch] = useState<string>('')
  const [baseBranch, setBaseBranch] = useState<string>('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load user repositories when dialog opens
  useEffect(() => {
    if (open) {
      setLoadingRepos(true)
      setError(null)
      githubService
        .listRepositories()
        .then((repoList) => {
          setRepos(repoList || [])
          if (repoList && repoList.length > 0) {
            setSelectedRepo(repoList[0].fullName)
          }
        })
        .catch((err) => {
          console.error('Failed to load GitHub repos:', err)
          setError('Failed to load repositories. Is GitHub connected?')
        })
        .finally(() => setLoadingRepos(false))
    }
  }, [open])

  // Load branches when selectedRepo changes
  useEffect(() => {
    if (selectedRepo && selectedRepo.includes('/')) {
      const [owner, repo] = selectedRepo.split('/')
      setLoadingBranches(true)
      githubService
        .listBranches(owner, repo)
        .then((branchList) => {
          setBranches(branchList || [])
          if (branchList && branchList.length > 0) {
            setHeadBranch(branchList[0].name)
            const mainOrMaster = branchList.find((b) => b.name === 'main' || b.name === 'master')
            setBaseBranch(mainOrMaster ? mainOrMaster.name : branchList[0].name)
          }
        })
        .catch((err) => {
          console.error('Failed to load branches:', err)
        })
        .finally(() => setLoadingBranches(false))
    }
  }, [selectedRepo])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedRepo || !headBranch || !baseBranch || !title.trim()) {
      setError('Please fill in all required fields.')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      const newThread = await threadService.createThread({
        repositoryFullName: selectedRepo,
        headBranch,
        baseBranch,
        title: title.trim(),
        description: description.trim() || undefined,
      })

      setOpen(false)
      // Reset form
      setTitle('')
      setDescription('')
      if (onThreadCreated) {
        onThreadCreated(newThread)
      }
    } catch (err: unknown) {
      console.error('Failed to create thread:', err)
      const errorMsg =
        err instanceof Error ? err.message : 'Failed to create Change Thread. Please try again.'
      setError(errorMsg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button
          type="button"
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all shadow-sm active:scale-98"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          <span>New thread</span>
        </button>
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 animate-in fade-in duration-200" />
        <Dialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-lg bg-surface border border-hairline rounded-xl shadow-elevation-3 p-4 sm:p-6 z-50 focus:outline-none animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between pb-4 border-b border-hairline mb-5">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Sparkles className="h-5 w-5" />
              </div>
              <div>
                <Dialog.Title className="text-base font-semibold text-foreground">
                  Create Change Thread
                </Dialog.Title>
                <Dialog.Description className="text-xs text-muted-foreground">
                  Pair a feature branch with developer rationale for AI analysis.
                </Dialog.Description>
              </div>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </Dialog.Close>
          </div>

          {error && (
            <div className="p-3 mb-4 text-xs rounded-lg bg-danger-bg text-danger-fg border border-danger-border flex items-center gap-2">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Repository Select */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                <FolderGit2 className="h-3.5 w-3.5 text-muted-foreground" />
                Repository <span className="text-danger">*</span>
              </label>
              {loadingRepos ? (
                <div className="flex items-center gap-2 px-3 py-2 text-xs text-muted-foreground bg-surface-2 rounded-lg border border-hairline">
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  Fetching GitHub repositories...
                </div>
              ) : (
                <select
                  value={selectedRepo}
                  onChange={(e) => setSelectedRepo(e.target.value)}
                  required
                  className="w-full px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  {repos.length === 0 ? (
                    <option value="">No repositories found</option>
                  ) : (
                    repos.map((r) => (
                      <option key={r.fullName} value={r.fullName}>
                        {r.fullName} {r.isPrivate ? '(Private)' : ''}
                      </option>
                    ))
                  )}
                </select>
              )}
            </div>

            {/* Branch Pair Select */}
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                    <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                    Head Branch (Feature) <span className="text-danger">*</span>
                  </label>
                  <select
                    value={headBranch}
                    onChange={(e) => setHeadBranch(e.target.value)}
                    disabled={loadingBranches || branches.length === 0}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                  >
                    {branches.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1.5 flex items-center gap-1.5">
                    <GitBranch className="h-3.5 w-3.5 text-muted-foreground" />
                    Base Branch (Target) <span className="text-danger">*</span>
                  </label>
                  <select
                    value={baseBranch}
                    onChange={(e) => setBaseBranch(e.target.value)}
                    disabled={loadingBranches || branches.length === 0}
                    required
                    className="w-full px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:opacity-50"
                  >
                    {branches.map((b) => (
                      <option key={b.name} value={b.name}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {headBranch && baseBranch && headBranch === baseBranch && (
                <div className="px-3 py-1.5 rounded-md bg-info-bg text-info-fg border border-info-border text-xs flex items-center gap-2">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  <span>
                    <strong>Single Branch Mode:</strong> Tracks recent commits on{' '}
                    <code className="font-mono bg-surface px-1 py-0.5 rounded">{headBranch}</code>{' '}
                    for solo development.
                  </span>
                </div>
              )}
            </div>

            {/* Thread Title */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Thread Title <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Refactor Auth Middleware to JWT rotation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            {/* Description / Rationale */}
            <div>
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Initial Description & Context
              </label>
              <textarea
                rows={3}
                placeholder="Describe what changes are being made and why..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground placeholder:text-muted-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-hairline">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-surface-2 text-foreground text-sm hover:bg-surface-2/80 transition-colors"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <button
                type="submit"
                disabled={submitting || !title.trim()}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <span>{submitting ? 'Creating...' : 'Create Thread'}</span>
              </button>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
