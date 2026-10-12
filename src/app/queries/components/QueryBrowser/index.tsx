'use client'

import { SearchXIcon } from 'lucide-react'
import { EmptyState, QueryCard } from '@/components'
import { Button } from '@/components/ui/button'
import type { Category, QuerySummary } from '@/types'
import { useQueriesPage } from '../../hooks'
import { ActiveFilterChips } from '../ActiveFilterChips'
import { FilterPanel } from '../FilterPanel'
import { FilterSheet } from '../FilterSheet'
import { SearchBar } from '../SearchBar'
import { SortSelect } from '../SortSelect'

type QueryBrowserProps = {
  items: QuerySummary[]
  categories: Category[]
}

const SUGGESTIONS = ['upsert', 'join', 'running total']

export const QueryBrowser = ({ items, categories }: QueryBrowserProps) => {
  const state = useQueriesPage(items, categories)
  const hasResults = state.results.length > 0

  return (
    <div className="flex flex-col gap-6">
      {/* Di mobile kolom cari menempel di bawah header saat scroll. */}
      <div className="sticky top-16 z-20 -mx-4 flex flex-col gap-2.5 border-b bg-background/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <SearchBar
          value={state.query}
          onChange={state.setQuery}
          onClear={state.clearQuery}
          inputRef={state.searchInputRef}
        />
        <div className="flex items-center gap-2 lg:hidden">
          <FilterSheet state={state} />
          <div className="ml-auto">
            <SortSelect
              id="sort-mobile"
              value={state.sort}
              options={state.sortOptions}
              onChange={state.setSort}
            />
          </div>
        </div>
      </div>

      <div className="grid items-start gap-7 lg:grid-cols-[250px_minmax(0,1fr)]">
        <aside
          aria-label="Filter"
          className="hidden flex-col gap-5 rounded-xl border bg-card p-5 lg:sticky lg:top-24 lg:flex"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-semibold">Filter</h2>
            {state.chips.length > 0 && (
              <button
                type="button"
                onClick={state.reset}
                className="min-h-9 cursor-pointer px-2 text-sm font-medium text-link hover:underline"
              >
                Reset
              </button>
            )}
          </div>
          <FilterPanel
            idPrefix="sidebar"
            dialect={state.dialect}
            onDialectChange={state.setDialect}
            categoryOptions={state.categoryOptions}
            onToggleCategory={state.toggleCategory}
            levelOptions={state.levelOptions}
            onToggleLevel={state.toggleLevel}
          />
        </aside>

        <section aria-label="Hasil" className="flex min-w-0 flex-col gap-4">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2.5">
            <p className="text-[15px] font-semibold" aria-live="polite">
              {state.results.length} query
              <span className="sr-only"> ditemukan</span>
            </p>
            <div className="min-w-0 flex-1">
              <ActiveFilterChips chips={state.chips} />
            </div>
            <div className="hidden lg:block">
              <SortSelect
                id="sort-desktop"
                value={state.sort}
                options={state.sortOptions}
                onChange={state.setSort}
              />
            </div>
          </div>

          {hasResults ? (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                {state.visible.map((item) => (
                  <QueryCard key={item.slug} item={item} terms={state.terms} headingLevel="h2" />
                ))}
              </div>
              {state.remaining > 0 && (
                <div className="flex justify-center pt-2">
                  <Button size="lg" onClick={state.loadMore}>
                    Muat lebih banyak ({state.remaining} lagi)
                  </Button>
                </div>
              )}
            </>
          ) : (
            <EmptyState
              icon={SearchXIcon}
              title={
                state.query
                  ? `Tidak ada hasil untuk “${state.query}”`
                  : 'Tidak ada query yang cocok'
              }
              description="Coba kata kunci lain atau hapus beberapa filter. Kamu juga bisa mencoba salah satu pencarian berikut."
            >
              <div className="flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    type="button"
                    onClick={() => {
                      state.reset()
                      state.setQuery(suggestion)
                    }}
                    className="min-h-9 cursor-pointer rounded-full border bg-card px-3 font-mono text-[13px] font-medium text-muted-foreground hover:border-input hover:text-foreground"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
              <Button variant="ink" onClick={state.reset}>
                Reset semua filter
              </Button>
            </EmptyState>
          )}
        </section>
      </div>
    </div>
  )
}
