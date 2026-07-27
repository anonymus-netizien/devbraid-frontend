import { useState } from 'react'
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { AuthShell } from '../components/devbraid/auth-shell'
import { setAccessToken, setRefreshToken } from '../lib/tokens'
import apiClient from '../lib/api-client'
import type { ApiResponse, LoginResponse } from '../types'

export const Route = createFileRoute('/auth/login')({
  component: LoginPage,
})

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await apiClient.post<ApiResponse<LoginResponse>>('/auth/login', { email, password })
      if (data.success) {
        setAccessToken(data.data.accessToken)
        setRefreshToken(data.data.refreshToken)
        toast.success('Welcome back!')
        navigate({ to: '/dashboard' })
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthShell>
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-1">Sign in</h2>
        <p className="text-sm text-muted-foreground mb-6">Welcome back to DevBraid</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5">Email</label>
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required className="w-full px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
          </div>
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">Password</label>
              <Link to="/auth/forgot" className="text-xs text-primary hover:underline">Forgot?</Link>
            </div>
            <input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required className="w-full px-3 py-2 rounded-lg bg-surface border border-hairline text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary" />
          </div>
          <button type="submit" disabled={loading} className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          New to DevBraid? <Link to="/auth/register" className="text-primary hover:underline">Create an account</Link>
        </p>
      </div>
    </AuthShell>
  )
}
