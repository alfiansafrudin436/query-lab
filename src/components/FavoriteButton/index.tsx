'use client'

import { StarIcon } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useFavoriteStore } from '@/store/favorite-store'

type FavoriteButtonProps = {
  slug: string
  title: string
  withLabel?: boolean
  size?: 'md' | 'lg'
  className?: string
}

export const FavoriteButton = ({
  slug,
  title,
  withLabel = false,
  size = 'md',
  className,
}: FavoriteButtonProps) => {
  const isFavorite = useFavoriteStore((state) => state.slugs.includes(slug))
  const toggle = useFavoriteStore((state) => state.toggle)

  return (
    <button
      type="button"
      onClick={() => toggle(slug)}
      aria-pressed={isFavorite}
      aria-label={withLabel ? undefined : `Simpan ${title} ke favorit`}
      className={cn(
        buttonVariants({ variant: 'outline', size: withLabel ? 'md' : 'icon' }),
        size === 'lg' && !withLabel && 'size-[52px] rounded-xl',
        isFavorite && 'text-favorite',
        className,
      )}
    >
      <StarIcon fill={isFavorite ? 'currentColor' : 'none'} aria-hidden />
      {withLabel && <span className="text-foreground">{isFavorite ? 'Tersimpan' : 'Simpan'}</span>}
    </button>
  )
}
