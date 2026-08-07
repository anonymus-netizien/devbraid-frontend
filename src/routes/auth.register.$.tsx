import { createFileRoute } from '@tanstack/react-router'
import { AuthSignUpView } from '../components/devbraid/auth-register'

// Clerk path routing mounts subpaths (e.g. /verify-email-address) under the
// register path. This splat route re-renders the same SignUp page so those
// steps never 404.
export const Route = createFileRoute('/auth/register/$')({
  component: RegisterStepPage,
})

function RegisterStepPage() {
  return <AuthSignUpView />
}
