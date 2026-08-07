const TZ_KEY = 'devbraid:timezone'

export function detectTimezone(): string {
  if (typeof Intl === 'undefined') return 'UTC'
  return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC'
}

export function getTimezone(): string {
  if (typeof window === 'undefined') return detectTimezone()
  try {
    return window.localStorage.getItem(TZ_KEY) || detectTimezone()
  } catch {
    return detectTimezone()
  }
}

export function setTimezone(tz: string) {
  try {
    window.localStorage.setItem(TZ_KEY, tz)
  } catch {
    // storage unavailable — keep in-memory default
  }
}

export function formatDate(iso: string | null | undefined, tz = getTimezone()): string {
  if (!iso) return ''
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    timeZone: tz,
  })
}
