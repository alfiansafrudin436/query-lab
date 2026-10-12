'use client'

import { DIALECT_LABEL, DIALECTS } from '@/lib/dialects'
import { cn } from '@/lib/utils'
import type { Dialect } from '@/types'

type FilterOption<T extends string> = {
  value: T
  label: string
  count: number
  checked: boolean
}

type FilterPanelProps<C extends string, L extends string> = {
  idPrefix: string
  dialect: Dialect
  onDialectChange: (dialect: Dialect) => void
  categoryOptions: FilterOption<C>[]
  onToggleCategory: (value: C) => void
  levelOptions: FilterOption<L>[]
  onToggleLevel: (value: L) => void
}

export const FilterPanel = <C extends string, L extends string>({
  idPrefix,
  dialect,
  onDialectChange,
  categoryOptions,
  onToggleCategory,
  levelOptions,
  onToggleLevel,
}: FilterPanelProps<C, L>) => {
  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-1">
        <Legend>Dialek</Legend>
        {DIALECTS.map((item) => (
          <label
            key={item}
            className={cn(
              'flex min-h-11 cursor-pointer items-center gap-2.5 rounded-lg px-2 text-[14.5px]',
              item === dialect ? 'bg-primary-soft font-semibold' : 'hover:bg-muted',
            )}
          >
            <input
              type="radio"
              name={`${idPrefix}-dialect`}
              checked={item === dialect}
              onChange={() => onDialectChange(item)}
              className="size-4 accent-primary"
            />
            {DIALECT_LABEL[item]}
          </label>
        ))}
        <p className="px-2 pt-1 text-[12.5px] leading-normal text-subtle-foreground">
          Menentukan versi kode yang ditampilkan dan disalin.
        </p>
      </fieldset>

      <CheckboxGroup legend="Kategori" options={categoryOptions} onToggle={onToggleCategory} />
      <CheckboxGroup legend="Level" options={levelOptions} onToggle={onToggleLevel} />
    </div>
  )
}

const Legend = ({ children }: { children: React.ReactNode }) => {
  return (
    <legend className="pb-2 text-[12.5px] font-semibold tracking-[0.04em] text-subtle-foreground uppercase">
      {children}
    </legend>
  )
}

type CheckboxGroupProps<T extends string> = {
  legend: string
  options: FilterOption<T>[]
  onToggle: (value: T) => void
}

const CheckboxGroup = <T extends string>({ legend, options, onToggle }: CheckboxGroupProps<T>) => {
  return (
    <fieldset className="flex flex-col gap-0.5">
      <Legend>{legend}</Legend>
      {options.map((option) => {
        // Opsi tanpa hasil di-disable (bukan disembunyikan) agar layout tidak melompat.
        const disabled = option.count === 0 && !option.checked
        return (
          <label
            key={option.value}
            className={cn(
              'flex min-h-11 items-center gap-2.5 rounded-lg px-2 text-[14.5px]',
              disabled
                ? 'cursor-not-allowed text-subtle-foreground opacity-60'
                : 'cursor-pointer hover:bg-muted',
            )}
          >
            <input
              type="checkbox"
              checked={option.checked}
              disabled={disabled}
              onChange={() => onToggle(option.value)}
              className="size-4 accent-primary"
            />
            <span className="flex-1">{option.label}</span>
            <span className="font-mono text-[12.5px] text-subtle-foreground">{option.count}</span>
          </label>
        )
      })}
    </fieldset>
  )
}
