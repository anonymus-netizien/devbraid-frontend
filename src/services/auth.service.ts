import apiClient from '../api/axios';
import { setAccessToken, setRefreshToken, getRefreshToken, clearTokens } from '../api/token';
import type {
  LoginRequest,
  ApiResponse,
  LoginResponseData,
  RegisterRequest,
  UserProfileResponseData,
  OtpSendRequest,
  OtpSendResponseData,
  OtpVerifyRequest,
  OtpVerifyResponseData,
} from '../types/auth';

export const authService = {
  async sendOtp(email: string): Promise<OtpSendResponseData> {
    const response = await apiClient.post<ApiResponse<OtpSendResponseData>>(
      '/auth/otp/send',
      { email } as OtpSendRequest
    );
    return response.data.data;
  },

  async verifyOtp(email: string, otp: string): Promise<OtpVerifyResponseData> {
    const response = await apiClient.post<ApiResponse<OtpVerifyResponseData>>(
      '/auth/otp/verify',
      { email, otp } as OtpVerifyRequest
    );
    return response.data.data;
  },

  async login(credentials: LoginRequest): Promise<LoginResponseData> {
    const response = await apiClient.post<ApiResponse<LoginResponseData>>(
      '/auth/login',
      credentials
    );
    const apiData = response.data;
    const data = apiData.data;
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    return data;
  },

  async register(data: RegisterRequest): Promise<void> {
    await apiClient.post<ApiResponse<null>>(
      '/auth/register',
      data
    );
  },

  async me(): Promise<UserProfileResponseData> {
    const response = await apiClient.get<ApiResponse<UserProfileResponseData>>(
      '/auth/me'
    );
    return response.data.data;
  },

  async refresh(): Promise<LoginResponseData> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');
    const response = await apiClient.post<ApiResponse<LoginResponseData>>(
      '/auth/refresh',
      { refreshToken }
    );
    const apiData = response.data;
    const data = apiData.data;
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    return data;
  },

  async logout(): Promise<void> {
    const refreshToken = getRefreshToken();
    if (!refreshToken) {
      clearTokens();
      return;
    }
    try {
      await apiClient.post('/auth/logout', { refreshToken });
    } catch {
      // Ignore logout backend errors
    } finally {
      clearTokens();
    }
  },
};

export default authService;
