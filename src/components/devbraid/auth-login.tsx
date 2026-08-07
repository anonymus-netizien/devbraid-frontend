import { SignIn } from '@clerk/clerk-react'
import { AuthShell } from './auth-shell'

export function AuthLoginView({ redirect }: { redirect?: string }) {
  const afterSignInUrl = redirect && redirect !== '/' ? redirect : '/dashboard'
  return (
    <AuthShell variant="login">
      {import.meta.env.VITE_CLERK_PUBLISHABLE_KEY ? (
        <SignIn
          routing="path"
          path="/auth/login"
          signUpUrl="/auth/register"
          afterSignInUrl={afterSignInUrl}
          fallbackRedirectUrl="/dashboard"
        />
      ) : (
        <div className="rounded-lg border border-hairline bg-surface p-5">
          <h2 className="text-lg font-semibold text-foreground mb-1">
            Sign in is not configured yet
          </h2>
          <p className="text-sm text-muted-foreground">
            Add <code className="font-mono text-primary">VITE_CLERK_PUBLISHABLE_KEY</code> to{' '}
            <code className="font-mono text-primary">.env.development</code> — from
            dashboard.clerk.com &rarr; API Keys — to enable sign-in.
          </p>
        </div>
      )}
    </AuthShell>
  )
}
