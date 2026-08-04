import type { Schema } from '../api/contract'

/** Backend GET /github/status payload (ApiResponse.data). */
export type GitHubStatusResponse = Schema<'GitHubStatusResponse'>

export interface GitHubConnection {
  id?: string
  githubUsername: string
  connectedAt: string
  lastValidatedAt: string | null
  scopes: string[]
  status?: 'active' | 'expired' | 'revoked'
  reposCount?: number
}

/** Backend GET /github/repos payload item (ApiResponse.data). */
export type GitRepository = Schema<'GitRepositoryDto'>

/** Backend GET /github/repos/{repo}/branches payload item (ApiResponse.data). */
export type Branch = Schema<'BranchDto'>

export type ConnectionStatus = 'active' | 'expired' | 'revoked' | 'disconnected'
export type ModalStep = 'enter-pat' | 'validating' | 'pick-repo' | 'pick-branch'
