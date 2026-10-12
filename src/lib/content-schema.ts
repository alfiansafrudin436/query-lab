import { z } from 'zod'

export const DIALECTS = ['postgresql', 'mysql', 'sqlite'] as const
export const DIFFICULTIES = ['beginner', 'intermediate', 'advanced'] as const

export const dialectSchema = z.enum(DIALECTS)
export const difficultySchema = z.enum(DIFFICULTIES)

const isoDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Format tanggal harus YYYY-MM-DD')

const lineRangeSchema = z
  .tuple([z.number().int().positive(), z.number().int().positive()])
  .refine(([from, to]) => from <= to, 'Rentang baris tidak valid (awal > akhir)')

export const explanationStepSchema = z.strictObject({
  lines: lineRangeSchema,
  clause: z.string().min(1),
  text: z.string().min(1),
})

export const queryVariantSchema = z.strictObject({
  dialects: z.array(dialectSchema).min(1),
  code: z.string().min(1),
  note: z.string().optional(),
  explanation: z.array(explanationStepSchema).min(1),
})

const cellSchema = z.union([z.string(), z.number(), z.null()])

export const sampleTableSchema = z.strictObject({
  caption: z.string().min(1),
  columns: z.array(z.string()).min(1),
  rows: z.array(z.array(cellSchema)),
  highlight: z
    .array(z.tuple([z.number().int().nonnegative(), z.number().int().nonnegative()]))
    .default([]),
})

export const querySampleSchema = z.strictObject({
  description: z.string().optional(),
  highlightNote: z.string().optional(),
  input: z.array(sampleTableSchema).default([]),
  output: sampleTableSchema,
})

export const queryNoteSchema = z.strictObject({
  type: z.enum(['tip', 'warning', 'info']),
  title: z.string().optional(),
  text: z.string().min(1),
})

export const queryFileSchema = z.strictObject({
  title: z.string().min(1).max(70),
  summary: z.string().min(1).max(160),
  whenToUse: z.string().min(1),
  difficulty: difficultySchema,
  tags: z.array(z.string()).default([]),
  popularity: z.number().int().nonnegative().default(0),
  createdAt: isoDateSchema,
  updatedAt: isoDateSchema,
  minVersions: z.partialRecord(dialectSchema, z.string()).default({}),
  related: z.array(z.string()).default([]),
  variants: z.array(queryVariantSchema).min(1),
  sample: querySampleSchema.optional(),
  notes: z.array(queryNoteSchema).default([]),
})

export const categorySchema = z.strictObject({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  name: z.string().min(1),
  keyword: z.string().min(1),
  description: z.string().min(1),
})

export const categoriesFileSchema = z.array(categorySchema).min(1)
