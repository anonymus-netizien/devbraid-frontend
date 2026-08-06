import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import axios from 'axios'
import { apiClient } from '../axios'
import { setAccessToken, clearTokens } from '../token'

vi.mock('axios', async (importOriginal) => {
  const actual = await importOriginal<typeof import('axios')>()
  return {
    ...actual,
    default: {
      ...actual.default,
      create: vi.fn((config) => actual.default.create(config)),
      post: vi.fn(),
    },
  }
})

type Handler = (value: any) => any

function requestHandlers(): Array<{ fulfilled: Handler; rejected?: Handler }> {
  return (apiClient.interceptors.request as any).handlers
}

function responseHandlers(): Array<{ fulfilled: Handler; rejected?: Handler }> {
  return (apiClient.interceptors.response as any).handlers
}

function stubLocation() {
  const original = window.location
  delete (window as any).location
  const stub = { href: 'http://localhost:3000/' }
  ;(window as any).location = stub
  return { stub, restore: () => ((window as any).location = original) }
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

    it('sends cookies with requests (withCredentials)', () => {
      expect(apiClient.defaults.withCredentials).toBe(true)
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
    it('rejects non-401/403 errors without attempting refresh', async () => {
      const handler = responseHandlers()[0].rejected!
      const error = { response: { status: 500 }, config: { url: '/some-endpoint' } }

      await expect(handler(error)).rejects.toBe(error)
      expect(axios.post).not.toHaveBeenCalled()
    })

    it('rejects 401 errors on auth endpoints (login/register)', async () => {
      const handler = responseHandlers()[0].rejected!
      const error = { response: { status: 401 }, config: { url: '/auth/login' } }

      await expect(handler(error)).rejects.toBe(error)
      expect(axios.post).not.toHaveBeenCalled()
    })

    it('rejects 401 errors on auth refresh endpoint', async () => {
      const handler = responseHandlers()[0].rejected!
      const error = { response: { status: 401 }, config: { url: '/auth/refresh' } }

      await expect(handler(error)).rejects.toBe(error)
      expect(axios.post).not.toHaveBeenCalled()
    })

    it('rejects 403 errors on /user/profile (auth endpoint) without refreshing', async () => {
      const handler = responseHandlers()[0].rejected!
      const error = { response: { status: 403 }, config: { url: '/user/profile' } }

      await expect(handler(error)).rejects.toBe(error)
      expect(axios.post).not.toHaveBeenCalled()
    })

    it('refreshes via cookie when a non-auth endpoint returns 401 and retries with the new token', async () => {
      setAccessToken('expired_access')
      ;(axios.post as any).mockResolvedValue({
        data: {
          success: true,
          message: 'Refreshed',
          data: { accessToken: 'fresh_access' },
        },
      })
      const retrySpy = vi.spyOn(apiClient, 'request').mockResolvedValue({ status: 200 })

      const handler = responseHandlers()[0].rejected!
      const error = {
        response: { status: 401 },
        config: { url: '/github/status', headers: { Authorization: 'Bearer expired_access' } },
      }

      await handler(error)

      expect(axios.post).toHaveBeenCalledWith(
        'http://localhost:8080/api/v1/auth/refresh',
        {},
        { withCredentials: true },
      )
      expect(retrySpy).toHaveBeenCalledWith(
        expect.objectContaining({
          headers: expect.objectContaining({ Authorization: 'Bearer fresh_access' }),
        }),
      )
    })

    it('clears tokens and redirects to login when refresh fails', async () => {
      setAccessToken('expired_access')
      ;(axios.post as any).mockRejectedValue(new Error('refresh failed'))
      const { stub, restore } = stubLocation()

      try {
        const handler = responseHandlers()[0].rejected!
        const error = {
          response: { status: 401 },
          config: { url: '/some-endpoint', headers: {} },
        }

        await expect(handler(error)).rejects.toThrow('refresh failed')
        expect(stub.href).toBe('/auth/login?expired=true')
      } finally {
        restore()
      }
    })
  })
})
