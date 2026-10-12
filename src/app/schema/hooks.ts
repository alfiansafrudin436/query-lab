'use client'

import { useActiveVariant } from '@/hooks/use-active-variant'
import { DIALECT_LABEL, pickVariant } from '@/lib/dialects'
import type { HighlightedCode } from '@/types'

export const useSchemaPage = (ddl: HighlightedCode[], seed: HighlightedCode[]) => {
  const { variant, dialect, available, setDialect } = useActiveVariant(ddl)
  // Seed punya satu varian per dialek karena ekspresi tanggalnya berbeda-beda.
  const activeSeed = pickVariant(seed, dialect).variant

  return {
    dialect,
    dialectLabel: DIALECT_LABEL[dialect],
    available,
    setDialect,
    copyAllText: `${variant.code}\n\n${activeSeed.code}`,
  }
}
