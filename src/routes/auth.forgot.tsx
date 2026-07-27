import { createFileRoute, Link } from '@tanstack/react-router'
import { toast } from 'sonner'
import { AuthShell } from '../components/devbraid/auth-shell'

export const Route = createFileRoute('/auth/forgot')({
  component: ForgotPasswordPage,
})

const handleForgotSubmit = (e: React.FormEvent) => {
  e.preventDefault()
  toast.info('Coming soon')
}

function ForgotPasswordPage() {
  return (
    <AuthShell>
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-1">Forgot password</h2>
        <p className="text-sm text-muted-foreground mb-6">Enter your email and we'll send you a reset link.</p>
        <form onSubmit={handleForgotSubmit} className="space-y-4">
          <div>
            <label htmlFor="forgot-email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input id="forgot-email" type="email" placeholder="you@company.com" required className="w-full px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
          </div>
          <button type="submit" className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">Send reset link</button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/auth/login" className="text-primary hover:underline">Back to sign in</Link>
        </p>
      </div>
    </AuthShell>
  )
}
