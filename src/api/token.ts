// Clerk session-token provider. AuthContext registers `() => getToken()`
// once Clerk is loaded; axios awaits it on every request.
type TokenProvider = () => Promise<string | null>
let tokenProvider: TokenProvider | null = null

export const setTokenProvider = (provider: TokenProvider | null): void => {
  tokenProvider = provider
}

export const getSessionToken = async (): Promise<string | null> => {
  if (!tokenProvider) return null
  return tokenProvider()
}

export const clearTokens = (): void => {
  tokenProvider = null
}
