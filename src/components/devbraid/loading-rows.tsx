import { Skeleton } from '../ui/skeleton'

interface LoadingRowsProps {
  count?: number
}

export function LoadingRows({ count = 5 }: LoadingRowsProps) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 p-4 rounded-lg border border-hairline bg-surface">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[120px]" />
          <Skeleton className="h-4 w-[80px]" />
          <Skeleton className="h-4 w-[100px]" />
        </div>
      ))}
    </div>
  )
}
