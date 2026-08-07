import { SignUp } from '@clerk/clerk-react'
import { AuthShell } from './auth-shell'

export function AuthSignUpView() {
  return (
    <AuthShell variant="register">
      {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? (
        <SignUp
          routing="path"
          path="/auth/register"
          signInUrl="/auth/login"
          afterSignUpUrl="/dashboard"
          fallbackRedirectUrl="/dashboard"
        />
      ) : (
        <div className="rounded-lg border border-hairline bg-surface p-5">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Sign up is not configured yet
          </h2>
          <p className="text-sm text-muted-foreground">
            Add <code className="font-mono text-primary">VITE_CLERK_PUBLISHABLE_KEY</code> to{' '}
            <code className="font-mono text-primary">.env.development</code> to enable registration.
          </p>
        </div>
      )}
    </AuthShell>
  )
}
