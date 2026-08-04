import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { apiClient } from '../axios'
import { setAccessToken, clearTokens } from '../token'

type Handler = (value: any) => any

function requestHandlers(): Array<{ fulfilled: Handler; rejected?: Handler }> {
  return (apiClient.interceptors.request as any).handlers
}

function responseHandlers(): Array<{ fulfilled: Handler; rejected?: Handler }> {
  return (apiClient.interceptors.response as any).handlers
}

describe('apiClient', () => {
  beforeEach(() => {
    clearTokens()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('instance configuration', () => {
    it('has the correct baseURL', () => {
      expect(apiClient.defaults.baseURL).toBe('http://localhost:8080/api/v1')
    })

    it('has JSON content type header', () => {
      expect(apiClient.defaults.headers['Content-Type']).toBe('application/json')
    })

    it('has a registered request interceptor', () => {
      expect(requestHandlers().length).toBeGreaterThanOrEqual(1)
    })

    it('has a registered response interceptor', () => {
      expect(responseHandlers().length).toBeGreaterThanOrEqual(1)
    })
  })

  describe('request interceptor', () => {
    it('attaches the Bearer token from the token store when present', async () => {
      setAccessToken('test_token_abc')

      const handler = requestHandlers()[0].fulfilled
      const mockConfig: any = { headers: {} }
      const result = await handler(mockConfig)

      expect(result.headers.Authorization).toBe('Bearer test_token_abc')
    })

    it('does not attach Authorization header when no token exists', async () => {
      const handler = requestHandlers()[0].fulfilled
      const mockConfig: any = { headers: {} }
      const result = await handler(mockConfig)

      expect(result.headers.Authorization).toBeUndefined()
    })
  })

  describe('response interceptor success handler', () => {
    it('passes through successful responses unchanged', async () => {
      const handler = responseHandlers()[0].fulfilled
      const mockResponse = { data: { data: { id: '1' } }, status: 200 }

      const result = await handler(mockResponse)

      expect(result).toBe(mockResponse)
    })
  })

  describe('response interceptor error handler', () => {
    it('rejects non-401 errors without attempting refresh', async () => {
      const handler = responseHandlers()[0].rejected!
      const error = { response: { status: 403 }, config: { url: '/some-endpoint' } }

      await expect(handler(error)).rejects.toBe(error)
    })

    it('rejects 401 errors on auth endpoints (login/register)', async () => {
      const handler = responseHandlers()[0].rejected!
      const error = { response: { status: 401 }, config: { url: '/auth/login' } }

      await expect(handler(error)).rejects.toBe(error)
    })

    it('rejects 401 errors on auth refresh endpoint', async () => {
      const handler = responseHandlers()[0].rejected!
      const error = { response: { status: 401 }, config: { url: '/auth/refresh' } }

      await expect(handler(error)).rejects.toBe(error)
    })
  })
})
