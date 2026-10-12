import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-md px-2 py-[3px] text-xs font-medium whitespace-nowrap',
  {
    variants: {
      variant: {
        neutral: 'bg-muted text-muted-foreground',
        primary: 'bg-primary-soft text-primary-soft-foreground',
        beginner: 'bg-beginner-soft text-beginner-foreground',
        intermediate: 'bg-intermediate-soft text-intermediate-foreground',
        advanced: 'bg-advanced-soft text-advanced-foreground',
      },
    },
    defaultVariants: {
      variant: 'neutral',
    },
  },
)

type BadgeProps = React.ComponentProps<'span'> & VariantProps<typeof badgeVariants>

export const Badge = ({ className, variant, ...props }: BadgeProps) => {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />
}
