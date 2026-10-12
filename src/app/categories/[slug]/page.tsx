import { ArrowRightIcon, FolderOpenIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { EmptyState, PageHeader, QueryCard } from '@/components'
import { buttonVariants } from '@/components/ui/button'
import { getCategories, getQuerySummaries } from '@/lib/content'
import { DIFFICULTY_RANK } from '@/lib/dialects'

export const generateStaticParams = async () => {
  const categories = await getCategories()
  return categories.map((category) => ({ slug: category.slug }))
}

export const generateMetadata = async ({
  params,
}: PageProps<'/categories/[slug]'>): Promise<Metadata> => {
  const { slug } = await params
  const category = (await getCategories()).find((item) => item.slug === slug)
  if (!category) return {}
  return {
    title: `Contoh query ${category.name}`,
    description: category.description,
    alternates: { canonical: `/categories/${category.slug}` },
  }
}

const CategoryPage = ({ params }: PageProps<'/categories/[slug]'>) => {
  // Konten bergantung pada URL; Suspense menjaga App Shell tetap bisa tampil seketika saat navigasi.
  return (
    <Suspense
      fallback={
        <div
          aria-busy="true"
          className="mx-auto flex max-w-[1240px] animate-pulse flex-col gap-4 px-4 pt-7 pb-16 sm:px-6"
        >
          <div className="h-4 w-48 rounded bg-muted" />
          <div className="h-10 w-72 rounded-lg bg-muted" />
          <div className="mt-4 h-64 rounded-xl bg-muted" />
        </div>
      }
    >
      <CategoryContent params={params} />
    </Suspense>
  )
}

export default CategoryPage

const CategoryContent = async ({
  params,
}: {
  params: PageProps<'/categories/[slug]'>['params']
}) => {
  const { slug } = await params
  const [categories, summaries] = await Promise.all([getCategories(), getQuerySummaries()])
  const category = categories.find((item) => item.slug === slug)
  if (!category) notFound()

  // Urut dari level termudah agar enak dibaca berurutan.
  const items = summaries
    .filter((item) => item.category === slug)
    .sort(
      (a, b) =>
        DIFFICULTY_RANK[a.difficulty] - DIFFICULTY_RANK[b.difficulty] ||
        a.title.localeCompare(b.title, 'id'),
    )

  return (
    <div className="mx-auto flex max-w-[1240px] flex-col gap-7 px-4 pt-7 pb-16 sm:px-6">
      <PageHeader
        breadcrumb={[
          { label: 'Beranda', href: '/' },
          { label: 'Kategori', href: '/categories' },
          { label: category.name },
        ]}
        title={category.name}
        description={category.description}
        actions={
          items.length > 0 ? (
            <Link
              href={`/queries?cat=${category.slug}`}
              className={buttonVariants({ variant: 'outline' })}
            >
              Cari &amp; filter di Jelajah
              <ArrowRightIcon aria-hidden />
            </Link>
          ) : undefined
        }
      />

      {items.length > 0 ? (
        <>
          <p className="text-[15px] font-semibold">{items.length} query</p>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {items.map((item) => (
              <QueryCard key={item.slug} item={item} headingLevel="h2" />
            ))}
          </div>
        </>
      ) : (
        <EmptyState
          icon={FolderOpenIcon}
          title="Contoh di kategori ini sedang disiapkan"
          description="Sementara itu, jelajahi kategori lain yang sudah tersedia."
        >
          <Link href="/categories" className={buttonVariants({ variant: 'ink' })}>
            Lihat semua kategori
          </Link>
        </EmptyState>
      )}
    </div>
  )
}
