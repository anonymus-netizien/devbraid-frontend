import type { ApiResponse } from '../types/api'

/** Error normalized from a failed ApiResponse envelope or HTTP failure. */
export class ApiError extends Error {
  readonly status?: number

  constructor(message: string, status?: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

/**
 * Unwraps the ApiResponse envelope. Throws ApiError carrying the backend's
 * `message` when `success` is false, so callers can rely on `err.message`.
 */
export function unwrap<T>(response: ApiResponse<T> | undefined, status?: number): T {
  if (!response) throw new ApiError('Empty response from server', status)
  if (response.success === false) {
    throw new ApiError(response.message || 'Request failed', status)
  }
  return response.data
}
