import { AlertCircle } from 'lucide-react'

interface ErrorPanelProps {
  title?: string
  message: string
}

export function ErrorPanel({ title = 'Something went wrong', message }: ErrorPanelProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <AlertCircle className="mb-4 h-8 w-8 text-danger-fg" />
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      <p className="mt-1 text-sm text-muted-foreground max-w-md">{message}</p>
    </div>
  )
}
