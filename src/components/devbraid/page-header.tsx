import type { ReactNode } from 'react'

interface PageHeaderProps {
  eyebrow?: ReactNode
  title: string
  description?: string
  actions?: ReactNode
  action?: ReactNode
}

export function PageHeader({ eyebrow, title, description, actions, action }: PageHeaderProps) {
  const actionContent = actions ?? action
  return (
    <div className="mb-8 flex items-start justify-between gap-6">
      <div className="min-w-0 flex-1">
        {eyebrow && (
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {eyebrow}
          </div>
        )}
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>
        {description && (
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </div>
      {actionContent && <div className="shrink-0">{actionContent}</div>}
    </div>
  )
}

