import Link from 'next/link'
import { SITE_NAME } from '@/lib/site'
import { cn } from '@/lib/utils'

type LogoProps = {
  className?: string
}

export const LogoMark = ({ className }: LogoProps) => {
  return (
    <span
      aria-hidden
      className={cn(
        'inline-flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary text-white',
        className,
      )}
    >
      <svg
        viewBox="0 0 24 24"
        className="size-[18px]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m5 8 4 4-4 4" />
        <path d="M12 16h7" />
      </svg>
    </span>
  )
}

export const Logo = ({ className }: LogoProps) => {
  return (
    <Link
      href="/"
      aria-label={`${SITE_NAME}, ke beranda`}
      className={cn('inline-flex items-center gap-2.5 rounded-lg text-foreground', className)}
    >
      <LogoMark />
      <span className="text-[17px] font-semibold tracking-[-0.02em]">{SITE_NAME}</span>
    </Link>
  )
}
