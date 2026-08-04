import type { ApiResponse } from '../types/api'
import type { ApiKey, CreateApiKeyRequest, CreatedKey } from '../types/api-keys'
import apiClient from '../api/axios'
import { unwrap } from '../api/envelope'

export const apiKeyService = {
  /**
   * List the user's API keys (metadata only — never the full key).
   */
  async listApiKeys(): Promise<ApiKey[]> {
    const response = await apiClient.get<ApiResponse<ApiKey[]>>('/api-keys')
    return unwrap(response.data)
  },

  /**
   * Create an API key. The full key is returned only in this response.
   */
  async createApiKey(request: CreateApiKeyRequest): Promise<CreatedKey> {
    const response = await apiClient.post<ApiResponse<CreatedKey>>('/api-keys', request)
    return unwrap(response.data)
  },

  /**
   * Permanently revoke an API key.
   */
  async revokeApiKey(id: string): Promise<void> {
    await apiClient.delete<ApiResponse<null>>(`/api-keys/${id}`)
  },
}

export default apiKeyService
