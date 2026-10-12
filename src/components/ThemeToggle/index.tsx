'use client'

import { MoonIcon, SunIcon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { buttonVariants } from '@/components/ui/button'
import { useIsClient } from '@/hooks/use-is-client'
import { cn } from '@/lib/utils'

type ThemeToggleProps = {
  className?: string
}

export const ThemeToggle = ({ className }: ThemeToggleProps) => {
  const { resolvedTheme, setTheme } = useTheme()
  const isClient = useIsClient()
  const isDark = isClient && resolvedTheme === 'dark'

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      aria-label={isDark ? 'Ganti ke tema terang' : 'Ganti ke tema gelap'}
      className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), className)}
    >
      {isDark ? <SunIcon /> : <MoonIcon />}
    </button>
  )
}
