import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios'
import { getSessionToken, clearTokens } from './token'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1'

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Client-side sign-in redirect on 401. Registered from main.tsx (which owns the
// router) so an expired session navigates in-SPA instead of hard-reloading the
// page and re-running the whole app.
let onUnauthorized: (() => void) | null = null
export const setUnauthorizedHandler = (handler: (() => void) | null): void => {
  onUnauthorized = handler
}

// Request interceptor: attach the Clerk session token
apiClient.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await getSessionToken()
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor: stateless backend — no refresh flow; on 401 clear
// tokens and let the registered handler bounce to sign-in without a reload.
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      clearTokens()
      onUnauthorized?.()
    }
    return Promise.reject(error)
  },
)

export default apiClient
