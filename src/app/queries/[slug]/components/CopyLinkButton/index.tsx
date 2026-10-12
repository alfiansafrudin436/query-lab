'use client'

import { CheckIcon, Link2Icon } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { useCopyToClipboard } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'

type CopyLinkButtonProps = {
  path: string
}

export const CopyLinkButton = ({ path }: CopyLinkButtonProps) => {
  const { status, copy } = useCopyToClipboard()

  return (
    <button
      type="button"
      onClick={() => copy(`${window.location.origin}${path}`)}
      className={cn(buttonVariants({ variant: 'outline' }), 'min-w-[136px]')}
    >
      {status === 'copied' ? <CheckIcon aria-hidden /> : <Link2Icon aria-hidden />}
      {status === 'copied' ? 'Link disalin' : 'Salin link'}
      <span className="sr-only" aria-live="polite">
        {status === 'copied' ? 'Link halaman disalin ke clipboard' : ''}
      </span>
    </button>
  )
}
