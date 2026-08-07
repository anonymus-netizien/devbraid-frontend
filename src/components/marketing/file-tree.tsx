import { Folder, FileCode2 } from 'lucide-react'
import { cn } from '@/lib/utils'

// ponytail: static data — module scope so it isn't rebuilt every render
const rows = [
  { depth: 0, name: 'src/', icon: Folder, dir: true },
  { depth: 1, name: 'api/', icon: Folder, dir: true },
  { depth: 2, name: 'routes.ts', icon: FileCode2 },
  { depth: 1, name: 'core/', icon: Folder, dir: true },
  { depth: 2, name: 'config.ts', icon: FileCode2 },
  { depth: 1, name: 'index.ts', icon: FileCode2 },
]

export function FileTree() {
  return (
    <div className="rounded-lg border border-hairline bg-[#0e0e0e] p-4">
      {rows.map((r) => (
        <div
          key={r.name}
          className="flex items-center gap-2 py-0.5 font-mono text-[13px] text-muted-foreground"
          style={{ paddingLeft: r.depth * 16 }}
        >
          <r.icon className={cn('size-3.5', r.dir && 'text-primary/70')} />
          <span className={r.dir ? 'text-foreground/90' : 'text-muted-foreground'}>{r.name}</span>
        </div>
      ))}
    </div>
  )
}
