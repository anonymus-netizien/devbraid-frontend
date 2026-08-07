import { useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ClerkProvider } from '@clerk/clerk-react'
import { dark } from '@clerk/themes'
import { AuthContext } from './context/auth-context'
import { AuthProvider } from './context/AuthContext'
import { ClerkGate } from './components/clerk-gate'
import { routeTree } from './routeTree.gen'
import { setUnauthorizedHandler } from './api/axios'
import './index.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

const router = createRouter({ routeTree })

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
}

// Expired sessions bounce to sign-in in-SPA instead of a full page reload.
setUnauthorizedHandler(() => {
  const current = router.state.location.pathname
  if (current.startsWith('/auth/')) return
  void router.navigate({ to: '/auth/login', search: { redirect: current } })
})

const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string | undefined

// ponytail: noop provider keeps the app alive before a Clerk key is configured
function NoopAuthProvider({ children }: { children: React.ReactNode }) {
  const value = useMemo(
    () => ({ user: null, isAuthenticated: false, isLoading: false, logout: () => {} }),
    [],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

function Root() {
  if (!clerkPublishableKey) {
    return (
      <NoopAuthProvider>
        <RouterProvider router={router} />
      </NoopAuthProvider>
    )
  }
  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      signInUrl="/auth/login"
      signUpUrl="/auth/register"
      appearance={{
        baseTheme: dark,
        variables: {
          colorBackground: '#131313',
          colorInputBackground: '#1c1c1c',
          colorNeutral: '#f5f5f4',
          colorPrimary: '#dfc38c',
          colorText: '#ececEC',
          colorTextOnPrimaryBackground: '#3f2e04',
          colorInputText: '#ececec',
          borderRadius: '0.75rem',
        },
      }}
    >
      <AuthProvider>
        <ClerkGate>
          <RouterProvider router={router} />
        </ClerkGate>
      </AuthProvider>
    </ClerkProvider>
  )
}

// Keep the router from mounting until Clerk has a session token ready, so the
// first page's queries never fire without an Authorization header (no spurious
// 401 bounce on first navigation).
createRoot(document.getElementById('root')!).render(
  <QueryClientProvider client={queryClient}>
    <Root />
  </QueryClientProvider>,
)
