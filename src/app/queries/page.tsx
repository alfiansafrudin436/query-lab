import type { Metadata } from 'next'
import { Suspense } from 'react'
import { PageHeader } from '@/components'
import { getCategories, getQuerySummaries } from '@/lib/content'
import { QueryBrowser } from './components/QueryBrowser'
import { QueryBrowserFallback } from './components/QueryBrowserFallback'

export const metadata: Metadata = {
  title: 'Jelajah query',
  description:
    'Cari contoh query SQL berdasarkan judul, tag, atau isi kode. Filter per kategori dan level, lalu salin dalam satu klik.',
  alternates: { canonical: '/queries' },
}

const QueriesPage = async () => {
  const [items, categories] = await Promise.all([getQuerySummaries(), getCategories()])

  return (
    <div className="mx-auto flex max-w-[1240px] flex-col gap-6 px-4 pt-7 pb-16 sm:px-6">
      <PageHeader
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Jelajah' }]}
        title="Jelajah query"
        description="Cari berdasarkan judul, tag, atau isi kode. Filter dan pencarian tersimpan di URL, jadi hasilnya bisa dibagikan."
      />
      {/* Parameter URL hanya ada di browser: bagian ini dirender di client. */}
      <Suspense fallback={<QueryBrowserFallback items={items} />}>
        <QueryBrowser items={items} categories={categories} />
      </Suspense>
    </div>
  )
}

export default QueriesPage
