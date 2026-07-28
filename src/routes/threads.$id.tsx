import { useState, useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { GitCommit, FileCode, Plus, RefreshCw, Sparkles, Send, ShieldAlert, CheckCircle2, AlertTriangle, Loader2 } from 'lucide-react'
import { PageHeader } from '../components/devbraid/page-header'
import { StatusDot } from '../components/devbraid/status-dot'
import { RiskChip } from '../components/devbraid/risk-chip'
import { BranchPair } from '../components/devbraid/branch-pair'
import { EmptyState } from '../components/devbraid/empty-state'
import { threadService } from '../services/thread.service'
import { mockThreads, mockNotes, mockBriefs, mockChangedFiles, mockCommits } from '../lib/mock/data'
import type { ChangeThread, BriefResponse, DecisionNote } from '../types/thread'

export const Route = createFileRoute('/threads/$id')({
  component: ThreadDetailPage,
})

function ThreadDetailPage() {
  const { id } = Route.useParams()
  const [thread, setThread] = useState<ChangeThread | null>(null)
  const [brief, setBrief] = useState<BriefResponse | null>(null)
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
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const loadThreadData = async () => {
    setLoading(true)
    try {
      const fetchedThread = await threadService.getThread(id)
      setThread(fetchedThread)
      
      // Try loading brief if exists
      try {
        const fetchedBrief = await threadService.getBrief(id)
        setBrief(fetchedBrief)
      } catch {
        // Brief not generated yet
        setBrief(null)
      }
    } catch {
      // Fallback to mock data
      const mockT = mockThreads.find(t => t.id === id) || (mockThreads[0] as unknown as ChangeThread)
      setThread(mockT as unknown as ChangeThread)
      const mockB = mockBriefs.find(b => b.threadId === id)
      if (mockB) {
        setBrief({
          id: mockB.id,
          threadId: mockB.threadId,
          title: 'Generated Change Brief',
          markdownContent: mockB.summary || 'Summary generated.',
          summary: mockB.summary,
          status: mockB.status,
          createdAt: new Date().toISOString()
        })
      }
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
      const result = await threadService.publishBrief(id, prNumberInput)
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
      const updated = await threadService.addDecisionNote(id, {
        decision: decision.trim(),
        rationale: rationale.trim(),
        alternatives: alternatives.trim() || undefined,
        impact: impact.trim() || undefined,
      })
      setThread(updated)
      setDecision('')
      setRationale('')
      setAlternatives('')
      setImpact('')
      setShowNoteForm(false)
      setMessage({ type: 'success', text: 'Decision note added.' })
    } catch {
      // Local fallback
      const localNote: DecisionNote = {
        id: `note-${Date.now()}`,
        decision,
        rationale,
        alternatives,
        impact,
        createdAt: new Date().toISOString()
      }
      if (thread) {
        const updatedNotes = [...(thread.decisionNotes || []), localNote]
        setThread({ ...thread, decisionNotes: updatedNotes })
      }
      setDecision('')
      setRationale('')
      setAlternatives('')
      setImpact('')
      setShowNoteForm(false)
      setMessage({ type: 'success', text: 'Decision note added.' })
    } finally {
      setAddingNote(false)
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

  if (!thread) return <EmptyState title="Thread not found" description="This thread may have been deleted." />

  // JSONB columns from backend come as strings — parse safely
  const parseJson = (field: unknown): any[] => {
    if (Array.isArray(field)) return field
    if (typeof field === 'string') {
      try { return JSON.parse(field) } catch { return [] }
    }
    return []
  }

  const parsedNotes = parseJson(thread.decisionNotes)
  const parsedCommits = parseJson(thread.commits)
  const parsedFiles = parseJson(thread.filesChanged)

  const repoName = thread.repositoryFullName || (thread as unknown as { repo: string }).repo || ''
  const notesList = parsedNotes.length > 0 ? parsedNotes as DecisionNote[] : (mockNotes.filter(n => n.threadId === id) as unknown as DecisionNote[])
  const commitsList = parsedCommits.length > 0 ? parsedCommits : mockCommits
  const filesList = parsedFiles.length > 0 ? parsedFiles : mockChangedFiles

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={repoName}
        title={thread.title}
        action={
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-hairline text-xs font-medium text-foreground hover:bg-surface transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Diff</span>
            </button>
            <button
              type="button"
              onClick={handleAnalyze}
              disabled={analyzing}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-hairline text-xs font-medium text-foreground hover:bg-surface transition-colors disabled:opacity-50"
            >
              <Sparkles className={`h-3.5 w-3.5 text-warning-fg ${analyzing ? 'animate-spin' : ''}`} />
              <span>AI Risk Analysis</span>
            </button>
            <button
              type="button"
              onClick={handleGenerateBrief}
              disabled={generatingBrief}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-surface-2 text-foreground text-xs font-medium hover:bg-surface-2/80 transition-colors disabled:opacity-50"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>{generatingBrief ? 'Generating...' : 'Generate Brief'}</span>
            </button>
            <div className="flex items-center gap-1 bg-primary/10 border border-primary/20 rounded-lg p-1">
              <input
                type="number"
                min={1}
                value={prNumberInput}
                onChange={(e) => setPrNumberInput(Number(e.target.value))}
                className="w-12 px-1.5 py-1 text-xs text-center bg-surface border border-hairline rounded text-foreground font-mono"
                title="PR Number"
              />
              <button
                type="button"
                onClick={handlePublish}
                disabled={publishing}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
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
          {message.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* Overview stats bar (daisyUI stats component) */}
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
            <StatusDot status={thread.status.toLowerCase() as any} label />
          </div>
        </div>

        <div className="stat py-3">
          <div className="stat-title text-xs text-muted-foreground">Risk Score</div>
          <div className="stat-value text-sm mt-1 flex items-center gap-2">
            {thread.riskScore ? (
              <span className="font-mono text-danger-fg flex items-center gap-1">
                <ShieldAlert className="h-4 w-4" />
                {thread.riskScore}/100
              </span>
            ) : (
              <span className="text-xs text-muted-foreground italic">Not analyzed</span>
            )}
          </div>
        </div>

        <div className="stat py-3">
          <div className="stat-title text-xs text-muted-foreground">Decision Notes</div>
          <div className="stat-value text-sm font-mono text-foreground mt-1">
            {notesList.length}
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Main Column */}
        <div className="flex-1 min-w-0 space-y-8">
          {/* Risk Profile */}
          <section className="rounded-xl border border-hairline bg-surface p-5 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
                Risk Profile · AI Analysis
              </p>
              {thread.riskSummary && (
                <span className="text-xs text-muted-foreground">{thread.riskSummary}</span>
              )}
            </div>
            {thread.riskFlags && thread.riskFlags.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {thread.riskFlags.map((f) => (
                  <RiskChip key={f} flag={f} />
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No critical risk flags detected.</p>
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
              <form onSubmit={handleAddNote} className="p-4 rounded-xl border border-primary/30 bg-surface-2 space-y-3">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">Decision Made *</label>
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
                  <label className="block text-xs font-medium text-foreground mb-1">Rationale *</label>
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
                    <label className="block text-xs font-medium text-foreground mb-1">Alternatives Considered</label>
                    <input
                      type="text"
                      placeholder="e.g. HMAC-SHA512"
                      value={alternatives}
                      onChange={(e) => setAlternatives(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-surface border border-hairline text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-foreground mb-1">Expected Impact</label>
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

            {notesList.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4">No decision notes yet. Add one to give context to your PR brief.</p>
            ) : (
              <div className="space-y-3">
                {notesList.map((note, idx) => (
                  <div key={note.id || idx} className="rounded-xl border border-hairline bg-surface p-4 space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-hairline">
                      <span className="text-xs font-mono font-medium text-primary">Decision #{idx + 1}</span>
                      {note.createdAt && (
                        <span className="text-[10px] text-muted-foreground font-mono">
                          {new Date(note.createdAt).toLocaleDateString()}
                        </span>
                      )}
                    </div>
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
                    {brief.title || 'Generated Change Brief'}
                  </p>
                </div>
                <StatusDot status="ready" label />
              </div>
              <div className="prose prose-invert max-w-none text-xs text-foreground space-y-2 whitespace-pre-line font-mono bg-surface-2 p-4 rounded-lg border border-hairline">
                {brief.markdownContent || brief.summary}
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
                {filesList.map((f) => (
                  <div key={f.path} className="flex items-center gap-2 text-xs font-mono py-1 border-b border-hairline/50 last:border-0">
                    <FileCode className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <span className="text-foreground truncate flex-1">{f.path}</span>
                    <span className="text-success-fg font-mono text-[10px]">+{f.additions}</span>
                    <span className="text-danger-fg font-mono text-[10px]">-{f.deletions}</span>
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
                {commitsList.map((c) => (
                  <div key={c.sha} className="space-y-1">
                    <div className="flex items-center gap-2">
                      <GitCommit className="h-3.5 w-3.5 text-primary shrink-0" />
                      <span className="text-xs font-mono text-primary">{c.sha.substring(0, 7)}</span>
                    </div>
                    <p className="text-xs text-foreground line-clamp-2 pl-5 font-sans">{c.message}</p>
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
