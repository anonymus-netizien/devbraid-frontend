export type ThreadStatus = 'drafting' | 'analyzing' | 'ready' | 'published'
export type RiskFlag = 'AUTH' | 'MIGRATIONS' | 'PUBLIC_API' | 'DEPENDENCY' | 'CI'

export interface ChangeThread {
  id: string
  title: string
  repo: string
  headBranch: string
  baseBranch: string
  issueNumber?: number
  status: ThreadStatus
  riskFlags: RiskFlag[]
  notesCount: number
  createdAt: string
  updatedAt: string
}

export interface DecisionNote {
  id: string
  threadId: string
  decision: string
  rationale: string
  alternatives: string
  impact: string
  createdAt: string
}

export interface ChangedFile {
  path: string
  additions: number
  deletions: number
}

export interface Commit {
  sha: string
  message: string
  timestamp: string
}
