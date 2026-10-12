import { cn } from '@/lib/utils'
import type { CodeLine } from '@/types'

type CodeBlockProps = {
  lines: CodeLine[]
  highlight?: readonly [number, number] | null
  wrap?: boolean
  size?: 'sm' | 'md'
  className?: string
  ref?: React.Ref<HTMLPreElement>
} & Omit<React.ComponentProps<'pre'>, 'children' | 'ref'>

export const CodeBlock = ({
  lines,
  highlight,
  wrap = false,
  size = 'md',
  className,
  ref,
  ...props
}: CodeBlockProps) => {
  return (
    <pre
      ref={ref}
      className={cn(
        'm-0 overflow-x-auto font-mono text-code-foreground',
        size === 'sm' ? 'py-3 text-[12.5px] leading-[1.6]' : 'py-4 text-[13.5px] leading-[1.75]',
        className,
      )}
      {...props}
    >
      <code className={cn('block min-w-full', !wrap && 'w-max')}>
        {lines.map((line, index) => {
          const lineNumber = index + 1
          const active = highlight
            ? lineNumber >= highlight[0] && lineNumber <= highlight[1]
            : false
          return (
            <span
              key={lineNumber}
              data-line={lineNumber}
              className={cn('flex transition-colors', active && 'bg-code-highlight')}
            >
              <span
                aria-hidden
                className={cn(
                  'shrink-0 pr-4 text-right text-code-line-number select-none',
                  size === 'sm' ? 'w-8 pr-3' : 'w-11',
                )}
              >
                {lineNumber}
              </span>
              <span
                className={cn(
                  'pr-6',
                  wrap ? 'min-w-0 break-words whitespace-pre-wrap' : 'whitespace-pre',
                )}
              >
                {line.length === 0
                  ? ' '
                  : line.map((token, tokenIndex) => (
                      <span key={tokenIndex} style={{ color: token.color }}>
                        {token.content}
                      </span>
                    ))}
                {/* Newline asli agar seleksi manual tetap menyalin per baris. */}
                {index < lines.length - 1 ? '\n' : null}
              </span>
            </span>
          )
        })}
      </code>
    </pre>
  )
}
