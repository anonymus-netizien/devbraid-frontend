import { cn } from '@/lib/utils'
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react'
import type { ReactNode, InputHTMLAttributes } from 'react'
import { forwardRef } from 'react'

export function FieldLabel({
  htmlFor,
  children,
  hint,
}: {
  htmlFor: string
  children: ReactNode
  hint?: ReactNode
}) {
  return (
    <div className="mb-2 flex items-center justify-between">
      <label
        htmlFor={htmlFor}
        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/90"
      >
        {children}
      </label>
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </div>
  )
}

type TextInputProps = InputHTMLAttributes<HTMLInputElement> & {
  invalid?: boolean
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ className, invalid, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        'h-10 w-full rounded-md border bg-surface/60 px-4 text-base text-foreground placeholder:text-muted-foreground/50 outline-none transition-all duration-200',
        'focus:border-primary/80 focus:bg-surface focus:ring-2 focus:ring-primary/30',
        invalid
          ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
          : 'border-hairline hover:border-hairline/90',
        className,
      )}
      {...props}
    />
  ),
)
TextInput.displayName = 'TextInput'

export function FieldError({ children }: { children?: ReactNode }) {
  if (!children) return null
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-rose-300">
      <AlertCircle className="size-3.5 shrink-0" />
      {children}
    </p>
  )
}

export function FormAlert({ tone, children }: { tone: 'error' | 'success'; children: ReactNode }) {
  const isError = tone === 'error'
  return (
    <div
      role={isError ? 'alert' : 'status'}
      className={cn(
        'flex items-start gap-2.5 rounded-xl border px-4 py-3 text-xs sm:text-sm font-medium backdrop-blur-sm',
        isError
          ? 'border-rose-500/30 bg-rose-500/10 text-rose-200'
          : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-200',
      )}
    >
      {isError ? (
        <AlertCircle className="mt-0.5 size-4 shrink-0" />
      ) : (
        <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
      )}
      <div className="min-w-0 leading-relaxed">{children}</div>
    </div>
  )
}

export function SubmitButton({
  loading,
  children,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { loading?: boolean }) {
  return (
    <button
      {...rest}
      disabled={loading || rest.disabled}
      className={cn(
        'inline-flex h-10 w-full items-center justify-center gap-2.5 rounded-md bg-primary text-base font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all duration-200',
        'hover:bg-primary/90 hover:shadow-primary/30 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none',
      )}
    >
      {loading && <Loader2 className="size-4.5 animate-spin" />}
      {children}
    </button>
  )
}
