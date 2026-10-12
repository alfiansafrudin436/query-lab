'use client'

import { SearchIcon, XIcon } from 'lucide-react'
import { SEARCH_INPUT_ID } from '@/components/SearchHotkey'

type SearchBarProps = {
  value: string
  onChange: (value: string) => void
  onClear: () => void
  inputRef: React.Ref<HTMLInputElement>
}

export const SearchBar = ({ value, onChange, onClear, inputRef }: SearchBarProps) => {
  return (
    <div
      id="cari"
      role="search"
      className="flex h-12 items-center gap-2.5 rounded-xl border border-input bg-card pr-2 pl-4 text-subtle-foreground focus-within:border-primary sm:h-14"
    >
      <label htmlFor={SEARCH_INPUT_ID} className="sr-only">
        Cari query
      </label>
      <SearchIcon className="size-5 shrink-0" aria-hidden />
      <input
        ref={inputRef}
        id={SEARCH_INPUT_ID}
        type="search"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && value) {
            event.preventDefault()
            onClear()
          }
        }}
        autoComplete="off"
        spellCheck={false}
        placeholder="Cari: upsert, left join, running total…"
        className="h-full min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-subtle-foreground"
      />
      {value ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Hapus pencarian"
          className="inline-flex size-10 cursor-pointer items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-foreground"
        >
          <XIcon className="size-4" aria-hidden />
        </button>
      ) : (
        <kbd className="mr-1.5 hidden rounded-[5px] border bg-muted px-1.5 py-0.5 font-mono text-xs text-muted-foreground sm:inline">
          /
        </kbd>
      )}
    </div>
  )
}
