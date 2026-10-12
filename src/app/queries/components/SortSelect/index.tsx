'use client'

import type { SortOption } from '@/types'
import { SORT_LABEL } from '../../helper'

type SortSelectProps = {
  id: string
  value: SortOption
  options: SortOption[]
  onChange: (value: SortOption) => void
}

export const SortSelect = ({ id, value, options, onChange }: SortSelectProps) => {
  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="hidden text-sm text-muted-foreground sm:inline">
        Urutkan
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value as SortOption)}
        aria-label="Urutkan hasil"
        className="h-11 cursor-pointer rounded-[10px] border border-input bg-card px-2.5 text-sm font-medium text-foreground"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {SORT_LABEL[option]}
          </option>
        ))}
      </select>
    </div>
  )
}
