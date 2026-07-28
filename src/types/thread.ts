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
  status: ThreadStatus;
  riskScore?: number;
  riskSummary?: string;
  riskFlags: RiskFlag[];
  commits?: Commit[];
  filesChanged?: ChangedFile[];
  decisionNotes?: DecisionNote[];
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
  title: string;
  markdownContent: string;
  summary: string;
  status: string;
  createdAt: string;
}

export interface PublishResponse {
  success: boolean;
  commentUrl: string;
  publishedAt: string;
}

export interface PaginatedThreads {
  content: ChangeThread[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}
