import apiClient from '../api/axios'
import { unwrap } from '../api/envelope'
import type { ApiResponse } from '../types/api'
import type {
  ChangeThread,
  CreateThreadRequest,
  UpdateThreadRequest,
  BriefResponse,
  PublishResponse,
  PaginatedThreads,
  PaginatedBriefs,
  PaginatedNotes,
  DecisionNote,
  NoteResponse,
  FileComment,
  CreateFileCommentRequest,
  UpdateFileCommentRequest,
} from '../types/thread'

export const threadService = {
  /**
   * Create a new Change Thread for a repository and branch pair.
   */
  async createThread(request: CreateThreadRequest): Promise<ChangeThread> {
    const response = await apiClient.post<ApiResponse<ChangeThread>>('/threads', request)
    return unwrap(response.data)
  },

  /**
   * Fetch paginated list of Change Threads.
   */
  async listThreads(page = 0, size = 20): Promise<PaginatedThreads> {
    const response = await apiClient.get<ApiResponse<PaginatedThreads>>('/threads', {
      params: { page, size },
    })
    return unwrap(response.data)
  },

  /**
   * Fetch single Change Thread details by ID.
   */
  async getThread(id: string): Promise<ChangeThread> {
    const response = await apiClient.get<ApiResponse<ChangeThread>>(`/threads/${id}`)
    return unwrap(response.data)
  },

  /**
   * Server-side keyword search over thread title + description.
   */
  async searchThreads(q: string, page = 0, size = 20): Promise<PaginatedThreads> {
    const response = await apiClient.get<ApiResponse<PaginatedThreads>>('/threads/search', {
      params: { q, page, size },
    })
    return unwrap(response.data)
  },

  /**
   * Paginated threads for one repository (owner/name).
   */
  async searchByRepo(repositoryFullName: string, page = 0, size = 20): Promise<PaginatedThreads> {
    const response = await apiClient.get<ApiResponse<PaginatedThreads>>('/threads/search/repo', {
      params: { repositoryFullName, page, size },
    })
    return unwrap(response.data)
  },

  /**
   * Paginated threads filtered by lifecycle status (DRAFT | ANALYZING | READY | PUBLISHED).
   */
  async searchByStatus(status: string, page = 0, size = 20): Promise<PaginatedThreads> {
    const response = await apiClient.get<ApiResponse<PaginatedThreads>>('/threads/search/status', {
      params: { status, page, size },
    })
    return unwrap(response.data)
  },

  /**
   * Update Change Thread details or status.
   */
  async updateThread(id: string, request: UpdateThreadRequest): Promise<ChangeThread> {
    const response = await apiClient.put<ApiResponse<ChangeThread>>(`/threads/${id}`, request)
    return unwrap(response.data)
  },

  /**
   * Delete Change Thread by ID.
   */
  async deleteThread(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/threads/${id}`)
  },

  /**
   * Re-sync commits & diffs from GitHub.
   */
  async refreshThread(id: string): Promise<ChangeThread> {
    const response = await apiClient.post<ApiResponse<ChangeThread>>(`/threads/${id}/refresh`)
    return unwrap(response.data)
  },

  /**
   * Trigger AI Risk Analysis for a thread.
   */
  async analyzeThread(id: string): Promise<ChangeThread> {
    const response = await apiClient.post<ApiResponse<ChangeThread>>(`/threads/${id}/analyze`)
    return unwrap(response.data)
  },

  /**
   * Generate an AI Markdown Brief for a thread.
   */
  async generateBrief(id: string): Promise<BriefResponse> {
    const response = await apiClient.post<ApiResponse<BriefResponse>>(`/threads/${id}/brief`)
    return unwrap(response.data)
  },

  /**
   * Get an existing Markdown Brief for a thread.
   */
  async getBrief(id: string): Promise<BriefResponse> {
    const response = await apiClient.get<ApiResponse<BriefResponse>>(`/threads/${id}/brief`)
    return unwrap(response.data)
  },

  /**
   * Publish generated brief as a comment on a GitHub PR.
   */
  async publishBrief(id: string, prNumber: number): Promise<PublishResponse> {
    const response = await apiClient.post<ApiResponse<PublishResponse>>(
      `/threads/${id}/publish`,
      null,
      {
        params: { prNumber },
      },
    )
    return unwrap(response.data)
  },

  /**
   * Add a decision note to a thread.
   */
  async addDecisionNote(
    threadId: string,
    note: Omit<DecisionNote, 'id' | 'createdAt'>,
  ): Promise<NoteResponse> {
    const response = await apiClient.post<ApiResponse<NoteResponse>>(
      `/threads/${threadId}/notes`,
      note,
    )
    return unwrap(response.data)
  },

  /**
   * List notes for a thread.
   */
  async listThreadNotes(threadId: string): Promise<NoteResponse[]> {
    const response = await apiClient.get<ApiResponse<NoteResponse[]>>(`/threads/${threadId}/notes`)
    return unwrap(response.data)
  },

  /**
   * Update a decision note.
   */
  async updateNote(
    threadId: string,
    noteId: string,
    note: Partial<DecisionNote>,
  ): Promise<NoteResponse> {
    const response = await apiClient.put<ApiResponse<NoteResponse>>(
      `/threads/${threadId}/notes/${noteId}`,
      note,
    )
    return unwrap(response.data)
  },

  /**
   * Delete a decision note.
   */
  async deleteNote(threadId: string, noteId: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/threads/${threadId}/notes/${noteId}`)
  },

  /**
   * List all file comments on a thread.
   */
  async listComments(threadId: string): Promise<FileComment[]> {
    const response = await apiClient.get<ApiResponse<FileComment[]>>(
      `/threads/${threadId}/comments`,
    )
    return unwrap(response.data)
  },

  /**
   * List comments anchored to a single file path.
   */
  async listCommentsByFile(threadId: string, filePath: string): Promise<FileComment[]> {
    const response = await apiClient.get<ApiResponse<FileComment[]>>(
      `/threads/${threadId}/comments/by-file`,
      { params: { filePath } },
    )
    return unwrap(response.data)
  },

  /**
   * Add a comment anchored to a file path (and optional line range).
   */
  async createComment(threadId: string, comment: CreateFileCommentRequest): Promise<FileComment> {
    const response = await apiClient.post<ApiResponse<FileComment>>(
      `/threads/${threadId}/comments`,
      comment,
    )
    return unwrap(response.data)
  },

  /**
   * Update a comment's body, line range, or resolution status.
   */
  async updateComment(
    threadId: string,
    commentId: string,
    comment: UpdateFileCommentRequest,
  ): Promise<FileComment> {
    const response = await apiClient.put<ApiResponse<FileComment>>(
      `/threads/${threadId}/comments/${commentId}`,
      comment,
    )
    return unwrap(response.data)
  },

  /**
   * Permanently delete a file comment.
   */
  async deleteComment(threadId: string, commentId: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/threads/${threadId}/comments/${commentId}`)
  },

  /**
   * Get paginated list of all briefs.
   */
  async listBriefs(page = 0, size = 20): Promise<PaginatedBriefs> {
    const response = await apiClient.get<ApiResponse<PaginatedBriefs>>('/briefs', {
      params: { page, size },
    })
    return unwrap(response.data)
  },

  /**
   * Get a single brief by ID.
   */
  async getBriefById(id: string): Promise<BriefResponse> {
    const response = await apiClient.get<ApiResponse<BriefResponse>>(`/briefs/${id}`)
    return unwrap(response.data)
  },

  /**
   * Get paginated list of all decision notes.
   */
  async listNotes(page = 0, size = 20): Promise<PaginatedNotes> {
    const response = await apiClient.get<ApiResponse<PaginatedNotes>>('/notes', {
      params: { page, size },
    })
    return unwrap(response.data)
  },
}

export default threadService
