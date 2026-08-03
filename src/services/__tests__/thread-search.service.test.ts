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

import { threadService } from '../thread.service'

const page = (ids: string[]) => ({
  success: true,
  message: 'ok',
  data: {
    content: ids.map((id) => ({ id })),
    totalElements: ids.length,
    totalPages: 1,
    size: 50,
    number: 0,
    first: true,
    last: true,
    numberOfElements: ids.length,
    empty: ids.length === 0,
  },
})

describe('threadService search', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('searchThreads hits /threads/search with q + pagination', async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: page(['t1']) })
    const result = await threadService.searchThreads('auth', 0, 50)
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/threads/search', {
      params: { q: 'auth', page: 0, size: 50 },
    })
    expect(result.content).toHaveLength(1)
  })

  it('searchByRepo hits /threads/search/repo with repositoryFullName', async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: page(['t2']) })
    await threadService.searchByRepo('acme/repo', 1, 10)
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/threads/search/repo', {
      params: { repositoryFullName: 'acme/repo', page: 1, size: 10 },
    })
  })

  it('searchByStatus hits /threads/search/status with uppercase lifecycle status', async () => {
    mockAxiosInstance.get.mockResolvedValue({ data: page([]) })
    await threadService.searchByStatus('READY')
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/threads/search/status', {
      params: { status: 'READY', page: 0, size: 20 },
    })
  })

  it('throws ApiError when the envelope reports failure', async () => {
    mockAxiosInstance.get.mockResolvedValue({
      data: { success: false, message: 'Search unavailable', data: null },
    })
    await expect(threadService.searchThreads('x')).rejects.toThrow('Search unavailable')
  })
})
