import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { apiClient, setUnauthorizedHandler } from '../axios'
import { setTokenProvider, clearTokens } from '../token'

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
    setUnauthorizedHandler(null)
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
    it('attaches the Clerk session token as Bearer when the provider resolves', async () => {
      setTokenProvider(() => Promise.resolve('clerk_token_xyz'))

      const handler = requestHandlers()[0].fulfilled
      const mockConfig: any = { headers: {} }
      const result = await handler(mockConfig)

      expect(result.headers.Authorization).toBe('Bearer clerk_token_xyz')
    })

    it('does not attach Authorization header when no provider is registered', async () => {
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
    it('rejects non-401 errors without touching tokens', async () => {
      const handler = responseHandlers()[0].rejected!
      const error = { response: { status: 500 }, config: { url: '/some-endpoint' } }

      await expect(handler(error)).rejects.toBe(error)
    })

    it('clears tokens and calls the registered sign-in handler on 401', async () => {
      setTokenProvider(() => Promise.resolve('stale_token'))
      const handler = responseHandlers()[0].rejected!
      const onUnauthorized = vi.fn()
      setUnauthorizedHandler(onUnauthorized)

      await expect(
        handler({ response: { status: 401 }, config: { url: '/github/status' } }),
      ).rejects.toMatchObject({ response: { status: 401 } })

      expect(onUnauthorized).toHaveBeenCalledTimes(1)
    })

    it('does nothing extra when no sign-in handler is registered', async () => {
      const handler = responseHandlers()[0].rejected!
      const error = { response: { status: 401 }, config: { url: '/github/status' } }

      await expect(handler(error)).rejects.toBe(error)
    })
  })
})
