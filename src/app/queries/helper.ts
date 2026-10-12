import type { Difficulty, QuerySummary, SortOption } from '@/types'

export const PAGE_SIZE = 24

export const SORT_OPTIONS = [
  'relevance',
  'popular',
  'newest',
  'az',
] as const satisfies readonly SortOption[]

export const SORT_LABEL: Record<SortOption, string> = {
  relevance: 'Paling relevan',
  popular: 'Populer',
  newest: 'Terbaru',
  az: 'A–Z',
}

export type QueryFilters = {
  categories: string[]
  levels: Difficulty[]
}

/**
 * Filter AND antar faset, OR di dalam satu faset.
 * `matched` = hasil pencarian (null jika tidak sedang mencari).
 * `ignore` dipakai saat menghitung jumlah per opsi di faset itu sendiri.
 */
export const filterQueries = (
  items: QuerySummary[],
  matched: string[] | null,
  filters: QueryFilters,
  ignore?: keyof QueryFilters,
): QuerySummary[] => {
  const matchedSet = matched ? new Set(matched) : null
  return items.filter(
    (item) =>
      (!matchedSet || matchedSet.has(item.slug)) &&
      (ignore === 'categories' ||
        !filters.categories.length ||
        filters.categories.includes(item.category)) &&
      (ignore === 'levels' || !filters.levels.length || filters.levels.includes(item.difficulty)),
  )
}

const countBy = <T>(items: T[], key: (item: T) => string): Record<string, number> => {
  const counts: Record<string, number> = {}
  for (const item of items) counts[key(item)] = (counts[key(item)] ?? 0) + 1
  return counts
}

export const countFacets = (
  items: QuerySummary[],
  matched: string[] | null,
  filters: QueryFilters,
) => {
  return {
    categories: countBy(
      filterQueries(items, matched, filters, 'categories'),
      (item) => item.category,
    ),
    levels: countBy(filterQueries(items, matched, filters, 'levels'), (item) => item.difficulty),
  }
}

const byPopularity = (a: QuerySummary, b: QuerySummary) =>
  b.popularity - a.popularity || a.title.localeCompare(b.title, 'id')

export const sortQueries = (
  items: QuerySummary[],
  sort: SortOption,
  relevance: string[] | null,
): QuerySummary[] => {
  const list = [...items]
  switch (sort) {
    case 'relevance': {
      if (!relevance) return list.sort(byPopularity)
      const rank = new Map(relevance.map((slug, index) => [slug, index]))
      return list.sort((a, b) => (rank.get(a.slug) ?? Infinity) - (rank.get(b.slug) ?? Infinity))
    }
    case 'popular':
      return list.sort(byPopularity)
    case 'newest':
      return list.sort(
        (a, b) => b.createdAt.localeCompare(a.createdAt) || a.title.localeCompare(b.title, 'id'),
      )
    case 'az':
      return list.sort((a, b) => a.title.localeCompare(b.title, 'id'))
  }
}
