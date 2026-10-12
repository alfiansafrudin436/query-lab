import type { Metadata } from 'next'
import { PageHeader } from '@/components'
import { getQuerySummaries } from '@/lib/content'
import { FavoritesView } from './components/FavoritesView'

export const metadata: Metadata = {
  title: 'Favorit',
  description: 'Query yang kamu simpan di perangkat ini.',
  robots: { index: false },
}

const FavoritesPage = async () => {
  const items = await getQuerySummaries()

  return (
    <div className="mx-auto flex max-w-[1240px] flex-col gap-7 px-4 pt-7 pb-16 sm:px-6">
      <PageHeader
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Favorit' }]}
        title="Favorit"
        description="Query yang kamu tandai bintang. Tersimpan di browser ini, tanpa perlu login."
      />
      <FavoritesView items={items} />
    </div>
  )
}

export default FavoritesPage
