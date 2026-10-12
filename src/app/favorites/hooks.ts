'use client'

import { useStoreHydrated } from '@/hooks/use-store-hydrated'
import { useFavoriteStore } from '@/store/favorite-store'
import type { QuerySummary } from '@/types'

export const useFavoritesPage = (items: QuerySummary[]) => {
  const slugs = useFavoriteStore((state) => state.slugs)
  const hydrated = useStoreHydrated(useFavoriteStore)

  // Urutan mengikuti waktu disimpan (terbaru dulu); slug yang sudah tidak ada diabaikan.
  const favorites = slugs
    .map((slug) => items.find((item) => item.slug === slug))
    .filter((item): item is QuerySummary => Boolean(item))

  return { hydrated, favorites }
}
