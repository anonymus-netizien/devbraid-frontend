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

import { indexingService } from '../indexing.service'

const envelope = (data: unknown) => ({ data: { success: true, message: 'ok', data } })

describe('indexingService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('listIndexes GETs /indexing/list', async () => {
    mockAxiosInstance.get.mockResolvedValue(envelope([{ id: 'i1' }]))
    const result = await indexingService.listIndexes()
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/indexing/list')
    expect(result).toHaveLength(1)
  })

  it('startIndexing POSTs repo/branch/fileContents', async () => {
    mockAxiosInstance.post.mockResolvedValue(envelope({ id: 'i2' }))
    await indexingService.startIndexing({
      repository: 'acme/api',
      branch: 'main',
      fileContents: ['src/a.java'],
    })
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/indexing/start', {
      repository: 'acme/api',
      branch: 'main',
      fileContents: ['src/a.java'],
    })
  })

  it('getIndex GETs /indexing/{id}', async () => {
    mockAxiosInstance.get.mockResolvedValue(envelope({ id: 'i1' }))
    await indexingService.getIndex('i1')
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/indexing/i1')
  })

  it('searchFiles passes the pattern query param', async () => {
    mockAxiosInstance.get.mockResolvedValue(envelope([]))
    await indexingService.searchFiles('i1', 'JwtTokenProvider')
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/indexing/i1/search', {
      params: { pattern: 'JwtTokenProvider' },
    })
  })

  it('getFiles GETs /indexing/{id}/files', async () => {
    mockAxiosInstance.get.mockResolvedValue(envelope([]))
    await indexingService.getFiles('i1')
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/indexing/i1/files')
  })

  it('getFilesByLanguage GETs the language path', async () => {
    mockAxiosInstance.get.mockResolvedValue(envelope([]))
    await indexingService.getFilesByLanguage('i1', 'java')
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/indexing/i1/language/java')
  })

  it('getGraph passes optional nodeId + depth', async () => {
    mockAxiosInstance.get.mockResolvedValue(envelope({ nodes: [], edges: [] }))
    await indexingService.getGraph('i1', 'n1', 3)
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/indexing/i1/graph', {
      params: { nodeId: 'n1', depth: 3 },
    })
  })

  it('throws ApiError when the envelope reports failure', async () => {
    mockAxiosInstance.get.mockResolvedValue({
      data: { success: false, message: 'Indexing unavailable', data: null },
    })
    await expect(indexingService.listIndexes()).rejects.toThrow('Indexing unavailable')
  })
})
