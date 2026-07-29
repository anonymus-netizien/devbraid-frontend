export type ThreadStatus = 'DRAFTING' | 'ANALYZING' | 'READY' | 'PUBLISHED' | 'drafting' | 'analyzing' | 'ready' | 'published';
export type RiskFlag = 'AUTH' | 'MIGRATIONS' | 'PUBLIC_API' | 'DEPENDENCY' | 'CI' | 'SECURITY' | 'PERFORMANCE';

export interface DecisionNote {
  id?: string;
  threadId?: string;
  decision: string;
  rationale: string;
  alternatives?: string;
  impact?: string;
  createdAt?: string;
}

export interface ChangedFile {
  path: string;
  additions: number;
  deletions: number;
  status?: string;
}

export interface Commit {
  sha: string;
  message: string;
  authorName?: string;
  timestamp?: string;
}

export interface ChangeThread {
  id: string;
  title: string;
  description?: string;
  repositoryFullName: string;
  headBranch: string;
  baseBranch: string;
  source?: string;
  status: ThreadStatus;
  riskLevel?: string;
  riskScore?: number;
  riskSummary?: string;
  riskFlags: RiskFlag[];
  /** Backend returns JSONB as strings — use parseJson() to parse */
  commits?: any;
  /** Backend returns JSONB as strings — use parseJson() to parse */
  changedFiles?: any;
  /** Backend may send riskReport as JSONB string */
  riskReport?: any;
  commitSha?: string;
  decisionNotes?: DecisionNote[];
  notes?: DecisionNote[];
  notesCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateThreadRequest {
  repositoryFullName: string;
  headBranch: string;
  baseBranch: string;
  title: string;
  description?: string;
}

export interface UpdateThreadRequest {
  title?: string;
  description?: string;
  status?: ThreadStatus;
}

export interface BriefResponse {
  id: string;
  threadId: string;
  content: string;
  publishedToGithub: boolean;
  publishUrl?: string;
  createdAt: string;
}

export interface PublishResponse {
  success: boolean;
  commentUrl: string;
  publishedAt: string;
}

export interface NoteResponse {
  id: string;
  threadId: string;
  authorId?: string;
  context?: string;
  contextRef?: string;
  decision: string;
  rationale: string;
  alternatives?: string;
  impact?: string;
  status?: string;
  createdAt: string;
}

export interface PaginatedThreads {
  content: ChangeThread[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface BriefListItem {
  id: string;
  threadId: string;
  threadTitle: string;
  repositoryFullName: string;
  headBranch: string;
  baseBranch: string;
  threadStatus: string;
  publishedToGithub: boolean;
  createdAt: string;
}

export interface PaginatedBriefs {
  content: BriefListItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface NoteListItem {
  id: string;
  threadId: string;
  threadTitle: string;
  repositoryFullName: string;
  decision: string;
  rationale: string;
  alternatives?: string;
  impact?: string;
  status: string;
  createdAt: string;
}

export interface PaginatedNotes {
  content: NoteListItem[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
