import type { ReactNode } from 'react'

interface AuthShellProps {
  children: ReactNode
}

export function AuthShell({ children }: AuthShellProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left: Brand */}
      <div className="hidden lg:flex lg:w-1/2 bg-surface items-center justify-center p-12">
        <div className="max-w-md text-center">
          <div className="h-12 w-12 rounded-xl bg-primary mx-auto mb-6 flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground" aria-hidden="true">B</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-3">DevBraid</h1>
          <p className="text-muted-foreground">Your engineering narrative. Capture decisions, track changes, publish cited briefs.</p>
        </div>
      </div>
      {/* Right: Form */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  )
}
