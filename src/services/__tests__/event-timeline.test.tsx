import { describe, it, expect } from 'vitest'
import { renderToStaticMarkup } from 'react-dom/server'
import { EventsTimeline } from '../../components/devbraid/event-timeline'

const events = [
  {
    id: 'e1',
    type: 'THREAD_CREATED',
    summary: 'Thread created from webhook',
    createdAt: '2026-07-31T10:00:00Z',
  },
  { id: 'e2', type: 'STATUS_CHANGED', summary: 'READY', createdAt: '2026-07-31T11:30:00Z' },
  { id: 'e3', type: 'MANUAL', summary: 'PR merged to develop', createdAt: '2026-07-31T12:00:00Z' },
] as const

describe('EventsTimeline', () => {
  it('renders newest event first with label and time', () => {
    const html = renderToStaticMarkup(<EventsTimeline events={events} />)
    const manual = html.indexOf('Manual entry')
    const created = html.indexOf('Thread created')
    expect(manual).toBeGreaterThan(-1)
    expect(created).toBeGreaterThan(-1)
    expect(manual).toBeLessThan(created)
    const expected = new Date('2026-07-31T12:00:00Z').toLocaleString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
    expect(html).toContain(expected)
  })

  it('renders summaries', () => {
    const html = renderToStaticMarkup(<EventsTimeline events={events} />)
    expect(html).toContain('PR merged to develop')
  })

  it('shows empty state', () => {
    const html = renderToStaticMarkup(<EventsTimeline events={[]} />)
    expect(html).toContain('No activity recorded yet.')
  })

  it('renders composer when onAddEvent provided', () => {
    const html = renderToStaticMarkup(<EventsTimeline events={[]} onAddEvent={() => undefined} />)
    expect(html).toContain('Log an event…')
    expect(html).toContain('Log')
  })
})
