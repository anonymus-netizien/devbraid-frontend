import { describe, it, expect, beforeEach, vi } from 'vitest'
import { clearTokens } from '../../api/token'

const { mockAxiosInstance } = vi.hoisted(() => ({
  mockAxiosInstance: {
    post: vi.fn(),
    get: vi.fn(),
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

import authService from '../auth.service'
import { getAccessToken, getRefreshToken, setRefreshToken } from '../../api/token'

describe('authService', () => {
  beforeEach(() => {
    clearTokens()
    vi.clearAllMocks()
  })

  describe('login()', () => {
    it('stores accessToken and refreshToken in the token store on login', async () => {
      const mockLoginResponse = {
        data: {
          success: true,
          message: 'Login successful',
          data: {
            accessToken: 'mock_access_token_123',
            refreshToken: 'mock_refresh_token_456',
            fullName: 'Alex Vane',
            email: 'alex@acme.com',
          },
        },
      }
      ;(mockAxiosInstance.post as any).mockResolvedValue(mockLoginResponse)

      const result = await authService.login({ email: 'alex@acme.com', password: 'password123' })

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/login', {
        email: 'alex@acme.com',
        password: 'password123',
      })
      expect(getAccessToken()).toBe('mock_access_token_123')
      expect(getRefreshToken()).toBe('mock_refresh_token_456')
      expect(result.accessToken).toBe('mock_access_token_123')
    })
  })

  describe('register()', () => {
    it('posts payload with fullName and returns void', async () => {
      ;(mockAxiosInstance.post as any).mockResolvedValue({
        data: { success: true, message: 'Registered' },
      })

      const payload = {
        fullName: 'John Doe',
        email: 'john@example.com',
        password: 'Password123!',
      }
      const result = await authService.register(payload)

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/register', payload)
      expect(result).toBeUndefined()
    })
  })

  describe('me()', () => {
    it('fetches user profile from /user/profile', async () => {
      const profile = {
        id: '1',
        fullName: 'Alex Vane',
        email: 'alex@acme.com',
        role: 'DEVELOPER',
        createdAt: '2026-07-01T09:00:00Z',
      }
      ;(mockAxiosInstance.get as any).mockResolvedValue({
        data: { success: true, message: 'Profile', data: profile },
      })

      const result = await authService.me()

      expect(mockAxiosInstance.get).toHaveBeenCalledWith('/user/profile')
      expect(result).toEqual(profile)
    })
  })

  describe('refresh()', () => {
    it('sends refreshToken and updates the token store', async () => {
      setRefreshToken('old_refresh_token')

      ;(mockAxiosInstance.post as any).mockResolvedValue({
        data: {
          success: true,
          message: 'Refreshed',
          data: { accessToken: 'new_access_token', refreshToken: 'new_refresh_token' },
        },
      })

      await authService.refresh()

      expect(mockAxiosInstance.post).toHaveBeenCalledWith('/auth/refresh', {
        refreshToken: 'old_refresh_token',
      })
      expect(getAccessToken()).toBe('new_access_token')
      expect(getRefreshToken()).toBe('new_refresh_token')
    })

    it('throws when no refresh token is available', async () => {
      await expect(authService.refresh()).rejects.toThrow('No refresh token available')
    })
  })

  describe('logout()', () => {
    it('clears tokens from the store', async () => {
      setRefreshToken('test_refresh')

      ;(mockAxiosInstance.post as any).mockResolvedValue({
        data: { success: true, message: 'Logged out' },
      })

      await authService.logout()

      expect(getAccessToken()).toBeNull()
      expect(getRefreshToken()).toBeNull()
    })

    it('clears tokens even if the logout request fails', async () => {
      ;(mockAxiosInstance.post as any).mockRejectedValue(new Error('network down'))

      await authService.logout()

      expect(getAccessToken()).toBeNull()
      expect(getRefreshToken()).toBeNull()
    })
  })
})
