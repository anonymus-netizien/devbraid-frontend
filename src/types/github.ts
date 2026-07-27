export interface GitHubConnection {
  id: string
  githubUsername: string
  connectedAt: string
  lastValidatedAt: string | null
  scopes: string[]
}

export interface GitRepository {
  fullName: string
  defaultBranch: string
  isPrivate: boolean
}

export interface Branch {
  name: string
}

export type ConnectionStatus = 'disconnected' | 'connecting' | 'connected' | 'error'
export type ModalStep = 'enter-pat' | 'validating' | 'pick-repo' | 'pick-branch'
