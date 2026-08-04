import type { ReactNode } from 'react'
import { IsometricAuth } from '@/components/marketing/isometric-auth'

interface AuthShellProps {
  children: ReactNode
  /** Which variant of the isometric illustration to show */
  variant?: 'login' | 'register'
}

export function AuthShell({ children, variant = 'login' }: AuthShellProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left: Isometric illustration + Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface items-center justify-center p-12">
        <div className="w-full max-w-md">
          <IsometricAuth variant={variant} className="w-full" />
        </div>
      </div>
      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
