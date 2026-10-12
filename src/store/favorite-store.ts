import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type FavoriteState = {
  slugs: string[]
  toggle: (slug: string) => void
}

export const useFavoriteStore = create<FavoriteState>()(
  persist(
    (set) => ({
      slugs: [],
      toggle: (slug) =>
        set((state) => ({
          slugs: state.slugs.includes(slug)
            ? state.slugs.filter((item) => item !== slug)
            : [slug, ...state.slugs],
        })),
    }),
    {
      name: 'querylab-favorites',
      skipHydration: true,
      partialize: (state) => ({ slugs: state.slugs }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<FavoriteState>
        const slugs = Array.isArray(saved.slugs)
          ? saved.slugs.filter((slug): slug is string => typeof slug === 'string')
          : []
        return { ...current, slugs }
      },
    },
  ),
)
