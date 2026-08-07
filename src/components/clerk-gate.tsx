import { useAuth as useClerkAuth } from '@clerk/clerk-react'

// Keeps the router from mounting until Clerk has a session token ready, so the
// first page's queries never fire without an Authorization header (no spurious
// 401 bounce on first navigation).
export function ClerkGate({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useClerkAuth()
  if (!isLoaded) {
    return <div className="grid min-h-dvh place-items-center bg-background" aria-busy="true" />
  }
  return <>{children}</>
}
