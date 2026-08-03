import type { ApiResponse } from '../types/api'
import type {
  CodebaseIndex,
  DependencyGraphResponse,
  FileIndex,
  StartIndexRequest,
} from '../types/indexing'
import apiClient from '../api/axios'
import { unwrap } from '../api/envelope'

export const indexingService = {
  /**
   * List all codebase indexes for the current user.
   */
  async listIndexes(): Promise<CodebaseIndex[]> {
    const response = await apiClient.get<ApiResponse<CodebaseIndex[]>>('/indexing/list')
    return unwrap(response.data)
  },

  /**
   * Start indexing a repository (or raw file contents).
   */
  async startIndexing(request: StartIndexRequest): Promise<CodebaseIndex> {
    const response = await apiClient.post<ApiResponse<CodebaseIndex>>('/indexing/start', request)
    return unwrap(response.data)
  },

  /**
   * Fetch a single index by ID.
   */
  async getIndex(indexId: string): Promise<CodebaseIndex> {
    const response = await apiClient.get<ApiResponse<CodebaseIndex>>(`/indexing/${indexId}`)
    return unwrap(response.data)
  },

  /**
   * Search indexed files by name/content pattern.
   */
  async searchFiles(indexId: string, pattern: string): Promise<FileIndex[]> {
    const response = await apiClient.get<ApiResponse<FileIndex[]>>(`/indexing/${indexId}/search`, {
      params: { pattern },
    })
    return unwrap(response.data)
  },

  /**
   * All indexed files for one index.
   */
  async getFiles(indexId: string): Promise<FileIndex[]> {
    const response = await apiClient.get<ApiResponse<FileIndex[]>>(`/indexing/${indexId}/files`)
    return unwrap(response.data)
  },

  /**
   * Indexed files for a single language.
   */
  async getFilesByLanguage(indexId: string, language: string): Promise<FileIndex[]> {
    const response = await apiClient.get<ApiResponse<FileIndex[]>>(
      `/indexing/${indexId}/language/${language}`,
    )
    return unwrap(response.data)
  },

  /**
   * Dependency graph for an index, rooted at an optional node.
   */
  async getGraph(
    indexId: string,
    nodeId?: string,
    depth?: number,
  ): Promise<DependencyGraphResponse> {
    const response = await apiClient.get<ApiResponse<DependencyGraphResponse>>(
      `/indexing/${indexId}/graph`,
      { params: { nodeId, depth } },
    )
    return unwrap(response.data)
  },
}

export default indexingService
