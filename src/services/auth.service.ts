import apiClient from '../api/axios';
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
    const refreshToken =
      data?.refreshToken ||
      (data as any)?.refresh_token ||
      (data as any)?.refresh ||
      (data as any)?.data?.refreshToken;

    if (accessToken) {
      localStorage.setItem('devbraid_access_token', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('devbraid_refresh_token', refreshToken);
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
    const refreshToken =
      resData?.refreshToken ||
      (resData as any)?.refresh_token ||
      (resData as any)?.refresh ||
      (resData as any)?.data?.refreshToken;

    if (accessToken) {
      localStorage.setItem('devbraid_access_token', accessToken);
    }
    if (refreshToken) {
      localStorage.setItem('devbraid_refresh_token', refreshToken);
    }
    return resData;
  },

  async me(): Promise<MeResponse> {
    const response = await apiClient.get<MeResponse>('/auth/me');
    return response.data;
  },

  async refresh(): Promise<RefreshResponse> {
    const refreshToken = localStorage.getItem('devbraid_refresh_token');
    const response = await apiClient.post<RefreshResponse>('/auth/refresh', { refreshToken });
    if (response.data.accessToken) {
      localStorage.setItem('devbraid_access_token', response.data.accessToken);
    }
    if (response.data.refreshToken) {
      localStorage.setItem('devbraid_refresh_token', response.data.refreshToken);
    }
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('devbraid_access_token');
    localStorage.removeItem('devbraid_refresh_token');
  },
};

export default authService;
