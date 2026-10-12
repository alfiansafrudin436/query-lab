'use client'

import { SlidersHorizontalIcon } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { cn } from '@/lib/utils'
import type { QueriesPageState } from '../../hooks'
import { FilterPanel } from '../FilterPanel'

type FilterSheetProps = {
  state: QueriesPageState
  className?: string
}

export const FilterSheet = ({ state, className }: FilterSheetProps) => {
  return (
    <Sheet>
      <SheetTrigger className={cn(buttonVariants({ variant: 'outline' }), className)}>
        <SlidersHorizontalIcon aria-hidden />
        Filter
        {state.filterCount > 0 && (
          <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-xs leading-5 font-semibold text-primary-foreground">
            {state.filterCount}
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="bottom">
        <SheetHeader>
          <SheetTitle>Filter</SheetTitle>
          <SheetDescription>Hasil diperbarui langsung saat filter diubah.</SheetDescription>
        </SheetHeader>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pt-2 pb-5">
          <FilterPanel
            idPrefix="sheet"
            dialect={state.dialect}
            onDialectChange={state.setDialect}
            categoryOptions={state.categoryOptions}
            onToggleCategory={state.toggleCategory}
            levelOptions={state.levelOptions}
            onToggleLevel={state.toggleLevel}
          />
        </div>
        <SheetFooter>
          <button
            type="button"
            onClick={state.reset}
            className={cn(buttonVariants({ variant: 'outline', size: 'lg' }))}
          >
            Reset
          </button>
          <SheetClose className={cn(buttonVariants({ variant: 'primary', size: 'lg' }), 'flex-1')}>
            Tampilkan {state.results.length} hasil
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
