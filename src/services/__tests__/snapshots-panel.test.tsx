import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { SnapshotsPanel } from '../../components/devbraid/snapshots-panel'

const snapshots = [
  {
    id: 's1',
    type: 'CREATION',
    note: 'Initial capture',
    commitSha: 'abc123def456',
    createdAt: '2026-07-31T10:00:00Z',
    changedFiles: [],
  },
  {
    id: 's2',
    type: 'MANUAL',
    note: 'Before refactor',
    commitSha: 'fedcba987654',
    createdAt: '2026-07-31T12:00:00Z',
    changedFiles: [{ filename: 'a.ts' }, { filename: 'b.ts' }],
  },
] as const

describe('SnapshotsPanel', () => {
  it('renders snapshot count, labels, notes, and file counts', () => {
    const html = renderToStaticMarkup(<SnapshotsPanel snapshots={snapshots} />)
    expect(html).toContain('Snapshots (2)')
    expect(html).toContain('Initial state')
    expect(html).toContain('Before refactor')
    expect(html).toContain('· 2 files')
    expect(html).toContain('abc123d')
  })

  it('renders newest snapshot first', () => {
    const html = renderToStaticMarkup(<SnapshotsPanel snapshots={snapshots} />)
    expect(html.indexOf('Before refactor')).toBeLessThan(html.indexOf('Initial capture'))
  })

  it('shows empty state', () => {
    const html = renderToStaticMarkup(<SnapshotsPanel snapshots={[]} />)
    expect(html).toContain('No snapshots yet')
  })

  it('renders capture form when onCapture provided', () => {
    const html = renderToStaticMarkup(<SnapshotsPanel snapshots={[]} onCapture={() => undefined} />)
    expect(html).toContain('Capture note (optional)…')
    expect(html).toContain('Capture')
  })
})
