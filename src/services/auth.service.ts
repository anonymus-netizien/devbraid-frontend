import apiClient from '../api/axios'
import { unwrap } from '../api/envelope'
import { setAccessToken, setRefreshToken, getRefreshToken, clearTokens } from '../api/token'
import type {
  LoginRequest,
  LoginResponseData,
  RegisterRequest,
  UserProfileResponseData,
  OtpSendRequest,
  OtpSendResponseData,
  OtpVerifyRequest,
  OtpVerifyResponseData,
} from '../types/auth'
import type { ApiResponse } from '../types/api'

interface UpdateProfileRequest {
  fullName: string
}

interface UpdatePasswordRequest {
  currentPassword: string
  newPassword: string
}

export const authService = {
  async sendOtp(email: string): Promise<OtpSendResponseData> {
    const response = await apiClient.post<ApiResponse<OtpSendResponseData>>('/auth/otp/send', {
      email,
    } as OtpSendRequest)
    return unwrap(response.data)
  },

  async verifyOtp(email: string, otp: string): Promise<OtpVerifyResponseData> {
    const response = await apiClient.post<ApiResponse<OtpVerifyResponseData>>('/auth/otp/verify', {
      email,
      otp,
    } as OtpVerifyRequest)
    return unwrap(response.data)
  },

  async login(credentials: LoginRequest): Promise<LoginResponseData> {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>(
      '/auth/login',
      credentials,
    )
    const apiData = response.data
    const data = apiData.data
    setAccessToken(data.accessToken ?? null)
    setRefreshToken(data.refreshToken ?? null)
    return data
  },

  async register(data: RegisterRequest): Promise<void> {
    await apiClient.post<ApiResponse<null>>('/auth/register', data)
  },

  async me(): Promise<UserProfileResponseData> {
    const response = await apiClient.get<ApiResponse<UserProfileResponseData>>('/user/profile')
    return unwrap(response.data)
  },

  async updateProfile(data: UpdateProfileRequest): Promise<UserProfileResponseData> {
    const response = await apiClient.put<ApiResponse<UserProfileResponseData>>(
      '/user/profile',
      data,
    )
    return unwrap(response.data)
  },

  async updatePassword(data: UpdatePasswordRequest): Promise<void> {
    await apiClient.put('/user/password', data)
  },

  async refresh(): Promise<LoginResponseData> {
    const refreshToken = getRefreshToken()
    if (!refreshToken) throw new Error('No refresh token available')
    const response = await apiClient.post<ApiResponse<LoginResponseData>>('/auth/refresh', {
      refreshToken,
    })
    const apiData = response.data
    const data = apiData.data
    setAccessToken(data.accessToken ?? null)
    setRefreshToken(data.refreshToken ?? null)
    return data
  },

  async logout(): Promise<void> {
    const refreshToken = getRefreshToken()
    if (!refreshToken) {
      clearTokens()
      return
    }
    try {
      await apiClient.post('/auth/logout', { refreshToken })
    } catch {
      // Ignore logout backend errors
    } finally {
      clearTokens()
    }
  },
}

export default authService
