'use client'

import { CheckIcon, CopyIcon, TriangleAlertIcon } from 'lucide-react'
import { useCopyToClipboard, type CopyStatus } from '@/hooks/use-copy-to-clipboard'
import { cn } from '@/lib/utils'

type CopyTone = 'light' | 'dark' | 'primary'

type CopyButtonProps = {
  text: string
  /** Label aksesibel, mis. "Salin query UPSERT versi PostgreSQL". */
  label: string
  children?: React.ReactNode
  tone?: CopyTone
  size?: 'md' | 'lg'
  className?: string
  onCopied?: () => void
  onError?: () => void
}

const toneClassName: Record<CopyTone, Record<CopyStatus, string>> = {
  light: {
    idle: 'border-input bg-card text-foreground hover:bg-muted',
    copied: 'border-success-border bg-success-soft text-success-foreground',
    error: 'border-warning-border bg-warning-soft text-warning-foreground',
  },
  dark: {
    idle: 'border-white bg-white text-[#0d1117] hover:bg-[#e6e9ef]',
    copied: 'border-code-success-border bg-code-success-bg text-code-success-foreground',
    error: 'border-[#5c4413] bg-[#2a1f0b] text-[#f5c97a]',
  },
  primary: {
    idle: 'border-primary bg-primary text-primary-foreground hover:bg-primary-hover',
    copied: 'border-success-border bg-success-soft text-success-foreground',
    error: 'border-warning-border bg-warning-soft text-warning-foreground',
  },
}

const LIVE_MESSAGE: Record<CopyStatus, string> = {
  idle: '',
  copied: 'Disalin ke clipboard',
  error: 'Gagal menyalin otomatis. Tekan Ctrl+C untuk menyalin.',
}

export const CopyButton = ({
  text,
  label,
  children = 'Salin',
  tone = 'light',
  size = 'md',
  className,
  onCopied,
  onError,
}: CopyButtonProps) => {
  const { status, copy } = useCopyToClipboard()

  const handleClick = async () => {
    const copied = await copy(text)
    if (copied) onCopied?.()
    else onError?.()
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={label}
      className={cn(
        'relative inline-flex min-w-28 cursor-pointer items-center justify-center gap-2 rounded-[10px] border font-medium whitespace-nowrap transition-colors [&_svg]:size-4 [&_svg]:shrink-0',
        size === 'md' ? 'h-11 px-3.5 text-sm' : 'h-[52px] px-4 text-[15.5px] font-semibold',
        toneClassName[tone][status],
        className,
      )}
    >
      {status === 'copied' ? (
        <>
          <CheckIcon strokeWidth={2.5} aria-hidden />
          <span>Tersalin!</span>
        </>
      ) : status === 'error' ? (
        <>
          <TriangleAlertIcon aria-hidden />
          <span>Tekan Ctrl+C</span>
        </>
      ) : (
        <>
          <CopyIcon aria-hidden />
          <span>{children}</span>
        </>
      )}
      <span className="sr-only" aria-live="polite">
        {LIVE_MESSAGE[status]}
      </span>
    </button>
  )
}
