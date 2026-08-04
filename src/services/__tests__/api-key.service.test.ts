import { describe, it, expect, beforeEach, vi } from 'vitest'

const { mockAxiosInstance } = vi.hoisted(() => ({
  mockAxiosInstance: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
}))

vi.mock('../../api/axios', () => ({
  default: mockAxiosInstance,
  apiClient: mockAxiosInstance,
}))

import { apiKeyService } from '../api-key.service'

const envelope = (data: unknown) => ({ data: { success: true, message: 'ok', data } })

describe('apiKeyService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('listApiKeys GETs /api-keys', async () => {
    mockAxiosInstance.get.mockResolvedValue(envelope([{ id: 'k1', name: 'CI' }]))
    const result = await apiKeyService.listApiKeys()
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/api-keys')
    expect(result).toHaveLength(1)
  })

  it('createApiKey POSTs name/scopes/rateLimit', async () => {
    mockAxiosInstance.post.mockResolvedValue(envelope({ id: 'k2', fullKey: 'dbk_secret' }))
    const result = await apiKeyService.createApiKey({
      name: 'CI pipeline',
      scopes: ['threads:read'],
      rateLimitPerMin: 60,
    })
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/api-keys', {
      name: 'CI pipeline',
      scopes: ['threads:read'],
      rateLimitPerMin: 60,
    })
    expect(result.fullKey).toBe('dbk_secret')
  })

  it('revokeApiKey DELETEs /api-keys/{id}', async () => {
    mockAxiosInstance.delete.mockResolvedValue(envelope(null))
    await apiKeyService.revokeApiKey('k1')
    expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/api-keys/k1')
  })

  it('throws ApiError when the envelope reports failure', async () => {
    mockAxiosInstance.get.mockResolvedValue({
      data: { success: false, message: 'Keys unavailable', data: null },
    })
    await expect(apiKeyService.listApiKeys()).rejects.toThrow('Keys unavailable')
  })
})
