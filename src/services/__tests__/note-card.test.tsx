import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'

import { NoteCard } from '../../components/devbraid/note-card'

const note = {
  id: 'n1',
  threadId: 't1',
  threadTitle: 'Fix login redirect bug',
  repositoryFullName: 'acme/web',
  decision: 'Use session cookie instead of JWT',
  rationale: 'JWT cannot be revoked server-side',
  alternatives: 'Refresh token rotation',
  impact: 'Users stay logged in across deploys',
  status: 'ACTIVE',
  createdAt: '2026-07-15T10:00:00Z',
}

const baseProps = {
  onEdit: vi.fn(),
  onSaveEdit: vi.fn(),
  onDelete: vi.fn(),
  editingNoteId: null,
  editDecision: '',
  editRationale: '',
  editAlternatives: '',
  editImpact: '',
  setEditDecision: vi.fn(),
  setEditRationale: vi.fn(),
  setEditAlternatives: vi.fn(),
  setEditImpact: vi.fn(),
  deletingNoteId: null,
}

describe('NoteCard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders thread title, repo, decision, rationale, alternatives and impact', () => {
    const html = renderToStaticMarkup(<NoteCard note={note as any} {...baseProps} />)
    expect(html).toContain('Fix login redirect bug')
    expect(html).toContain('acme/web')
    expect(html).toContain('Use session cookie instead of JWT')
    expect(html).toContain('JWT cannot be revoked server-side')
    expect(html).toContain('Refresh token rotation')
    expect(html).toContain('Users stay logged in across deploys')
  })

  it('omits optional fields when absent', () => {
    const minimal = { ...note, alternatives: undefined, impact: undefined }
    const html = renderToStaticMarkup(<NoteCard note={minimal as any} {...baseProps} />)
    expect(html).not.toContain('Alternatives')
    expect(html).not.toContain('Impact')
  })

  it('shows edit and delete buttons in view mode', () => {
    const html = renderToStaticMarkup(<NoteCard note={note as any} {...baseProps} />)
    expect(html).toContain('title="Edit note"')
    expect(html).toContain('title="Delete note"')
  })

  it('renders the edit form with current values when editing', () => {
    const html = renderToStaticMarkup(
      <NoteCard
        note={note as any}
        {...baseProps}
        editingNoteId="n1"
        editDecision="Updated decision"
        editRationale="Updated rationale"
        editAlternatives="New alternative"
        editImpact="New impact"
      />,
    )
    expect(html).toContain('Updated decision')
    expect(html).toContain('Updated rationale')
    expect(html).toContain('New alternative')
    expect(html).toContain('New impact')
    expect(html).toContain('Save')
    expect(html).toContain('Cancel')
    expect(html).not.toContain('title="Edit note"')
  })

  it('shows a spinner on the delete button while deleting', () => {
    const html = renderToStaticMarkup(
      <NoteCard note={note as any} {...baseProps} deletingNoteId="n1" />,
    )
    expect(html).toContain('animate-spin')
  })
})
