import apiClient from '../api/axios';
import type { ApiResponse } from '../types/api';
import type {
  ChangeThread,
  CreateThreadRequest,
  UpdateThreadRequest,
  BriefResponse,
  PublishResponse,
  PaginatedThreads,
  DecisionNote
} from '../types/thread';

export const threadService = {
  /**
   * Create a new Change Thread for a repository and branch pair.
   */
  async createThread(request: CreateThreadRequest): Promise<ChangeThread> {
    const response = await apiClient.post<ApiResponse<ChangeThread>>('/threads', request);
    return response.data.data;
  },

  /**
   * Fetch paginated list of Change Threads.
   */
  async listThreads(page = 0, size = 20): Promise<PaginatedThreads> {
    const response = await apiClient.get<ApiResponse<PaginatedThreads>>('/threads', {
      params: { page, size }
    });
    return response.data.data;
  },

  /**
   * Fetch single Change Thread details by ID.
   */
  async getThread(id: string): Promise<ChangeThread> {
    const response = await apiClient.get<ApiResponse<ChangeThread>>(`/threads/${id}`);
    return response.data.data;
  },

  /**
   * Update Change Thread details or status.
   */
  async updateThread(id: string, request: UpdateThreadRequest): Promise<ChangeThread> {
    const response = await apiClient.put<ApiResponse<ChangeThread>>(`/threads/${id}`, request);
    return response.data.data;
  },

  /**
   * Delete Change Thread by ID.
   */
  async deleteThread(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/threads/${id}`);
  },

  /**
   * Re-sync commits & diffs from GitHub.
   */
  async refreshThread(id: string): Promise<ChangeThread> {
    const response = await apiClient.post<ApiResponse<ChangeThread>>(`/threads/${id}/refresh`);
    return response.data.data;
  },

  /**
   * Trigger AI Risk Analysis for a thread.
   */
  async analyzeThread(id: string): Promise<ChangeThread> {
    const response = await apiClient.post<ApiResponse<ChangeThread>>(`/threads/${id}/analyze`);
    return response.data.data;
  },

  /**
   * Generate an AI Markdown Brief for a thread.
   */
  async generateBrief(id: string): Promise<BriefResponse> {
    const response = await apiClient.post<ApiResponse<BriefResponse>>(`/threads/${id}/brief`);
    return response.data.data;
  },

  /**
   * Get an existing Markdown Brief for a thread.
   */
  async getBrief(id: string): Promise<BriefResponse> {
    const response = await apiClient.get<ApiResponse<BriefResponse>>(`/threads/${id}/brief`);
    return response.data.data;
  },

  /**
   * Publish generated brief as a comment on a GitHub PR.
   */
  async publishBrief(id: string, prNumber: number): Promise<PublishResponse> {
    const response = await apiClient.post<ApiResponse<PublishResponse>>(`/threads/${id}/publish`, null, {
      params: { prNumber }
    });
    return response.data.data;
  },

  /**
   * Add a decision note to a thread.
   */
  async addDecisionNote(threadId: string, note: Omit<DecisionNote, 'id' | 'createdAt'>): Promise<ChangeThread> {
    const response = await apiClient.post<ApiResponse<ChangeThread>>(`/threads/${threadId}/notes`, note);
    return response.data.data;
  }
};

export default threadService;
