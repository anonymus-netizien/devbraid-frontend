import { useReducer, useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import { CheckCircle2, AlertTriangle } from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/devbraid/states'
import { Skeleton } from '@/components/ui/skeleton'
import { FileChangesPanel, CommitsList } from '@/components/devbraid/evidence-panels'
import { ReviewPanel } from '@/components/devbraid/review-panel'
import { ThreadActions, type BusyState } from '@/components/devbraid/thread-actions'
import { ThreadStatsBar, ThreadRiskProfile } from '@/components/devbraid/thread-panels'
import { ThreadNotes } from '@/components/devbraid/thread-notes'
import { ThreadBriefSection } from '@/components/devbraid/thread-brief-section'
import { threadService } from '../services/thread.service'
import {
  queryKeys,
  useThreadQuery,
  useThreadNotesQuery,
  useThreadBriefQuery,
  useThreadReviewQuery,
} from '@/hooks/queries'
import type { ChangeThread } from '../types/thread'

export const Route = createFileRoute('/threads/$id')({
  component: ThreadDetailPage,
})

// Backward-compat: JSONB columns now arrive typed from the backend, but older
// responses may still carry them as JSON strings — parse defensively.
const parseJson = (field: unknown): any[] => {
  if (Array.isArray(field)) return field
  if (typeof field === 'string') {
    try {
      return JSON.parse(field)
    } catch {
      return []
    }
  }
  return []
}

const busyInitial: BusyState = {
  refreshing: false,
  deleting: false,
  analyzing: false,
  generating: false,
  publishing: false,
}

function ThreadDetailPage() {
  const { id } = Route.useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { data: thread, isLoading: threadLoading } = useThreadQuery(id)
  const { data: notes = [], isLoading: notesLoading } = useThreadNotesQuery(id)
  const { data: brief } = useThreadBriefQuery(id)
  const { data: review, isLoading: reviewLoading } = useThreadReviewQuery(id)
  // ponytail: five busy flags change together — one reducer keeps them consistent
  const [busy, setBusy] = useReducer(
    (state: BusyState, action: { flag: keyof BusyState; value: boolean }) => ({
      ...state,
      [action.flag]: action.value,
    }),
    busyInitial,
  )
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const updateThreadCache = (updated: ChangeThread) => {
    queryClient.setQueryData(queryKeys.thread(id), updated)
  }

  const handleRefresh = async () => {
    if (!thread) return
    setBusy({ flag: 'refreshing', value: true })
    setMessage(null)
    try {
      const updated = await threadService.refreshThread(id)
      updateThreadCache(updated)
      setMessage({ type: 'success', text: 'Thread commits and diffs refreshed from GitHub.' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to refresh thread'
      setMessage({ type: 'error', text: msg })
    } finally {
      setBusy({ flag: 'refreshing', value: false })
    }
  }

  const handleAnalyze = async () => {
    if (!thread) return
    setBusy({ flag: 'analyzing', value: true })
    setMessage(null)
    try {
      const updated = await threadService.analyzeThread(id)
      updateThreadCache(updated)
      setMessage({ type: 'success', text: 'AI Risk Analysis completed.' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to run risk analysis'
      setMessage({ type: 'error', text: msg })
    } finally {
      setBusy({ flag: 'analyzing', value: false })
    }
  }

  const handleGenerateBrief = async () => {
    if (!thread) return
    setBusy({ flag: 'generating', value: true })
    setMessage(null)
    try {
      const newBrief = await threadService.generateBrief(id)
      queryClient.setQueryData(queryKeys.threadBrief(id), newBrief)
      setMessage({ type: 'success', text: 'AI Change Brief generated successfully!' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate brief'
      setMessage({ type: 'error', text: msg })
    } finally {
      setBusy({ flag: 'generating', value: false })
    }
  }

  const handlePublish = async (prNumber: number) => {
    if (!thread || !prNumber) return
    setBusy({ flag: 'publishing', value: true })
    setMessage(null)
    try {
      await threadService.publishBrief(id, prNumber)
      setMessage({ type: 'success', text: `Published to GitHub PR #${prNumber}!` })
      updateThreadCache({ ...thread, status: 'PUBLISHED' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish brief'
      setMessage({ type: 'error', text: msg })
    } finally {
      setBusy({ flag: 'publishing', value: false })
    }
  }

  const handleThreadSaveEdit = (updated: ChangeThread) => {
    updateThreadCache(updated)
    queryClient.invalidateQueries({ queryKey: ['threads'] })
    setMessage({ type: 'success', text: 'Thread updated successfully.' })
  }

  const handleDelete = async () => {
    if (!thread) return
    if (!window.confirm(`Delete thread "${thread.title}"? This cannot be undone.`)) return
    setBusy({ flag: 'deleting', value: true })
    setMessage(null)
    try {
      await threadService.deleteThread(id)
      queryClient.invalidateQueries({ queryKey: ['threads'] })
      navigate({ to: '/threads' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete thread'
      setMessage({ type: 'error', text: msg })
    } finally {
      setBusy({ flag: 'deleting', value: false })
    }
  }

  const handleRunReview = async (prNumber: number, headSha: string, installationId: number) => {
    setMessage(null)
    const runReview = await threadService.runReview(id, prNumber, headSha, installationId)
    queryClient.setQueryData(queryKeys.threadReview(id), runReview)
    setMessage({ type: 'success', text: 'PR review completed.' })
  }

  const isLoading = threadLoading || notesLoading

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="mb-8 space-y-2">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-7 w-2/3 max-w-md" />
        </div>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 rounded-xl" />
          ))}
        </div>
        <div className="flex gap-8">
          <div className="min-w-0 flex-1 space-y-8">
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
          </div>
          <div className="hidden w-80 shrink-0 space-y-6 md:block">
            <Skeleton className="h-64 rounded-xl" />
            <Skeleton className="h-40 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
        </div>
      </div>
    )
  }

  if (!thread)
    return <EmptyState title="Thread not found" description="This thread may have been deleted." />

  // Backward-compat: JSONB columns now arrive typed from the backend, but older
  // responses may still carry them as JSON strings — parse defensively.
  const commitsList = Array.isArray(thread.commits) ? thread.commits : parseJson(thread.commits)
  const filesList = Array.isArray(thread.changedFiles)
    ? thread.changedFiles
    : parseJson(thread.changedFiles)

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={thread.repositoryFullName || ''}
        title={thread.title}
        actions={
          <ThreadActions
            thread={thread}
            busy={busy}
            onRefresh={handleRefresh}
            onDelete={handleDelete}
            onAnalyze={handleAnalyze}
            onGenerateBrief={handleGenerateBrief}
            onPublish={handlePublish}
            onSaved={handleThreadSaveEdit}
          />
        }
      />

      {message && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
            message.type === 'success'
              ? 'bg-success-bg text-success-fg border-success-border'
              : 'bg-danger-bg text-danger-fg border-danger-border'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4" />
          ) : (
            <AlertTriangle className="h-4 w-4" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <ThreadStatsBar thread={thread} notesCount={notes.length} />

      <div className="flex gap-8">
        {/* Main Column */}
        <div className="flex-1 min-w-0 space-y-8">
          <ThreadRiskProfile thread={thread} />
          <ReviewPanel
            review={review ?? null}
            loading={reviewLoading}
            defaultPrNumber={1}
            defaultHeadSha={thread.commitSha}
            onRunReview={handleRunReview}
          />
          <ThreadNotes threadId={id} notes={notes} onMessage={setMessage} />
          {brief && <ThreadBriefSection brief={brief} />}
        </div>

        {/* Evidence Panel (Changed Files & Commits) */}
        <aside className="w-80 shrink-0 space-y-6">
          <FileChangesPanel files={filesList} />
          <CommitsList commits={commitsList} />
        </aside>
      </div>
    </div>
  )
}