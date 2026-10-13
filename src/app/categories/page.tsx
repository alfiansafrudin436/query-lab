import type { Metadata } from 'next'
import { CategoryGrid, PageHeader } from '@/components'
import { getCategoriesWithCount } from '@/lib/content'

export const metadata: Metadata = {
  title: 'Kategori',
  description: 'Contoh query SQL dikelompokkan per topik, dari SELECT dasar sampai resep analitik.',
  alternates: { canonical: '/categories' },
}

const CategoriesPage = async () => {
  const categories = await getCategoriesWithCount()

  return (
    <div className="mx-auto flex max-w-[1240px] flex-col gap-7 px-4 pt-7 pb-16 sm:px-6">
      <PageHeader
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Kategori' }]}
        title="Kategori"
        description={`${categories.length} topik SQL, dari dasar SELECT sampai resep analitik.`}
      />
      <CategoryGrid categories={categories} headingLevel="h2" />
    </div>
  )
}

export default CategoriesPage
