'use client'

import { availableDialects, pickVariant } from '@/lib/dialects'
import { usePreferenceStore } from '@/store/preference-store'
import type { Dialect } from '@/types'

// Varian kode untuk dialek pilihan user (disimpan global), dengan fallback ke varian pertama.
export const useActiveVariant = <T extends { dialects: Dialect[] }>(variants: T[]) => {
  const preferred = usePreferenceStore((state) => state.dialect)
  const setDialect = usePreferenceStore((state) => state.setDialect)
  const { variant, dialect } = pickVariant(variants, preferred)
  return { variant, dialect, available: availableDialects(variants), setDialect }
}
