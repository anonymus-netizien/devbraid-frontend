import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { FileText, GitCommitHorizontal, Link2, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Element } from 'hast'
import type { ReactNode } from 'react'

const CITE_START = '\u0000'
const CITE_END = '\u0001'

const citationPattern = /\[(file|commit|source):\s*([^\]]+)\]/g
const inferencePattern = /\[inference\]/g

interface ParsedSegment {
  kind: 'cited' | 'inference' | 'text'
  type?: 'file' | 'commit' | 'source'
  ref?: string
  text: string
  id: number
}

function parseSegments(content: string): ParsedSegment[] {
  let encoded = content
    .replace(citationPattern, (_, type, ref) => `${CITE_START}cite:${type}:${ref}${CITE_END}`)
    .replace(inferencePattern, `${CITE_START}inference${CITE_END}`)

  let segId = 0
  const seg = (s: Omit<ParsedSegment, 'id'>): ParsedSegment => ({ ...s, id: segId++ })

  const segments: ParsedSegment[] = []
  while (encoded.length > 0) {
    const start = encoded.indexOf(CITE_START)
    if (start === -1) {
      segments.push(seg({ kind: 'text', text: encoded }))
      break
    }
    if (start > 0) segments.push(seg({ kind: 'text', text: encoded.slice(0, start) }))
    const end = encoded.indexOf(CITE_END, start)
    const token = encoded.slice(start + 1, end === -1 ? undefined : end)
    if (token.startsWith('cite:')) {
      const [, type, ...rest] = token.split(':')
      segments.push(
        seg({
          kind: 'cited',
          type: type as 'file' | 'commit' | 'source',
          ref: rest.join(':'),
          text: '',
        }),
      )
    } else {
      segments.push(seg({ kind: 'inference', text: '' }))
    }
    encoded = end === -1 ? '' : encoded.slice(end + 1)
  }
  return segments
}

const citeIcons = {
  file: FileText,
  commit: GitCommitHorizontal,
  source: Link2,
}

function InlineChips({ text }: { text: string }) {
  return (
    <>
      {parseSegments(text).map((seg) => {
        if (seg.kind === 'text') return <span key={seg.id}>{seg.text}</span>
        if (seg.kind === 'inference') {
          return (
            <span
              key={seg.id}
              className="mx-0.5 inline-flex items-center gap-1 rounded-full border border-inference/25 bg-inference/10 px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-inference align-middle select-none"
            >
              <Sparkles className="size-2.5" />
              inference
            </span>
          )
        }
        const Icon = citeIcons[seg.type ?? 'source']
        return (
          <span
            key={seg.id}
            className="mx-0.5 inline-flex items-center gap-1 rounded-full border border-primary/25 bg-primary/10 px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-primary align-middle select-none"
            title={`Cited: ${seg.ref}`}
          >
            <Icon className="size-2.5" />
            <span className="max-w-[24ch] truncate">{seg.ref}</span>
          </span>
        )
      })}
    </>
  )
}

function SegmentRenderer({ children, node }: { children?: ReactNode; node?: ReactNode }) {
  let inCode = false
  let parent: unknown = node
  while (parent) {
    const el = parent as Element
    if (el.tagName === 'code' || el.tagName === 'pre') {
      inCode = true
      break
    }
    parent = (el as { parent?: unknown }).parent
  }
  if (inCode) return <>{children}</>
  const text = children == null ? '' : String(children)
  return <InlineChips text={text} />
}

export function Markdown({ content, className }: { content: string; className?: string }) {
  return (
    <div className={cn('prose-devbraid break-words [overflow-wrap:anywhere]', className)}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          text: SegmentRenderer as never,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
