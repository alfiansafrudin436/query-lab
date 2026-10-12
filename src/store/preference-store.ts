import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DIALECTS } from '@/lib/content-schema'
import type { Dialect } from '@/types'

type PreferenceState = {
  dialect: Dialect
  wrap: boolean
  setDialect: (dialect: Dialect) => void
  toggleWrap: () => void
}

export const usePreferenceStore = create<PreferenceState>()(
  persist(
    (set) => ({
      dialect: 'postgresql',
      wrap: false,
      setDialect: (dialect) => set({ dialect }),
      toggleWrap: () => set((state) => ({ wrap: !state.wrap })),
    }),
    {
      name: 'querylab-preferences',
      // Rehydrate manual setelah mount (lihat Providers) agar render server dan client sama.
      skipHydration: true,
      partialize: (state) => ({ dialect: state.dialect, wrap: state.wrap }),
      merge: (persisted, current) => {
        const saved = (persisted ?? {}) as Partial<PreferenceState>
        return {
          ...current,
          dialect: DIALECTS.includes(saved.dialect as Dialect)
            ? (saved.dialect as Dialect)
            : current.dialect,
          wrap: typeof saved.wrap === 'boolean' ? saved.wrap : current.wrap,
        }
      },
    },
  ),
)
