import type { Page, Schema } from '../api/contract'

export type ThreadStatus =
  | 'DRAFTING'
  | 'ANALYZING'
  | 'READY'
  | 'PUBLISHED'
  | 'drafting'
  | 'analyzing'
  | 'ready'
  | 'published'
export type RiskFlag =
  'AUTH' | 'MIGRATIONS' | 'PUBLIC_API' | 'DEPENDENCY' | 'CI' | 'SECURITY' | 'PERFORMANCE'

/**
 * Mirrors the backend `NoteContext` enum (changethread/entity/NoteContext.java).
 * COMMIT/FILE take an optional contextRef pointing at the specific commit sha or file path.
 */
export type NoteContext = 'COMMIT' | 'FILE' | 'THREAD'

export interface DecisionNote {
  id?: string
  threadId?: string
  /** Required by the backend CreateNoteRequest — must be sent on create. */
  context: NoteContext
  /** Optional reference for COMMIT/FILE contexts (commit sha or file path). */
  contextRef?: string
  decision: string
  rationale: string
  alternatives?: string
  impact?: string
  createdAt?: string
}

export interface ChangedFile {
  filename?: string
  path?: string
  additions: number
  deletions: number
  status?: string
}

export interface CommitSummary {
  sha: string
  message: string
  author?: { name?: string; email?: string } | null
}

export interface Commit {
  sha: string
  message: string
  authorName?: string
  timestamp?: string
}

export interface ChangeThread {
  id: string
  title: string
  description?: string
  repositoryFullName: string
  headBranch: string
  baseBranch: string
  source?: string
  status: ThreadStatus
  riskLevel?: string
  riskScore?: number
  riskSummary?: string
  riskFlags: RiskFlag[]
  commits?: CommitSummary[]
  changedFiles?: ChangedFile[]
  riskReport?: Record<string, unknown>
  commitSha?: string
  decisionNotes?: DecisionNote[]
  notes?: DecisionNote[]
  notesCount?: number
  createdAt: string
  updatedAt: string
}

export type CreateThreadRequest = Schema<'CreateThreadRequest'>

export type UpdateThreadRequest = Schema<'UpdateThreadRequest'>

export type BriefResponse = Schema<'BriefResponse'>

export type PublishResponse = Schema<'PublishResponse'>

export type NoteResponse = Schema<'NoteResponse'>

export type ThreadEvent = Schema<'ThreadEventResponse'>

export type CreateThreadEventRequest = Schema<'CreateThreadEventRequest'>

export type PaginatedEvents = Page<ThreadEvent>

export type Snapshot = Schema<'SnapshotResponse'>

export type CreateSnapshotRequest = Schema<'CreateSnapshotRequest'>

export type FileComment = Schema<'FileCommentResponse'>

export type CreateFileCommentRequest = Schema<'CreateFileCommentRequest'>

export type UpdateFileCommentRequest = Schema<'UpdateFileCommentRequest'>

export type PaginatedThreads = Page<ChangeThread>

export interface BriefListItem {
  id: string
  threadId: string
  threadTitle: string
  repositoryFullName: string
  headBranch: string
  baseBranch: string
  threadStatus: string
  publishedToGithub: boolean
  createdAt: string
}

export interface PaginatedBriefs {
  content: BriefListItem[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}

export interface NoteListItem {
  id: string
  threadId: string
  threadTitle: string
  repositoryFullName: string
  decision: string
  rationale: string
  alternatives?: string
  impact?: string
  status: string
  createdAt: string
}

export interface PaginatedNotes {
  content: NoteListItem[]
  totalPages: number
  totalElements: number
  size: number
  number: number
}
