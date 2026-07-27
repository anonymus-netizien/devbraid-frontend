export interface GitHubConnection {
  id: string
  githubUsername: string
  connectedAt: string
  lastValidatedAt: string | null
  scopes: string[]
  // Additional fields for Lovable design compatibility
  username?: string
  addedAt?: string
  lastUsedAt?: string
  status?: 'active' | 'expired' | 'revoked'
  repos?: number
}

export interface GitRepository {
  fullName: string
  defaultBranch: string
  isPrivate: boolean
  // Additional fields for Lovable design compatibility
  id?: string
  name?: string
}

export interface Branch {
  name: string
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'
export type ModalStep = 'enter-pat' | 'validating' | 'pick-repo' | 'pick-branch'
