import { createFileRoute } from '@tanstack/react-router'
import { AuthSignUpView } from '../components/devbraid/auth-register'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  return <AuthSignUpView />
}
