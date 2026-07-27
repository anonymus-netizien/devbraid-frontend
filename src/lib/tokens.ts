let memoryAccessToken: string | null = null
let memoryRefreshToken: string | null = null

export const getAccessToken = () => memoryAccessToken
export const setAccessToken = (token: string | null) => { memoryAccessToken = token }
export const getRefreshToken = () => memoryRefreshToken
export const setRefreshToken = (token: string | null) => { memoryRefreshToken = token }
export const clearTokens = () => { memoryAccessToken = null; memoryRefreshToken = null }
