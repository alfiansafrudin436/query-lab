import { DIALECTS } from '@/lib/content-schema'
import type { Dialect, Difficulty } from '@/types'

export { DIALECTS }

export const DIALECT_LABEL: Record<Dialect, string> = {
  postgresql: 'PostgreSQL',
  mysql: 'MySQL',
  sqlite: 'SQLite',
}

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  beginner: 'Pemula',
  intermediate: 'Menengah',
  advanced: 'Lanjut',
}

export const DIFFICULTY_RANK: Record<Difficulty, number> = {
  beginner: 0,
  intermediate: 1,
  advanced: 2,
}

export const availableDialects = (variants: { dialects: Dialect[] }[]): Dialect[] => {
  const available = new Set(variants.flatMap((variant) => variant.dialects))
  return DIALECTS.filter((dialect) => available.has(dialect))
}

// Pilih varian untuk dialek yang diinginkan; jika tidak ada, pakai varian pertama.
export const pickVariant = <T extends { dialects: Dialect[] }>(
  variants: T[],
  preferred: Dialect,
): { variant: T; dialect: Dialect } => {
  const match = variants.find((variant) => variant.dialects.includes(preferred))
  if (match) return { variant: match, dialect: preferred }
  const fallback = variants[0]
  return { variant: fallback, dialect: fallback.dialects[0] }
}
