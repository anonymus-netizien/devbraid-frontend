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

describe('threadService comments', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const envelope = (data: unknown) => ({ data: { success: true, message: 'ok', data } })

  it('listComments hits /threads/{id}/comments', async () => {
    mockAxiosInstance.get.mockResolvedValue(envelope([{ id: 'c1', filePath: 'src/a.ts' }]))
    const result = await threadService.listComments('t1')
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/threads/t1/comments')
    expect(result).toHaveLength(1)
  })

  it('listCommentsByFile hits the by-file endpoint with filePath param', async () => {
    mockAxiosInstance.get.mockResolvedValue(envelope([]))
    await threadService.listCommentsByFile('t1', 'src/a.ts')
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/threads/t1/comments/by-file', {
      params: { filePath: 'src/a.ts' },
    })
  })

  it('createComment POSTs the anchored request body', async () => {
    mockAxiosInstance.post.mockResolvedValue(envelope({ id: 'c2', filePath: 'src/a.ts' }))
    await threadService.createComment('t1', { filePath: 'src/a.ts', content: 'nit: rename' })
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/threads/t1/comments', {
      filePath: 'src/a.ts',
      content: 'nit: rename',
    })
  })

  it('updateComment PUTs status resolution to the comment endpoint', async () => {
    mockAxiosInstance.put.mockResolvedValue(
      envelope({ id: 'c2', status: 'RESOLVED', filePath: 'src/a.ts' }),
    )
    await threadService.updateComment('t1', 'c2', { status: 'RESOLVED' })
    expect(mockAxiosInstance.put).toHaveBeenCalledWith('/threads/t1/comments/c2', {
      status: 'RESOLVED',
    })
  })

  it('deleteComment DELETEs the comment endpoint', async () => {
    mockAxiosInstance.delete.mockResolvedValue(envelope(null))
    await threadService.deleteComment('t1', 'c2')
    expect(mockAxiosInstance.delete).toHaveBeenCalledWith('/threads/t1/comments/c2')
  })
})

describe('threadService events', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const envelope = (data: unknown) => ({ data: { success: true, message: 'ok', data } })

  it('listEvents hits /threads/{id}/events', async () => {
    mockAxiosInstance.get.mockResolvedValue(envelope([{ id: 'e1', type: 'MANUAL' }]))
    const result = await threadService.listEvents('t1')
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/threads/t1/events')
    expect(result).toHaveLength(1)
  })

  it('listEventsPaged hits /events/paged with pagination', async () => {
    mockAxiosInstance.get.mockResolvedValue(envelope({ content: [], totalPages: 1 }))
    await threadService.listEventsPaged('t1', 2, 10)
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/threads/t1/events/paged', {
      params: { page: 2, size: 10 },
    })
  })

  it('createEvent POSTs summary + metadata', async () => {
    mockAxiosInstance.post.mockResolvedValue(envelope({ id: 'e2', type: 'MANUAL' }))
    await threadService.createEvent('t1', 'PR merged', '{"prNumber":42}')
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/threads/t1/events', {
      summary: 'PR merged',
      metadata: '{"prNumber":42}',
    })
  })
})

describe('threadService snapshots', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  const envelope = (data: unknown) => ({ data: { success: true, message: 'ok', data } })

  it('listSnapshots hits /threads/{id}/snapshots', async () => {
    mockAxiosInstance.get.mockResolvedValue(envelope([{ id: 's1', type: 'MANUAL' }]))
    const result = await threadService.listSnapshots('t1')
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/threads/t1/snapshots')
    expect(result).toHaveLength(1)
  })

  it('createSnapshot POSTs the optional note', async () => {
    mockAxiosInstance.post.mockResolvedValue(envelope({ id: 's2', type: 'MANUAL' }))
    await threadService.createSnapshot('t1', 'before refactor')
    expect(mockAxiosInstance.post).toHaveBeenCalledWith('/threads/t1/snapshots', {
      note: 'before refactor',
    })
  })

  it('getSnapshot hits the snapshotId path', async () => {
    mockAxiosInstance.get.mockResolvedValue(envelope({ id: 's1' }))
    await threadService.getSnapshot('t1', 's1')
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/threads/t1/snapshots/s1')
  })

  it('getLatestSnapshot hits the latest path', async () => {
    mockAxiosInstance.get.mockResolvedValue(envelope({ id: 's2' }))
    await threadService.getLatestSnapshot('t1')
    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/threads/t1/snapshots/latest')
  })
})
