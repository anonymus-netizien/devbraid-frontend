import apiClient from '../api/axios'
import { unwrap } from '../api/envelope'
import type { UserProfileResponseData } from '../types/auth'
import type { ApiResponse } from '../types/api'

interface UpdateProfileRequest {
  fullName: string
}

export const authService = {
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
}

export default authService
