'use client'

import { useRef } from 'react'
import { DIALECT_LABEL, DIALECTS } from '@/lib/dialects'
import { cn } from '@/lib/utils'
import type { Dialect } from '@/types'

type DialectTabsProps = {
  available: Dialect[]
  value: Dialect
  onChange: (dialect: Dialect) => void
  tone?: 'dark' | 'light'
  /** Id elemen konten yang dikontrol tab (role="tabpanel"). */
  panelId?: string
  className?: string
}

const toneClassName = {
  dark: {
    list: '',
    active: 'bg-code-surface-active text-white',
    idle: 'text-code-subtle hover:bg-code-surface hover:text-white',
  },
  light: {
    list: 'rounded-xl border bg-card p-1',
    active: 'bg-ink text-ink-foreground',
    idle: 'text-muted-foreground hover:bg-muted hover:text-foreground',
  },
}

export const DialectTabs = ({
  available,
  value,
  onChange,
  tone = 'dark',
  panelId,
  className,
}: DialectTabsProps) => {
  const listRef = useRef<HTMLDivElement>(null)
  const enabled = DIALECTS.filter((dialect) => available.includes(dialect))

  const onKeyDown = (event: React.KeyboardEvent<HTMLButtonElement>) => {
    const index = enabled.indexOf(value)
    let next: Dialect | undefined
    if (event.key === 'ArrowRight') next = enabled[(index + 1) % enabled.length]
    if (event.key === 'ArrowLeft') next = enabled[(index - 1 + enabled.length) % enabled.length]
    if (event.key === 'Home') next = enabled[0]
    if (event.key === 'End') next = enabled.at(-1)
    if (!next) return
    event.preventDefault()
    onChange(next)
    listRef.current?.querySelector<HTMLButtonElement>(`[data-dialect="${next}"]`)?.focus()
  }

  return (
    <div
      ref={listRef}
      role="tablist"
      aria-label="Dialek database"
      className={cn('flex gap-1 overflow-x-auto', toneClassName[tone].list, className)}
    >
      {DIALECTS.map((dialect) => {
        const isAvailable = available.includes(dialect)
        const selected = dialect === value
        return (
          <button
            key={dialect}
            type="button"
            role="tab"
            data-dialect={dialect}
            aria-selected={selected}
            aria-controls={panelId}
            tabIndex={selected ? 0 : -1}
            disabled={!isAvailable}
            title={isAvailable ? undefined : `Belum tersedia untuk ${DIALECT_LABEL[dialect]}`}
            onClick={() => onChange(dialect)}
            onKeyDown={onKeyDown}
            className={cn(
              'h-10 shrink-0 cursor-pointer rounded-lg px-3.5 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40',
              selected ? toneClassName[tone].active : toneClassName[tone].idle,
            )}
          >
            {DIALECT_LABEL[dialect]}
          </button>
        )
      })}
    </div>
  )
}
