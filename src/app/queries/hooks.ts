'use client'

import { debounce, parseAsArrayOf, parseAsString, parseAsStringLiteral, useQueryStates } from 'nuqs'
import { useEffect, useMemo, useRef, useState } from 'react'
import { DIFFICULTIES } from '@/lib/content-schema'
import { DIALECT_LABEL, DIFFICULTY_LABEL } from '@/lib/dialects'
import { createSearchIndex, searchQueries, searchTerms } from '@/lib/search'
import { usePreferenceStore } from '@/store/preference-store'
import type { Category, Difficulty, QuerySummary, SortOption } from '@/types'
import { PAGE_SIZE, SORT_OPTIONS, countFacets, filterQueries, sortQueries } from './helper'

const searchParamsParsers = {
  q: parseAsString.withDefault(''),
  cat: parseAsArrayOf(parseAsString).withDefault([]),
  level: parseAsArrayOf(parseAsStringLiteral(DIFFICULTIES)).withDefault([]),
  sort: parseAsStringLiteral(SORT_OPTIONS),
}

export type ActiveChip = {
  key: string
  label: string
  onRemove: () => void
}

export const useQueriesPage = (items: QuerySummary[], categories: Category[]) => {
  const [params, setParams] = useQueryStates(searchParamsParsers, { history: 'replace' })
  const dialect = usePreferenceStore((state) => state.dialect)
  const setDialect = usePreferenceStore((state) => state.setDialect)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Link "Cari" di header mengarah ke /queries#cari → langsung fokus ke kolom cari.
  useEffect(() => {
    if (window.location.hash === '#cari') searchInputRef.current?.focus()
  }, [])

  const index = useMemo(() => createSearchIndex(items), [items])
  const query = params.q.trim()
  const matched = useMemo(() => (query ? searchQueries(index, query) : null), [index, query])

  const filters = useMemo(
    () => ({ categories: params.cat, levels: params.level }),
    [params.cat, params.level],
  )
  const sort: SortOption = params.sort ?? (matched ? 'relevance' : 'popular')
  const results = useMemo(
    () => sortQueries(filterQueries(items, matched, filters), sort, matched),
    [items, matched, filters, sort],
  )
  const facets = useMemo(() => countFacets(items, matched, filters), [items, matched, filters])

  // Batas "muat lebih banyak" di-reset otomatis setiap filter berubah.
  const filterKey = JSON.stringify([query, params.cat, params.level, sort])
  const [paging, setPaging] = useState({ key: filterKey, limit: PAGE_SIZE })
  const limit = paging.key === filterKey ? paging.limit : PAGE_SIZE
  const visible = results.slice(0, limit)

  const totals = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const item of items) counts[item.category] = (counts[item.category] ?? 0) + 1
    return counts
  }, [items])

  const categoryOptions = categories
    .filter((category) => totals[category.slug])
    .map((category) => ({
      value: category.slug,
      label: category.name,
      count: facets.categories[category.slug] ?? 0,
      checked: params.cat.includes(category.slug),
    }))

  const levelOptions = DIFFICULTIES.map((level) => ({
    value: level,
    label: DIFFICULTY_LABEL[level],
    count: facets.levels[level] ?? 0,
    checked: params.level.includes(level),
  }))

  const toggle = <T extends string>(list: T[], value: T): T[] | null => {
    const next = list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
    return next.length ? next : null
  }

  const actions = {
    setQuery: (value: string) =>
      setParams({ q: value || null }, { limitUrlUpdates: value ? debounce(300) : undefined }),
    clearQuery: () => {
      void setParams({ q: null })
      searchInputRef.current?.focus()
    },
    toggleCategory: (slug: string) => setParams({ cat: toggle(params.cat, slug) }),
    toggleLevel: (level: Difficulty) => setParams({ level: toggle(params.level, level) }),
    setSort: (value: SortOption) => setParams({ sort: value }),
    reset: () => setParams({ q: null, cat: null, level: null, sort: null }),
    loadMore: () => setPaging({ key: filterKey, limit: limit + PAGE_SIZE }),
  }

  const chips: ActiveChip[] = [
    ...(query ? [{ key: 'q', label: `“${query}”`, onRemove: actions.clearQuery }] : []),
    ...params.cat.map((slug) => ({
      key: `cat-${slug}`,
      label: categories.find((category) => category.slug === slug)?.name ?? slug,
      onRemove: () => actions.toggleCategory(slug),
    })),
    ...params.level.map((level) => ({
      key: `level-${level}`,
      label: DIFFICULTY_LABEL[level],
      onRemove: () => actions.toggleLevel(level),
    })),
  ]

  return {
    searchInputRef,
    query: params.q,
    terms: searchTerms(query),
    sort,
    sortOptions: SORT_OPTIONS.filter((option) => option !== 'relevance' || Boolean(matched)),
    dialect,
    dialectLabel: DIALECT_LABEL[dialect],
    setDialect,
    categoryOptions,
    levelOptions,
    chips,
    filterCount: params.cat.length + params.level.length,
    results,
    visible,
    remaining: results.length - visible.length,
    ...actions,
  }
}

export type QueriesPageState = ReturnType<typeof useQueriesPage>
