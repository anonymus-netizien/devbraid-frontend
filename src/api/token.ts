// In-memory token storage to prevent XSS exfiltration from localStorage
let memoryAccessToken: string | null = null
let memoryRefreshToken: string | null = null

export const getAccessToken = (): string | null => {
  return memoryAccessToken
}

export const setAccessToken = (token: string | null): void => {
  memoryAccessToken = token
}

export const getRefreshToken = (): string | null => {
  return memoryRefreshToken
}

export const setRefreshToken = (token: string | null): void => {
  memoryRefreshToken = token
}

export const clearTokens = (): void => {
  memoryAccessToken = null
  memoryRefreshToken = null
}
