import { useState, useEffect } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { toast } from 'sonner'
import { AuthShell } from '../components/devbraid/auth-shell'
import authService from '../services/auth.service'

const OTP_SLOT_KEYS = [
  'otp-slot-0',
  'otp-slot-1',
  'otp-slot-2',
  'otp-slot-3',
  'otp-slot-4',
  'otp-slot-5',
]

export const Route = createFileRoute('/auth/otp')({
  validateSearch: (search: Record<string, unknown>) => ({
    email: (search.email as string) || '',
  }),
  component: OtpPage,
})

function OtpPage() {
  const { email } = Route.useSearch()
  const navigate = useNavigate()
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
  }

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus()
    }
  }

  const handleVerify = async () => {
    const code = otp.join('')
    if (code.length !== 6) {
      toast.error('Enter all 6 digits')
      return
    }
    setLoading(true)
    try {
      await authService.verifyOtp(email, code)
      toast.success('Email verified! You can now sign in.')
      navigate({ to: '/auth/login' })
    } catch (err: any) {
      toast.error(err.response?.data?.message || err.message || 'Invalid OTP')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (cooldown <= 0) return
    const timer = setInterval(() => {
      setCooldown((c) => Math.max(0, c - 1))
    }, 1000)
    return () => clearInterval(timer)
  }, [cooldown])

  const handleResend = async () => {
    if (cooldown > 0) return
    try {
      await authService.sendOtp(email)
      toast.success('OTP resent!')
      setCooldown(60)
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to resend OTP')
    }
  }

  return (
    <AuthShell>
      <div className="text-center">
        <h2 className="text-2xl font-semibold text-foreground mb-1">Verify your email</h2>
        <p className="text-sm text-muted-foreground mb-6">Enter the 6-digit code sent to {email}</p>
        <div className="flex justify-center gap-2 mb-6">
          {otp.map((digit, i) => (
            <input
              key={OTP_SLOT_KEYS[i]}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              aria-label={`Digit ${i + 1}`}
              className="w-12 h-14 text-center text-xl font-mono rounded-lg bg-surface border border-hairline text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleVerify}
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary/90 disabled:opacity-50 transition-colors mb-4"
        >
          {loading ? 'Verifying…' : 'Verify'}
        </button>
        <button
          type="button"
          onClick={handleResend}
          disabled={cooldown > 0}
          className="text-sm text-primary hover:underline disabled:opacity-50"
        >
          {cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend OTP'}
        </button>
      </div>
    </AuthShell>
  )
}
