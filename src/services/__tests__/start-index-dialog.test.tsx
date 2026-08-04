import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

const { mockStartIndexing } = vi.hoisted(() => ({
  mockStartIndexing: vi.fn(),
}))

vi.mock('../../services/indexing.service', () => ({
  indexingService: {
    startIndexing: mockStartIndexing,
  },
}))

import { StartIndexDialog } from '../../routes/indexing'

describe('StartIndexDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the trigger button', () => {
    const html = renderToStaticMarkup(<StartIndexDialog onStarted={() => {}} />)
    expect(html).toContain('Start Index')
  })

  it('does not call the service until submitted', () => {
    renderToStaticMarkup(<StartIndexDialog onStarted={() => {}} />)
    expect(mockStartIndexing).not.toHaveBeenCalled()
  })
})
