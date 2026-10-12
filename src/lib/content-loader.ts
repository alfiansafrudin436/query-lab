import { readdir, readFile } from 'node:fs/promises'
import path from 'node:path'
import { parse } from 'yaml'
import { categoriesFileSchema, queryFileSchema } from '@/lib/content-schema'
import type { Category, Dialect, QueryExample } from '@/types'

// Loader murni (tanpa API Next.js) supaya bisa dipakai di build dan di test.

export const CONTENT_DIR = path.join(process.cwd(), 'content')

const SLUG_PATTERN = /^[a-z0-9-]+$/

export class ContentError extends Error {
  constructor(file: string, message: string) {
    super(`[content] ${file}: ${message}`)
    this.name = 'ContentError'
  }
}

export const loadCategories = async (dir = CONTENT_DIR): Promise<Category[]> => {
  const file = path.join(dir, 'categories.yaml')
  const result = categoriesFileSchema.safeParse(parse(await readFile(file, 'utf8')))
  if (!result.success) {
    throw new ContentError('categories.yaml', result.error.message)
  }
  const slugs = new Set<string>()
  for (const category of result.data) {
    if (slugs.has(category.slug)) {
      throw new ContentError('categories.yaml', `slug kategori "${category.slug}" duplikat`)
    }
    slugs.add(category.slug)
  }
  return result.data
}

export const loadQueries = async (dir = CONTENT_DIR): Promise<QueryExample[]> => {
  const categories = await loadCategories(dir)
  const categorySlugs = new Set(categories.map((category) => category.slug))
  const queriesDir = path.join(dir, 'queries')
  const queries: QueryExample[] = []

  for (const categoryDir of await readdir(queriesDir, { withFileTypes: true })) {
    if (!categoryDir.isDirectory()) continue
    const category = categoryDir.name
    if (!categorySlugs.has(category)) {
      throw new ContentError(`queries/${category}`, 'folder tidak terdaftar di categories.yaml')
    }

    const files = await readdir(path.join(queriesDir, category))
    for (const fileName of files.filter((name) => name.endsWith('.yaml'))) {
      const relative = `queries/${category}/${fileName}`
      const slug = fileName.replace(/\.yaml$/, '')
      if (!SLUG_PATTERN.test(slug)) {
        throw new ContentError(relative, 'nama file harus huruf kecil, angka, dan tanda hubung')
      }
      const raw = parse(await readFile(path.join(queriesDir, category, fileName), 'utf8'))
      const result = queryFileSchema.safeParse(raw)
      if (!result.success) {
        throw new ContentError(relative, result.error.message)
      }
      const query: QueryExample = {
        ...result.data,
        slug,
        category,
        variants: result.data.variants.map((variant) => ({
          ...variant,
          code: variant.code.replace(/\s+$/, ''),
        })),
      }
      validateQuery(relative, query)
      queries.push(query)
    }
  }

  validateCrossReferences(queries)
  return queries.sort((a, b) => a.slug.localeCompare(b.slug))
}

const validateQuery = (file: string, query: QueryExample) => {
  const seen = new Set<Dialect>()
  for (const variant of query.variants) {
    for (const dialect of variant.dialects) {
      if (seen.has(dialect)) {
        throw new ContentError(file, `dialek "${dialect}" muncul di lebih dari satu varian`)
      }
      seen.add(dialect)
    }
    const lineCount = variant.code.split('\n').length
    for (const step of variant.explanation) {
      if (step.lines[1] > lineCount) {
        throw new ContentError(
          file,
          `penjelasan "${step.clause}" merujuk baris ${step.lines[1]}, padahal kode hanya ${lineCount} baris`,
        )
      }
    }
  }

  const tables = query.sample ? [...query.sample.input, query.sample.output] : []
  for (const table of tables) {
    for (const row of table.rows) {
      if (row.length !== table.columns.length) {
        throw new ContentError(file, `baris di tabel "${table.caption}" tidak sesuai jumlah kolom`)
      }
    }
    for (const [row, column] of table.highlight) {
      if (row >= table.rows.length || column >= table.columns.length) {
        throw new ContentError(
          file,
          `highlight [${row}, ${column}] di luar tabel "${table.caption}"`,
        )
      }
    }
  }
}

const validateCrossReferences = (queries: QueryExample[]) => {
  const slugs = new Set<string>()
  for (const query of queries) {
    if (slugs.has(query.slug)) {
      throw new ContentError(query.slug, 'slug query duplikat di folder kategori lain')
    }
    slugs.add(query.slug)
  }
  for (const query of queries) {
    for (const related of query.related) {
      if (!slugs.has(related)) {
        throw new ContentError(query.slug, `related "${related}" tidak ditemukan`)
      }
    }
  }
}
