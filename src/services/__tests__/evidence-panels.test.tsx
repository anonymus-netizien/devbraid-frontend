import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { FileChangesPanel, CommitsList } from '../../components/devbraid/evidence-panels'

const files = [
  { filename: 'src/components/foo/bar.tsx', status: 'modified', additions: 128, deletions: 47 },
  { filename: 'src/api/contract.ts', status: 'added', additions: 21, deletions: 0 },
  { filename: 'src/legacy.ts', status: 'deleted', additions: 0, deletions: 300 },
]

describe('FileChangesPanel', () => {
  it('renders file count and totals', () => {
    const html = renderToStaticMarkup(<FileChangesPanel files={files} />)
    expect(html).toContain('Changed Files (3)')
    expect(html).toContain('+149')
    expect(html).toContain('−347')
  })

  it('splits paths into muted dir + filename', () => {
    const html = renderToStaticMarkup(<FileChangesPanel files={files} />)
    expect(html).toContain('src/components/foo/')
    expect(html).toContain('bar.tsx')
  })

  it('renders status badges for added/modified/deleted', () => {
    const html = renderToStaticMarkup(<FileChangesPanel files={files} />)
    expect(html).toContain('>M<')
    expect(html).toContain('>A<')
    expect(html).toContain('>D<')
  })

  it('shows empty state without files', () => {
    const html = renderToStaticMarkup(<FileChangesPanel files={[]} />)
    expect(html).toContain('No changed files detected')
  })

  it('falls back to path when filename is absent', () => {
    const html = renderToStaticMarkup(
      <FileChangesPanel files={[{ path: 'a/b.ts', additions: 1, deletions: 1 }]} />,
    )
    expect(html).toContain('a/')
    expect(html).toContain('b.ts')
  })
})

describe('CommitsList', () => {
  it('renders short sha, author, and message', () => {
    const html = renderToStaticMarkup(
      <CommitsList
        commits={[{ sha: 'abc123def456', message: 'Fix token refresh', author: { name: 'Ada' } }]}
      />,
    )
    expect(html).toContain('abc123d')
    expect(html).toContain('Ada')
    expect(html).toContain('Fix token refresh')
  })

  it('shows empty state', () => {
    const html = renderToStaticMarkup(<CommitsList commits={[]} />)
    expect(html).toContain('No commits synced yet')
  })
})
