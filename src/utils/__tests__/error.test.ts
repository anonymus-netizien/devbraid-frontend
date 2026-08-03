import { describe, it, expect } from 'bun:test'
import { getErrorMessage } from '../error'

describe('getErrorMessage', () => {
  it('returns fallback message when error is undefined', () => {
    expect(getErrorMessage(undefined)).toBe('Something went wrong. Please try again.')
    expect(getErrorMessage(null, 'Custom fallback')).toBe('Custom fallback')
  })

  it('extracts message property from response data', () => {
    const error = {
      response: {
        data: {
          message: 'Email is required',
        },
      },
    }
    expect(getErrorMessage(error)).toBe('Email is required')
  })

  it('extracts first validation error from Spring Boot errors array', () => {
    const error = {
      response: {
        data: {
          errors: [
            { field: 'email', defaultMessage: 'Email must be valid' },
            { field: 'password', defaultMessage: 'Password is required' },
          ],
        },
      },
    }
    expect(getErrorMessage(error)).toBe('Email must be valid')
  })

  it('extracts error field string if message is absent', () => {
    const error = {
      response: {
        data: {
          error: 'Bad Request',
        },
      },
    }
    expect(getErrorMessage(error)).toBe('Bad Request')
  })

  it('extracts RFC 7807 detail string', () => {
    const error = {
      response: {
        data: {
          detail: 'User with this email already exists',
        },
      },
    }
    expect(getErrorMessage(error)).toBe('User with this email already exists')
  })

  it('falls back to standard Error message property if response data is missing', () => {
    const error = new Error('Network Error')
    expect(getErrorMessage(error)).toBe('Network Error')
  })
})
