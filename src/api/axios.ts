import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach access token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('devbraid_access_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const isAuthEndpoint =
      originalRequest?.url?.includes('/auth/login') ||
      originalRequest?.url?.includes('/auth/register');

    // If 401 Unauthorized and we haven't already retried (and not login/register)
    if (
      error.response?.status === 401 &&
      !isAuthEndpoint &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('devbraid_refresh_token');

      if (refreshToken) {
        try {
          // Attempt to refresh token
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refreshToken,
          });

          const newAccessToken = response.data.accessToken;
          const newRefreshToken = response.data.refreshToken;

          if (newAccessToken) {
            localStorage.setItem('devbraid_access_token', newAccessToken);
            
            // If backend rotates refresh token, update it
            if (newRefreshToken) {
              localStorage.setItem('devbraid_refresh_token', newRefreshToken);
            }

            // Retry the original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            }
            return apiClient(originalRequest);
          }
        } catch (refreshError) {
          // Refresh failed, session expired
          localStorage.removeItem('devbraid_access_token');
          localStorage.removeItem('devbraid_refresh_token');
          window.location.href = '/auth/login?expired=true';
          return Promise.reject(refreshError);
        }
      }

      // No refresh token available, redirect to login
      localStorage.removeItem('devbraid_access_token');
      localStorage.removeItem('devbraid_refresh_token');
      window.location.href = '/auth/login';
    }

    return Promise.reject(error);
  }
);

export default apiClient;
