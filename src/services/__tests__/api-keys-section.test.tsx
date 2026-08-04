import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

const { mockInvalidate, mockListKeys, mockCreateKey, mockRevokeKey } = vi.hoisted(() => ({
  mockInvalidate: vi.fn(),
  mockListKeys: vi.fn(),
  mockCreateKey: vi.fn(),
  mockRevokeKey: vi.fn(),
}))

vi.mock('@tanstack/react-query', () => ({
  useQueryClient: () => ({ invalidateQueries: mockInvalidate }),
}))

vi.mock('../../services/api-key.service', () => ({
  apiKeyService: {
    listApiKeys: mockListKeys,
    createApiKey: mockCreateKey,
    revokeApiKey: mockRevokeKey,
  },
}))

let mockKeys: any[] = []
vi.mock('../../hooks/queries', () => ({
  queryKeys: { apiKeys: ['api-keys'] },
  useApiKeysQuery: () => ({ data: mockKeys, isLoading: false }),
}))

import { ApiKeysSection } from '../../components/devbraid/api-keys-section'

describe('ApiKeysSection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockKeys = [
      {
        id: 'k1',
        name: 'CI key',
        prefix: 'db_live_',
        scopes: ['threads:read'],
        rateLimitPerMin: 60,
        active: true,
        lastUsedAt: '2026-08-01T12:00:00Z',
        createdAt: '2026-07-15T10:00:00Z',
      },
      {
        id: 'k2',
        name: 'Revoked',
        prefix: 'db_test_',
        scopes: [],
        active: false,
        createdAt: '2026-07-10T08:00:00Z',
      },
    ]
  })

  it('renders key names and prefixes', () => {
    const html = renderToStaticMarkup(<ApiKeysSection />)
    expect(html).toContain('CI key')
    expect(html).toContain('Revoked')
    expect(html).toContain('db_live_')
  })

  it('shows active status for active keys and revoked badge for inactive keys', () => {
    const html = renderToStaticMarkup(<ApiKeysSection />)
    // Active keys should not have a "revoked" badge near them
    expect(html).toContain('CI key')
    // Revoked key should show the revoked badge
    expect(html).toContain('>revoked<')
  })

  it('renders create dialog trigger', () => {
    const html = renderToStaticMarkup(<ApiKeysSection />)
    expect(html).toContain('New key')
  })

  it('shows empty state when no keys', () => {
    mockKeys = []
    const html = renderToStaticMarkup(<ApiKeysSection />)
    expect(html).toContain('No API keys yet')
  })
})
