export type BriefStatus = 'draft' | 'ready' | 'published'

export interface Citation {
  type: 'commit' | 'file'
  value: string
}

export interface BriefClaim {
  text: string
  citations: Citation[]
  provenance: 'cited' | 'inference'
}

export interface BriefSection {
  title: string
  claims: BriefClaim[]
}

export interface ChangeBrief {
  id: string
  threadId: string
  title: string
  status: BriefStatus
  sections: BriefSection[]
  unresolvedQuestions: string[]
  createdAt: string
  updatedAt: string
}
