import apiClient from '../api/axios';
import { setAccessToken, clearTokens } from '../api/token';
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  MeResponse,
  RefreshResponse,
} from '../types/auth';

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>('/auth/login', credentials);
    const data = response.data;
    const accessToken =
      data?.accessToken ||
      (data as any)?.token ||
      (data as any)?.jwt ||
      (data as any)?.access_token ||
      (data as any)?.data?.token ||
      (data as any)?.data?.accessToken;

    if (accessToken) {
      setAccessToken(accessToken);
    }
    return data;
  },

  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>('/auth/register', data);
    const resData = response.data;
    const accessToken =
      resData?.accessToken ||
      (resData as any)?.token ||
      (resData as any)?.jwt ||
      (resData as any)?.access_token ||
      (resData as any)?.data?.token ||
      (resData as any)?.data?.accessToken;

    if (accessToken) {
      setAccessToken(accessToken);
    }
    return resData;
  },

  async me(): Promise<MeResponse> {
    const response = await apiClient.get<MeResponse>('/auth/me');
    return response.data;
  },

  async refresh(): Promise<RefreshResponse> {
    const response = await apiClient.post<RefreshResponse>('/auth/refresh', {});
    const data = response.data;
    const accessToken =
      data?.accessToken ||
      (data as any)?.token ||
      (data as any)?.jwt ||
      (data as any)?.access_token;

    if (accessToken) {
      setAccessToken(accessToken);
    }
    return data;
  },

  async logout(): Promise<void> {
    try {
      await apiClient.post('/auth/logout', {});
    } catch {
      // Ignore logout backend errors if session already expired
    } finally {
      clearTokens();
    }
  },
};

export default authService;
