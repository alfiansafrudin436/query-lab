import { SearchIcon } from 'lucide-react'
import Form from 'next/form'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'

// Form GET biasa: tetap berfungsi tanpa JavaScript, navigasi client-side jika JS aktif.
export const HeroSearch = () => {
  return (
    <Form action="/queries" role="search" className="flex max-w-[600px] flex-wrap gap-2">
      <label htmlFor="home-search" className="sr-only">
        Cari query
      </label>
      <div className="flex h-14 flex-[1_1_260px] items-center gap-2.5 rounded-xl border border-input bg-card pr-3 pl-4 text-subtle-foreground focus-within:border-primary">
        <SearchIcon className="size-5 shrink-0" aria-hidden />
        <input
          id="home-search"
          name="q"
          type="search"
          autoComplete="off"
          placeholder="Cari: upsert, left join, running total…"
          className="h-full min-w-0 flex-1 bg-transparent text-base text-foreground outline-none placeholder:text-subtle-foreground"
        />
      </div>
      <button
        type="submit"
        className={cn(buttonVariants({ variant: 'ink', size: 'lg' }), 'h-14 px-6 text-base')}
      >
        Cari
      </button>
    </Form>
  )
}
