import { createFileRoute } from '@tanstack/react-router'
import { AuthLoginView } from '../components/devbraid/auth-login'

export const Route = createFileRoute('/auth/login')({
  validateSearch: (search: Record<string, unknown>) => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  component: LoginPage,
})

function LoginPage() {
  const redirect = Route.useSearch({ select: (s) => s.redirect })
  return <AuthLoginView redirect={redirect} />
}
