import type { z } from 'zod'
import type {
  categorySchema,
  dialectSchema,
  difficultySchema,
  explanationStepSchema,
  queryFileSchema,
  queryNoteSchema,
  querySampleSchema,
  queryVariantSchema,
  sampleTableSchema,
} from '@/lib/content-schema'

// Tipe konten, diturunkan dari schema Zod agar selalu sinkron dengan validasi.
export type Dialect = z.infer<typeof dialectSchema>
export type Difficulty = z.infer<typeof difficultySchema>
export type ExplanationStep = z.infer<typeof explanationStepSchema>
export type QueryVariant = z.infer<typeof queryVariantSchema>
export type SampleTable = z.infer<typeof sampleTableSchema>
export type QuerySample = z.infer<typeof querySampleSchema>
export type QueryNote = z.infer<typeof queryNoteSchema>
export type QueryFile = z.infer<typeof queryFileSchema>
export type Category = z.infer<typeof categorySchema>

export type QueryExample = QueryFile & {
  slug: string
  category: string
}

// Hasil syntax highlighting (dibuat di server, dirender di client).
export type CodeToken = {
  content: string
  color: string
}

export type CodeLine = CodeToken[]

export type HighlightedCode = {
  dialects: Dialect[]
  code: string
  lines: CodeLine[]
  note?: string
}

export type HighlightedVariant = HighlightedCode & {
  explanation: ExplanationStep[]
}

export type QueryDetail = Omit<QueryExample, 'variants'> & {
  categoryName: string
  variants: HighlightedVariant[]
}

export type QuerySummaryVariant = {
  dialects: Dialect[]
  code: string
  lineCount: number
  previewLines: CodeLine[]
}

export type QuerySummary = {
  slug: string
  title: string
  summary: string
  category: string
  categoryName: string
  difficulty: Difficulty
  tags: string[]
  popularity: number
  createdAt: string
  variants: QuerySummaryVariant[]
}

export type CategoryWithCount = Category & {
  count: number
}

export type QueryLink = {
  slug: string
  title: string
  categoryName: string
  difficulty: Difficulty
}

export type SortOption = 'relevance' | 'popular' | 'newest' | 'az'
