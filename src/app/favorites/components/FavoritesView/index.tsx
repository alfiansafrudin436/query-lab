'use client'

import { StarIcon } from 'lucide-react'
import Link from 'next/link'
import { EmptyState, QueryCard } from '@/components'
import { buttonVariants } from '@/components/ui/button'
import type { QuerySummary } from '@/types'
import { useFavoritesPage } from '../../hooks'

type FavoritesViewProps = {
  items: QuerySummary[]
}

export const FavoritesView = ({ items }: FavoritesViewProps) => {
  const { hydrated, favorites } = useFavoritesPage(items)

  if (!hydrated) {
    return <div aria-busy="true" className="h-64 rounded-xl border border-dashed bg-card" />
  }

  if (!favorites.length) {
    return (
      <EmptyState
        icon={StarIcon}
        title="Belum ada favorit"
        description="Tekan ikon bintang di query mana pun untuk menyimpannya di sini."
      >
        <Link href="/queries" className={buttonVariants({ variant: 'ink' })}>
          Jelajah query
        </Link>
      </EmptyState>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <p className="text-[15px] font-semibold">{favorites.length} query tersimpan</p>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
        {favorites.map((item) => (
          <QueryCard key={item.slug} item={item} headingLevel="h2" />
        ))}
      </div>
    </div>
  )
}
