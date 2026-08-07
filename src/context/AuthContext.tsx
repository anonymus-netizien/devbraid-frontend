import React, { useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useAuth as useClerkAuth, useUser } from '@clerk/clerk-react'
import type { User, UserProfileResponseData } from '../types/auth'
import authService from '../services/auth.service'
import { setTokenProvider } from '../api/token'
import { AuthContext, type AuthContextType } from './auth-context'

function mapProfileToUser(profile: UserProfileResponseData): User {
  return {
    id: profile.id ?? '',
    fullName: profile.fullName ?? '',
    email: profile.email ?? '',
    role: (profile.role as User['role']) ?? 'ROLE_DEVELOPER',
    createdAt: profile.createdAt,
  }
}

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, getToken, signOut } = useClerkAuth()
  const { user: clerkUser } = useUser()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)

  // Feed the Clerk session token to axios.
  useEffect(() => {
    setTokenProvider(() => getToken())
    return () => setTokenProvider(null)
  }, [getToken])

  // Mirror the Clerk user into local state; fall back to Clerk profile until
  // the backend /user/profile confirms the mirror.
  useEffect(() => {
    if (!isLoaded) return
    if (!isSignedIn) {
      setUser(null)
      setIsLoading(false)
      return
    }
    setIsLoading(true)
    authService
      .me()
      .then((profile) => setUser(mapProfileToUser(profile)))
      .catch(() => {
        if (clerkUser) {
          setUser({
            id: clerkUser.id,
            fullName: clerkUser.fullName ?? clerkUser.username ?? '',
            email: clerkUser.primaryEmailAddress?.emailAddress ?? '',
            role: 'ROLE_DEVELOPER',
            createdAt: undefined,
          })
        }
      })
      .finally(() => setIsLoading(false))
  }, [isLoaded, isSignedIn, clerkUser])

  const logout = useCallback(async () => {
    try {
      await signOut()
    } finally {
      setUser(null)
    }
  }, [signOut])

  const contextValue = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      logout,
    }),
    [user, isLoading, logout],
  )

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
