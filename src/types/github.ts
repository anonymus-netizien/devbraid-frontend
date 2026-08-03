export interface GitHubStatusResponse {
  connected: boolean
  valid: boolean
  githubUsername: string | null
  connectedAt: string | null
  lastValidatedAt: string | null
}

export interface GitHubConnection {
  id?: string
  githubUsername: string
  connectedAt: string
  lastValidatedAt: string | null
  scopes: string[]
  status?: 'active' | 'expired' | 'revoked'
  reposCount?: number
}

export interface GitRepository {
  fullName: string
  defaultBranch: string
  isPrivate: boolean
}

export interface Branch {
  name: string
}

export type ConnectionStatus = 'active' | 'expired' | 'revoked' | 'disconnected'
export type ModalStep = 'enter-pat' | 'validating' | 'pick-repo' | 'pick-branch'
