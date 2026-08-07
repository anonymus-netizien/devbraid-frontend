import { createFileRoute } from '@tanstack/react-router'
import { AuthLoginView } from '../components/devbraid/auth-login'

// Clerk path routing appends step paths (e.g. /factor-one) to the mount path.
// This splat route re-renders the same SignIn page so those steps never 404.
export const Route = createFileRoute('/auth/login/$')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: LoginStepPage,
})

function LoginStepPage() {
  const redirect = Route.useSearch({ select: (s) => s.redirect })
  return <AuthLoginView redirect={redirect} />
}
