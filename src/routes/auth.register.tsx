import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { AuthShell } from '../components/devbraid/auth-shell'
import authService from '../services/auth.service'

export const Route = createFileRoute('/auth/register')({
  component: RegisterPage,
})

function RegisterPage() {
  const navigate = useNavigate()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const passwordStrength = (() => {
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (password.length >= 12) score++
    if (score <= 1) return { label: 'Weak', color: 'text-danger-fg' }
    if (score <= 3) return { label: 'OK', color: 'text-warning-fg' }
    return { label: 'Strong', color: 'text-success-fg' }
  })()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      toast.error('Passwords do not match')
      return
    }
    setLoading(true)
    try {
      await authService.register({ fullName, email, password })
      try {
        await authService.sendOtp(email)
      } catch {
        // Send OTP may fail if rate limited or already sent
      }
      toast.success('Account created! Check your email for the OTP.')
      navigate({ to: '/auth/otp', search: { email } })
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }


  return (
    <AuthShell>
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-1">Create workspace</h2>
        <p className="text-sm text-muted-foreground mb-6">Start capturing your engineering narrative</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="fullName" className="block text-sm font-medium text-foreground mb-1.5">Full name</label>
            <input id="fullName" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
          </div>
          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="reg-password" className="text-sm font-medium text-foreground">Password</label>
              {password && <span className={`text-xs ${passwordStrength.color}`}>{passwordStrength.label}</span>}
            </div>
            <input id="reg-password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-medium text-foreground mb-1.5">Confirm password</label>
            <input id="confirm-password" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="w-full px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {loading ? 'Creating…' : 'Create workspace'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          Already have an account? <Link to="/auth/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </AuthShell>
  )
}
