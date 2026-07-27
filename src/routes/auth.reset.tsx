import { createFileRoute, Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { AuthShell } from '../components/devbraid/auth-shell'

export const Route = createFileRoute('/auth/reset')({
  validateSearch: (search: Record<string, unknown>) => ({
    token: (search.token as string) || '',
  }),
  component: ResetPasswordPage,
})

const handleResetSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  toast.info('Coming soon')
}

function ResetPasswordPage() {
  return (
    <AuthShell>
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-1">Reset password</h2>
        <p className="text-sm text-muted-foreground mb-6">Enter your new password below.</p>
        <form onSubmit={handleResetSubmit} className="space-y-4">
          <div>
            <label htmlFor="reset-password" className="block text-sm font-medium text-foreground mb-1.5">New password</label>
            <input id="reset-password" type="password" placeholder="••••••••" required className="w-full px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
          </div>
          <div>
            <label htmlFor="reset-confirm" className="block text-sm font-medium text-foreground mb-1.5">Confirm password</label>
            <input id="reset-confirm" type="password" placeholder="••••••••" required className="w-full px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">Reset password</button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/auth/login" className="text-primary hover:underline">Back to sign in</Link>
        </p>
      </div>
    </AuthShell>
  )
}
