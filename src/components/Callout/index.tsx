import { InfoIcon, LightbulbIcon, TriangleAlertIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { QueryNote } from '@/types'

type CalloutProps = {
  type: QueryNote['type']
  title?: string
  children: React.ReactNode
  className?: string
}

const STYLE = {
  warning: {
    icon: TriangleAlertIcon,
    box: 'border-warning-border bg-warning-soft',
    title: 'text-warning-foreground',
    text: 'text-warning-text',
    srLabel: 'Peringatan',
  },
  info: {
    icon: InfoIcon,
    box: 'border-info-border bg-info-soft',
    title: 'text-info-foreground',
    text: 'text-info-text',
    srLabel: 'Info',
  },
  tip: {
    icon: LightbulbIcon,
    box: 'border-tip-border bg-tip-soft',
    title: 'text-tip-foreground',
    text: 'text-tip-text',
    srLabel: 'Tips',
  },
}

export const Callout = ({ type, title, children, className }: CalloutProps) => {
  const style = STYLE[type]
  const Icon = style.icon
  return (
    <div
      role="note"
      className={cn('flex gap-3 rounded-[10px] border px-4 py-3.5', style.box, className)}
    >
      <Icon className={cn('mt-0.5 size-5 shrink-0', style.title)} aria-hidden />
      <div className="flex min-w-0 flex-col gap-1">
        {title ? (
          <strong className={cn('text-[14.5px] font-semibold', style.title)}>{title}</strong>
        ) : (
          <span className="sr-only">{style.srLabel}: </span>
        )}
        <div className={cn('text-[14.5px] leading-relaxed', style.text)}>{children}</div>
      </div>
    </div>
  )
}
