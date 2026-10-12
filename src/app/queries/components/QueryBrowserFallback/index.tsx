import { QueryCard } from '@/components'
import type { QuerySummary } from '@/types'

type QueryBrowserFallbackProps = {
  items: QuerySummary[]
}

// Tampilan awal sebelum parameter URL terbaca: daftar lengkap tanpa kontrol filter.
export const QueryBrowserFallback = ({ items }: QueryBrowserFallbackProps) => {
  const sorted = [...items].sort((a, b) => b.popularity - a.popularity)
  return (
    <div className="flex flex-col gap-6" aria-busy="true">
      <div className="h-14 rounded-xl border border-input bg-card" />
      <div className="grid gap-7 lg:grid-cols-[250px_minmax(0,1fr)]">
        <div className="hidden h-[420px] rounded-xl border bg-card lg:block" />
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
          {sorted.map((item) => (
            <QueryCard key={item.slug} item={item} />
          ))}
        </div>
      </div>
    </div>
  )
}
