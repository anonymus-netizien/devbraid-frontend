import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import {
  GitCommit,
  FileCode,
  Plus,
  RefreshCw,
  Sparkles,
  Send,
  ShieldAlert,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  Pencil,
  Trash2,
} from 'lucide-react'
import { PageHeader, EmptyState } from '@/components/devbraid/states'
import { StatusDot, BranchPair } from '@/components/devbraid/chips'
import { threadService } from '../services/thread.service'
import type { ChangeThread, BriefResponse, NoteResponse } from '../types/thread'

export const Route = createFileRoute('/threads/$id')({
  component: ThreadDetailPage,
})

function ThreadDetailPage() {
  const { id } = Route.useParams()
  const [thread, setThread] = useState<ChangeThread | null>(null)
  const [brief, setBrief] = useState<BriefResponse | null>(null)
  const [notes, setNotes] = useState<NoteResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [generatingBrief, setGeneratingBrief] = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [prNumberInput, setPrNumberInput] = useState<number>(1)

  // Note addition state
  const [showNoteForm, setShowNoteForm] = useState(false)
  const [decision, setDecision] = useState('')
  const [rationale, setRationale] = useState('')
  const [alternatives, setAlternatives] = useState('')
  const [impact, setImpact] = useState('')
  const [addingNote, setAddingNote] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editDecision, setEditDecision] = useState('')
  const [editRationale, setEditRationale] = useState('')
  const [editAlternatives, setEditAlternatives] = useState('')
  const [editImpact, setEditImpact] = useState('')
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadThreadData = async () => {
    setLoading(true)
    try {
      const fetchedThread = await threadService.getThread(id)
      setThread(fetchedThread)

      // Load notes separately via the dedicated notes endpoint
      try {
        const fetchedNotes = await threadService.listThreadNotes(id)
        setNotes(fetchedNotes)
      } catch {
        setNotes([])
      }

      // Try loading brief if exists
      try {
        const fetchedBrief = await threadService.getBrief(id)
        setBrief(fetchedBrief)
      } catch {
        setBrief(null)
      }
    } catch {
      setThread(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadThreadData()
  }, [id])

  const handleRefresh = async () => {
    if (!thread) return
    setRefreshing(true)
    setMessage(null)
    try {
      const updated = await threadService.refreshThread(id)
      setThread(updated)
      setMessage({ type: 'success', text: 'Thread commits and diffs refreshed from GitHub.' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to refresh thread'
      setMessage({ type: 'error', text: msg })
    } finally {
      setRefreshing(false)
    }
  }

  const handleAnalyze = async () => {
    if (!thread) return
    setAnalyzing(true)
    setMessage(null)
    try {
      const updated = await threadService.analyzeThread(id)
      setThread(updated)
      setMessage({ type: 'success', text: 'AI Risk Analysis completed.' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to run risk analysis'
      setMessage({ type: 'error', text: msg })
    } finally {
      setAnalyzing(false)
    }
  }

  const handleGenerateBrief = async () => {
    if (!thread) return
    setGeneratingBrief(true)
    setMessage(null)
    try {
      const newBrief = await threadService.generateBrief(id)
      setBrief(newBrief)
      setMessage({ type: 'success', text: 'AI Change Brief generated successfully!' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to generate brief'
      setMessage({ type: 'error', text: msg })
    } finally {
      setGeneratingBrief(false)
    }
  }

  const handlePublish = async () => {
    if (!thread || !prNumberInput) return
    setPublishing(true)
    setMessage(null)
    try {
      await threadService.publishBrief(id, prNumberInput)
      setMessage({ type: 'success', text: `Published to GitHub PR #${prNumberInput}!` })
      if (thread) {
        setThread({ ...thread, status: 'PUBLISHED' })
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to publish brief'
      setMessage({ type: 'error', text: msg })
    } finally {
      setPublishing(false)
    }
  }

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!decision.trim() || !rationale.trim()) return

    setAddingNote(true)
    setMessage(null)

    try {
      const createdNote = await threadService.addDecisionNote(id, {
        decision: decision.trim(),
        rationale: rationale.trim(),
        alternatives: alternatives.trim() || undefined,
        impact: impact.trim() || undefined,
      })
      setNotes([createdNote, ...notes])
      setDecision('')
      setRationale('')
      setAlternatives('')
      setImpact('')
      setShowNoteForm(false)
      setMessage({ type: 'success', text: 'Decision note added.' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to add note'
      setMessage({ type: 'error', text: msg })
    } finally {
      setAddingNote(false)
    }
  }

  const handleEditNote = (note: NoteResponse) => {
    setEditingNoteId(note.id)
    setEditDecision(note.decision)
    setEditRationale(note.rationale)
    setEditAlternatives(note.alternatives || '')
    setEditImpact(note.impact || '')
  }

  const handleSaveEdit = async (noteId: string) => {
    if (!editDecision.trim() || !editRationale.trim()) return
    setMessage(null)
    try {
      const updated = await threadService.updateNote(id, noteId, {
        decision: editDecision.trim(),
        rationale: editRationale.trim(),
        alternatives: editAlternatives.trim() || undefined,
        impact: editImpact.trim() || undefined,
      })
      setNotes(notes.map((n) => (n.id === noteId ? updated : n)))
      setEditingNoteId(null)
      setMessage({ type: 'success', text: 'Note updated.' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update note'
      setMessage({ type: 'error', text: msg })
    }
  }

  const handleDeleteNote = async (noteId: string) => {
    setDeletingNoteId(noteId)
    setMessage(null)
    try {
      await threadService.deleteNote(id, noteId)
      setNotes(notes.filter((n) => n.id !== noteId))
      setMessage({ type: 'success', text: 'Note deleted.' })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to delete note'
      setMessage({ type: 'error', text: msg })
    } finally {
      setDeletingNoteId(null)
    }
  }

  if (loading) {
    return (
      <div className="py-20 text-center space-y-4">
        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
        <p className="text-sm text-muted-foreground">Loading Change Thread...</p>
      </div>
    )
  }

  if (!thread)
    return <EmptyState title="Thread not found" description="This thread may have been deleted." />

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

  const commitsList = Array.isArray(thread.commits) ? thread.commits : parseJson(thread.commits)
  const filesList = Array.isArray(thread.changedFiles)
    ? thread.changedFiles
    : parseJson(thread.changedFiles)

  // riskReport arrives as a typed object now — parse strings only for older responses
  const riskReportData =
    thread.riskReport && typeof thread.riskReport === 'object'
      ? thread.riskReport
      : thread.riskReport && typeof thread.riskReport === 'string'
        ? parseJson(thread.riskReport)
        : {}
  const riskFlagsFromReport = Array.isArray(riskReportData?.flags) ? riskReportData.flags : []

  const repoName = thread.repositoryFullName || ''
  const statusLower = (thread.status || 'drafting').toLowerCase()

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={repoName}
        title={thread.title}
        actions={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="btn btn-ghost btn-sm"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Diff</span>
            </button>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={analyzing}
              className="btn btn-ghost btn-sm"
            >
              <Sparkles
                className={`h-3.5 w-3.5 text-warning-fg ${analyzing ? 'animate-spin' : ''}`}
              />
              <span>AI Risk Analysis</span>
            </button>
            <button
              type="button"
              onClick={handleGenerateBrief}
              disabled={generatingBrief}
              className="btn btn-soft btn-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{generatingBrief ? 'Generating...' : 'Generate Brief'}</span>
            </button>
            <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-lg p-1">
              <div className="flex items-center gap-1">
                <span className="text-[10px] text-muted-foreground font-mono pl-1">PR #</span>
                <input
                  type="number"
                  min={1}
                  value={prNumberInput}
                  onChange={(e) => setPrNumberInput(Number(e.target.value))}
                  className="w-14 px-1.5 py-1 text-xs text-center bg-surface border border-hairline rounded text-foreground font-mono"
                  title="Enter the GitHub Pull Request number to post this brief as a comment"
                  placeholder="#"
                />
              </div>
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing}
                className="btn btn-primary btn-sm"
              >
                <Send className="h-3.5 w-3.5" />
                <span>{publishing ? 'Publishing...' : 'Publish PR Comment'}</span>
              </button>
            </div>
          </div>
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

      {/* Overview stats bar */}
      <div className="stats stats-horizontal shadow border border-hairline bg-surface w-full rounded-xl">
        <div className="stat py-3">
          <div className="stat-title text-xs text-muted-foreground">Branch Pair</div>
          <div className="stat-value text-sm mt-1">
            <BranchPair head={thread.headBranch} base={thread.baseBranch} />
          </div>
        </div>

        <div className="stat py-3">
          <div className="stat-title text-xs text-muted-foreground">Thread Status</div>
          <div className="stat-value text-sm mt-1 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
              <StatusDot status={statusLower} />
              {thread.status?.toLowerCase() || 'draft'}
            </span>
          </div>
        </div>

        <div className="stat py-3">
          <div className="stat-title text-xs text-muted-foreground">Risk Score</div>
          <div className="stat-value text-sm mt-1 flex items-center gap-2">
            {thread.riskLevel ? (
              <span className="font-mono text-danger-fg flex items-center gap-1">
                <ShieldAlert className="h-4 w-4" />
                {thread.riskLevel}
              </span>
            ) : (
              <span className="text-xs text-muted-foreground italic">Not analyzed</span>
            )}
          </div>
        </div>

        <div className="stat py-3">
          <div className="stat-title text-xs text-muted-foreground">Decision Notes</div>
          <div className="stat-value text-sm font-mono text-foreground mt-1">{notes.length}</div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Main Column */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Risk Profile */}
          <section className="rounded-xl border border-hairline bg-surface p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Risk Profile · {thread.riskLevel ? 'Deterministic Analysis' : 'Not analyzed'}
              </p>
              {thread.riskLevel && (
                <span
                  className={`text-xs font-mono px-2 py-0.5 rounded-full border ${
                    thread.riskLevel === 'HIGH' || thread.riskLevel === 'CRITICAL'
                      ? 'bg-danger-bg text-danger-fg border-danger-border'
                      : thread.riskLevel === 'MEDIUM'
                        ? 'bg-warning-bg text-warning-fg border-warning-border'
                        : 'bg-success-bg text-success-fg border-success-border'
                  }`}
                >
                  {thread.riskLevel}
                </span>
              )}
            </div>
            {riskFlagsFromReport.length > 0 ? (
              <div className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {riskFlagsFromReport.map((f: any, i: number) => (
                    <span
                      key={f.rule || i}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border ${
                        f.severity === 'HIGH' || f.severity === 'CRITICAL'
                          ? 'border-danger-border bg-danger-bg text-danger-fg'
                          : f.severity === 'MEDIUM'
                            ? 'border-warning-border bg-warning-bg text-warning-fg'
                            : 'border-hairline bg-surface-2 text-muted-foreground'
                      }`}
                      title={f.message || ''}
                    >
                      {f.rule}
                    </span>
                  ))}
                </div>
                {riskFlagsFromReport.map(
                  (f: any, i: number) =>
                    f.message && (
                      <p key={`msg-${i}`} className="text-xs text-muted-foreground pl-1">
                        {f.message}
                      </p>
                    ),
                )}
              </div>
            ) : thread.riskLevel ? (
              <p className="text-sm text-muted-foreground">
                Risk assessed: <span className="font-mono text-foreground">{thread.riskLevel}</span>
                . No specific risk flags detected.
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Run AI Risk Analysis to evaluate this thread.
              </p>
            )}
          </section>

          {/* Decision Notes */}
          <section className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                  Decision Notes
                </p>
                <p className="text-xs text-muted-foreground italic">
                  Developer-attributed reasoning for AI brief synthesis
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowNoteForm(!showNoteForm)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-hairline text-xs font-medium text-foreground hover:bg-surface transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{showNoteForm ? 'Cancel' : 'Add Note'}</span>
              </button>
            </div>

            {/* Note creation form */}
            {showNoteForm && (
              <form
                onSubmit={handleAddNote}
                className="p-4 rounded-xl border border-primary/30 bg-surface-2 space-y-3"
              >
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Decision Made *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Switched to RSA-SHA256 for token hashing"
                    value={decision}
                    onChange={(e) => setDecision(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Rationale *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Why this decision was chosen..."
                    value={rationale}
                    onChange={(e) => setRationale(e.target.value)}
                    required
                    className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Alternatives Considered
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. HMAC-SHA512"
                      value={alternatives}
                      onChange={(e) => setAlternatives(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">
                      Expected Impact
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Backward compatible security upgrade"
                      value={impact}
                      onChange={(e) => setImpact(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="submit"
                    disabled={addingNote || !decision.trim()}
                    className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
                  >
                    {addingNote && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                    Save Decision Note
                  </button>
                </div>
              </form>
            )}

            {notes.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">
                No decision notes yet. Add one to give context to your PR brief.
              </p>
            ) : (
              <div className="space-y-3">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="rounded-xl border border-hairline bg-surface p-4 space-y-2 group"
                  >
                    <div className="flex items-center justify-between pb-2 border-b border-hairline">
                      <span className="text-xs font-mono font-medium text-primary">
                        Decision Note
                      </span>
                      <div className="flex items-center gap-2">
                        {note.createdAt && (
                          <span className="text-[10px] text-muted-foreground font-mono">
                            {new Date(note.createdAt).toLocaleDateString()}
                          </span>
                        )}
                        <div className="hidden group-hover:flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleEditNote(note)}
                            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-surface-2 transition-colors"
                            title="Edit note"
                          >
                            <Pencil className="h-3 w-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (
                                window.confirm(
                                  'Are you sure you want to delete this note? This action cannot be undone.',
                                )
                              ) {
                                handleDeleteNote(note.id)
                              }
                            }}
                            disabled={deletingNoteId === note.id}
                            className="p-1 rounded text-muted-foreground hover:text-danger-fg hover:bg-danger-bg transition-colors"
                            title="Delete note"
                          >
                            {deletingNoteId === note.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>

                    {editingNoteId === note.id ? (
                      <div className="space-y-3 pt-2">
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1">
                            Decision
                          </label>
                          <input
                            type="text"
                            value={editDecision}
                            onChange={(e) => setEditDecision(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-foreground mb-1">
                            Rationale
                          </label>
                          <textarea
                            rows={2}
                            value={editRationale}
                            onChange={(e) => setEditRationale(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary resize-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">
                              Alternatives
                            </label>
                            <input
                              type="text"
                              value={editAlternatives}
                              onChange={(e) => setEditAlternatives(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-muted-foreground mb-1">
                              Impact
                            </label>
                            <input
                              type="text"
                              value={editImpact}
                              onChange={(e) => setEditImpact(e.target.value)}
                              className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                            />
                          </div>
                        </div>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(note.id)}
                            disabled={!editDecision.trim() || !editRationale.trim()}
                            className="px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 disabled:opacity-50"
                          >
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingNoteId(null)}
                            className="px-3 py-1.5 rounded-lg border border-hairline text-xs text-muted-foreground hover:text-foreground"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-muted-foreground mb-0.5">Decision</p>
                          <p className="text-foreground font-medium">{note.decision}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground mb-0.5">Rationale</p>
                          <p className="text-foreground">{note.rationale}</p>
                        </div>
                        {note.alternatives && (
                          <div>
                            <p className="text-muted-foreground mb-0.5">Alternatives</p>
                            <p className="text-foreground">{note.alternatives}</p>
                          </div>
                        )}
                        {note.impact && (
                          <div>
                            <p className="text-muted-foreground mb-0.5">Impact</p>
                            <p className="text-foreground">{note.impact}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Generated Brief */}
          {brief && (
            <section className="rounded-xl border border-hairline bg-surface p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-hairline pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  <p className="text-xs font-mono uppercase tracking-widest text-foreground font-semibold">
                    Generated Change Brief
                  </p>
                </div>
                {brief.publishedToGithub ? (
                  <span className="inline-flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
                    <StatusDot status="published" />
                    published
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-xs capitalize text-muted-foreground">
                    <StatusDot status="ready" />
                    ready
                  </span>
                )}
              </div>
              <div className="prose prose-invert max-w-none text-xs text-foreground space-y-2 whitespace-pre-line font-mono bg-surface-2 p-4 rounded-lg border border-hairline">
                {brief.content}
              </div>
            </section>
          )}
        </div>

        {/* Evidence Panel (Changed Files & Commits) */}
        <aside className="w-80 shrink-0 space-y-6">
          {/* Files Changed */}
          <div className="rounded-xl border border-hairline bg-surface p-4 space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Changed Files ({filesList.length})
            </p>
            {filesList.length === 0 ? (
              <p className="text-xs text-muted-foreground">No changed files detected.</p>
            ) : (
              <div className="space-y-2">
                {filesList.map((f: any) => (
                  <div
                    key={f.filename || f.path}
                    className="flex items-center gap-2 text-xs font-mono py-1 border-b border-hairline/50 last:border-0"
                  >
                    <FileCode className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-foreground truncate flex-1">{f.filename || f.path}</span>
                    <span className="text-success-fg font-mono text-[10px]">
                      +{f.additions || 0}
                    </span>
                    <span className="text-danger-fg font-mono text-[10px]">
                      -{f.deletions || 0}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Commits List */}
          <div className="rounded-xl border border-hairline bg-surface p-4 space-y-3">
            <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              Commits ({commitsList.length})
            </p>
            {commitsList.length === 0 ? (
              <p className="text-xs text-muted-foreground">No commits synced yet.</p>
            ) : (
              <div className="space-y-3">
                {commitsList.map((c: any) => (
                  <div key={c.sha} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <GitCommit className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-xs font-mono text-primary">
                        {c.sha?.substring(0, 7)}
                      </span>
                    </div>
                    <p className="text-xs text-foreground line-clamp-2 pl-5 font-sans">
                      {c.message}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
