'use client'

import * as SheetPrimitive from '@radix-ui/react-dialog'
import { XIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

const Sheet = SheetPrimitive.Root
const SheetTrigger = SheetPrimitive.Trigger
const SheetClose = SheetPrimitive.Close

type SheetContentProps = React.ComponentProps<typeof SheetPrimitive.Content> & {
  side?: 'right' | 'bottom'
}

const sideClassName: Record<NonNullable<SheetContentProps['side']>, string> = {
  right:
    'inset-y-0 right-0 h-full w-[min(88vw,360px)] border-l data-[state=open]:animate-sheet-in-right',
  bottom:
    'inset-x-0 bottom-0 max-h-[88dvh] rounded-t-[20px] border-t pb-[env(safe-area-inset-bottom)] data-[state=open]:animate-sheet-in-bottom',
}

const SheetContent = ({ side = 'right', className, children, ...props }: SheetContentProps) => {
  return (
    <SheetPrimitive.Portal>
      <SheetPrimitive.Overlay className="fixed inset-0 z-50 bg-overlay data-[state=open]:animate-fade-in" />
      <SheetPrimitive.Content
        className={cn(
          'fixed z-50 flex flex-col bg-card text-foreground shadow-2xl outline-none',
          sideClassName[side],
          className,
        )}
        {...props}
      >
        {side === 'bottom' && (
          <span aria-hidden className="mx-auto mt-2 h-1.5 w-10 shrink-0 rounded-full bg-input" />
        )}
        {children}
        <SheetPrimitive.Close className="absolute top-3 right-3 inline-flex size-11 items-center justify-center rounded-[10px] text-muted-foreground hover:bg-muted hover:text-foreground">
          <XIcon className="size-5" />
          <span className="sr-only">Tutup</span>
        </SheetPrimitive.Close>
      </SheetPrimitive.Content>
    </SheetPrimitive.Portal>
  )
}

const SheetHeader = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div className={cn('flex flex-col gap-1 px-4 pt-4 pr-16 pb-2', className)} {...props} />
}

const SheetTitle = ({ className, ...props }: React.ComponentProps<typeof SheetPrimitive.Title>) => {
  return (
    <SheetPrimitive.Title
      className={cn('text-lg font-semibold tracking-[-0.01em]', className)}
      {...props}
    />
  )
}

const SheetDescription = ({
  className,
  ...props
}: React.ComponentProps<typeof SheetPrimitive.Description>) => {
  return (
    <SheetPrimitive.Description
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
}

const SheetFooter = ({ className, ...props }: React.ComponentProps<'div'>) => {
  return <div className={cn('mt-auto flex gap-2.5 border-t px-4 py-3', className)} {...props} />
}

export {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
}
