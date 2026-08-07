import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

const { mockUpdateThread } = vi.hoisted(() => ({
  mockUpdateThread: vi.fn(),
}))

vi.mock('../../services/thread.service', () => ({
  threadService: {
    updateThread: mockUpdateThread,
  },
}))

import { EditThreadDialog } from '../../components/devbraid/edit-thread-dialog'

const thread = {
  id: 't1',
  title: 'Fix login redirect bug',
  description: 'Redirect loop after OAuth callback',
  status: 'DRAFT',
  headBranch: 'fix/login-redirect',
  baseBranch: 'main',
  repositoryFullName: 'acme/web',
  createdAt: '2026-07-15T10:00:00Z',
}

describe('EditThreadDialog', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders the edit trigger with the thread title available', () => {
    const html = renderToStaticMarkup(
      <EditThreadDialog thread={thread as any} onSaved={() => {}} />,
    )
    expect(html).toContain('Edit')
  })

  it('does not call the service until saved', () => {
    renderToStaticMarkup(<EditThreadDialog thread={thread as any} onSaved={() => {}} />)
    expect(mockUpdateThread).not.toHaveBeenCalled()
  })
})
