'use client'

import { XIcon } from 'lucide-react'
import type { ActiveChip } from '../../hooks'

type ActiveFilterChipsProps = {
  chips: ActiveChip[]
}

export const ActiveFilterChips = ({ chips }: ActiveFilterChipsProps) => {
  if (!chips.length) return null
  return (
    <ul aria-label="Filter aktif" className="flex flex-wrap gap-1.5">
      {chips.map((chip) => (
        <li key={chip.key}>
          <button
            type="button"
            onClick={chip.onRemove}
            aria-label={`Hapus filter ${chip.label}`}
            className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 rounded-full border border-primary-soft-border bg-primary-soft pr-2 pl-3 text-[13px] font-medium text-primary-soft-foreground hover:opacity-80"
          >
            {chip.label}
            <XIcon className="size-3.5" aria-hidden />
          </button>
        </li>
      ))}
    </ul>
  )
}
