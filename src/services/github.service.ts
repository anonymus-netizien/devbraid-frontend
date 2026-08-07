import apiClient from '../api/axios'
import { unwrap } from '../api/envelope'
import type { ApiResponse } from '../types/api'
import type { GitHubStatusResponse, GitRepository, Branch } from '../types/github'

export const githubService = {
  async connect(personalAccessToken: string): Promise<GitHubStatusResponse> {
    const response = await apiClient.post<ApiResponse<GitHubStatusResponse>>('/github/connect', {
      personalAccessToken,
    })
    return unwrap(response.data)
  },

  async disconnect(): Promise<void> {
    await apiClient.delete<ApiResponse<null>>('/github/disconnect')
  },

  async getStatus(): Promise<GitHubStatusResponse> {
    const response = await apiClient.get<ApiResponse<GitHubStatusResponse>>('/github/status')
    return unwrap(response.data)
  },

  async listRepositories(): Promise<GitRepository[]> {
    const response = await apiClient.get<ApiResponse<GitRepository[]>>('/github/repos')
    return unwrap(response.data)
  },

  async listBranches(owner: string, repo: string): Promise<Branch[]> {
    const response = await apiClient.get<ApiResponse<Branch[]>>(
      `/github/repos/${owner}/${repo}/branches`,
    )
    return unwrap(response.data)
  },
}

export default githubService
