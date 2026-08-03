import { describe, it, expect } from 'vitest'
import { ApiError, unwrap } from '../../api/envelope'

describe('unwrap', () => {
  it('returns data on success', () => {
    const result = unwrap({ success: true, message: 'ok', data: { id: '1' } })
    expect(result).toEqual({ id: '1' })
  })

  it('throws ApiError with backend message when success is false', () => {
    expect(() =>
      unwrap({ success: false, message: 'Repository not found', data: null }),
    ).toThrowError(ApiError)
    try {
      unwrap({ success: false, message: 'Repository not found', data: null })
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError)
      expect((err as ApiError).message).toBe('Repository not found')
    }
  })

  it('throws on empty response', () => {
    expect(() => unwrap(undefined, 500)).toThrowError('Empty response from server')
  })

  it('carries the HTTP status', () => {
    try {
      unwrap(undefined, 404)
    } catch (err) {
      expect((err as ApiError).status).toBe(404)
    }
  })
})
