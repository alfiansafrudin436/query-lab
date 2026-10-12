import type { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

type EmptyStateProps = {
  icon: LucideIcon
  title: string
  description?: React.ReactNode
  children?: React.ReactNode
  headingLevel?: 'h1' | 'h2'
  className?: string
}

export const EmptyState = ({
  icon: Icon,
  title,
  description,
  children,
  headingLevel = 'h2',
  className,
}: EmptyStateProps) => {
  const Heading = headingLevel
  return (
    <div
      className={cn(
        'flex flex-col items-center gap-3.5 rounded-xl border border-dashed border-input bg-card px-6 py-14 text-center',
        className,
      )}
    >
      <span className="inline-flex size-12 items-center justify-center rounded-xl bg-muted text-muted-foreground">
        <Icon className="size-[22px]" aria-hidden />
      </span>
      <Heading className="text-lg font-semibold">{title}</Heading>
      {description && (
        <p className="max-w-md text-[14.5px] leading-relaxed text-muted-foreground">
          {description}
        </p>
      )}
      {children}
    </div>
  )
}
