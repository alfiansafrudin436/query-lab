import 'server-only'
import { cacheLife } from 'next/cache'
import { loadCategories, loadQueries } from '@/lib/content-loader'
import { DIALECTS, DIFFICULTY_RANK } from '@/lib/dialects'
import { highlightSql } from '@/lib/highlight'
import { buildDdl, buildSeed, POSTGRES_SEQUENCE_FIX } from '@/lib/sample-schema'
import type {
  Category,
  CategoryWithCount,
  HighlightedCode,
  QueryDetail,
  QueryExample,
  QueryLink,
  QuerySummary,
} from '@/types'

// Semua konten statis: di-cache permanen dan ikut ter-prerender saat build.

const PREVIEW_LINES = 5
const RELATED_LIMIT = 3

export const getCategories = async (): Promise<Category[]> => {
  'use cache'
  cacheLife('max')
  return loadCategories()
}

export const getAllQueries = async (): Promise<QueryExample[]> => {
  'use cache'
  cacheLife('max')
  return loadQueries()
}

export const getCategoriesWithCount = async (): Promise<CategoryWithCount[]> => {
  'use cache'
  cacheLife('max')
  const [categories, queries] = await Promise.all([getCategories(), getAllQueries()])
  return categories.map((category) => ({
    ...category,
    count: queries.filter((query) => query.category === category.slug).length,
  }))
}

export const getQuerySummaries = async (): Promise<QuerySummary[]> => {
  'use cache'
  cacheLife('max')
  const [categories, queries] = await Promise.all([getCategories(), getAllQueries()])
  const names = new Map(categories.map((category) => [category.slug, category.name]))

  return Promise.all(
    queries.map(async (query) => ({
      slug: query.slug,
      title: query.title,
      summary: query.summary,
      category: query.category,
      categoryName: names.get(query.category) ?? query.category,
      difficulty: query.difficulty,
      tags: query.tags,
      popularity: query.popularity,
      createdAt: query.createdAt,
      variants: await Promise.all(
        query.variants.map(async (variant) => {
          const lines = await highlightSql(variant.code)
          return {
            dialects: variant.dialects,
            code: variant.code,
            lineCount: lines.length,
            previewLines: lines.slice(0, PREVIEW_LINES),
          }
        }),
      ),
    })),
  )
}

export const getQueryDetail = async (slug: string): Promise<QueryDetail | null> => {
  'use cache'
  cacheLife('max')
  const [categories, queries] = await Promise.all([getCategories(), getAllQueries()])
  const query = queries.find((item) => item.slug === slug)
  if (!query) return null

  return {
    ...query,
    categoryName: categories.find((category) => category.slug === query.category)?.name ?? '',
    variants: await Promise.all(
      query.variants.map(async (variant) => ({
        ...variant,
        lines: await highlightSql(variant.code),
      })),
    ),
  }
}

export const getQueryNeighbors = async (
  slug: string,
): Promise<{
  previous: QueryLink | null
  next: QueryLink | null
  related: QueryLink[]
}> => {
  'use cache'
  cacheLife('max')
  const [categories, queries] = await Promise.all([getCategories(), getAllQueries()])
  const names = new Map(categories.map((category) => [category.slug, category.name]))
  const toLink = (query: QueryExample): QueryLink => ({
    slug: query.slug,
    title: query.title,
    categoryName: names.get(query.category) ?? query.category,
    difficulty: query.difficulty,
  })

  const current = queries.find((query) => query.slug === slug)
  if (!current) return { previous: null, next: null, related: [] }

  // Urutan belajar di dalam kategori: dari level termudah, lalu judul.
  const siblings = queries
    .filter((query) => query.category === current.category)
    .sort(
      (a, b) =>
        DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty] ||
        a.title.localeCompare(b.title, 'id'),
    )
  const position = siblings.findIndex((query) => query.slug === slug)

  const related = current.related
    .map((relatedSlug) => queries.find((query) => query.slug === relatedSlug))
    .filter((query): query is QueryExample => Boolean(query))
  for (const sibling of siblings) {
    if (related.length >= RELATED_LIMIT) break
    if (sibling.slug !== slug && !related.includes(sibling)) related.push(sibling)
  }

  return {
    previous: position > 0 ? toLink(siblings[position - 1]) : null,
    next: position < siblings.length - 1 ? toLink(siblings[position + 1]) : null,
    related: related.slice(0, RELATED_LIMIT).map(toLink),
  }
}

export const getSampleSchemaCode = async (): Promise<{
  ddl: HighlightedCode[]
  seed: HighlightedCode[]
  sequenceFix: HighlightedCode
}> => {
  'use cache'
  cacheLife('max')
  const highlight = async (dialects: HighlightedCode['dialects'], code: string) => ({
    dialects,
    code,
    lines: await highlightSql(code),
  })

  return {
    ddl: await Promise.all(DIALECTS.map((dialect) => highlight([dialect], buildDdl(dialect)))),
    seed: await Promise.all(DIALECTS.map((dialect) => highlight([dialect], buildSeed(dialect)))),
    sequenceFix: await highlight(['postgresql'], POSTGRES_SEQUENCE_FIX),
  }
}
