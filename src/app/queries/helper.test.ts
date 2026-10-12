import { describe, expect, it } from 'vitest'
import type { QuerySummary } from '@/types'
import { countFacets, filterQueries, sortQueries } from './helper'

const item = (overrides: Partial<QuerySummary>): QuerySummary => {
  return {
    slug: 'x',
    title: 'X',
    summary: '',
    category: 'join',
    categoryName: 'JOIN',
    difficulty: 'beginner',
    tags: [],
    popularity: 0,
    createdAt: '2026-01-01',
    variants: [],
    ...overrides,
  }
}

const items = [
  item({
    slug: 'left',
    title: 'LEFT JOIN',
    category: 'join',
    difficulty: 'beginner',
    popularity: 10,
    createdAt: '2026-08-01',
  }),
  item({
    slug: 'anti',
    title: 'Anti join',
    category: 'join',
    difficulty: 'intermediate',
    popularity: 6,
    createdAt: '2026-09-01',
  }),
  item({
    slug: 'upsert',
    title: 'UPSERT',
    category: 'dml',
    difficulty: 'intermediate',
    popularity: 11,
    createdAt: '2026-07-01',
  }),
  item({
    slug: 'dedupe',
    title: 'Hapus duplikat',
    category: 'dml',
    difficulty: 'advanced',
    popularity: 8,
    createdAt: '2026-10-01',
  }),
]

const noFilters = { categories: [], levels: [] }

describe('filterQueries', () => {
  it('OR di dalam satu faset, AND antar faset', () => {
    const result = filterQueries(items, null, {
      categories: ['join', 'dml'],
      levels: ['intermediate'],
    })
    expect(result.map((query) => query.slug)).toEqual(['anti', 'upsert'])
  })

  it('hanya menyisakan hasil pencarian', () => {
    expect(filterQueries(items, ['upsert'], noFilters).map((query) => query.slug)).toEqual([
      'upsert',
    ])
  })
})

describe('countFacets', () => {
  it('jumlah per kategori tidak terpengaruh filter kategori itu sendiri', () => {
    const facets = countFacets(items, null, { categories: ['join'], levels: ['intermediate'] })
    expect(facets.categories).toEqual({ join: 1, dml: 1 })
    expect(facets.levels).toEqual({ beginner: 1, intermediate: 1 })
  })
})

describe('sortQueries', () => {
  it('populer: popularity tertinggi lebih dulu', () => {
    expect(sortQueries(items, 'popular', null).map((query) => query.slug)).toEqual([
      'upsert',
      'left',
      'dedupe',
      'anti',
    ])
  })

  it('terbaru: createdAt terbaru lebih dulu', () => {
    expect(sortQueries(items, 'newest', null)[0].slug).toBe('dedupe')
  })

  it('relevansi mengikuti urutan hasil pencarian', () => {
    expect(
      sortQueries(items, 'relevance', ['anti', 'left'])
        .map((query) => query.slug)
        .slice(0, 2),
    ).toEqual(['anti', 'left'])
  })
})
