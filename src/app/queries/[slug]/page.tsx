import { ChevronDownIcon } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Suspense } from 'react'
import { Badge, Breadcrumb, Callout, DifficultyBadge, FavoriteButton } from '@/components'
import { getAllQueries, getQueryDetail, getQueryNeighbors } from '@/lib/content'
import { availableDialects, DIALECT_LABEL } from '@/lib/dialects'
import { SITE_NAME, SITE_URL } from '@/lib/site'
import { CopyLinkButton } from './components/CopyLinkButton'
import { PrevNextNav, RelatedQueries } from './components/QueryNavigation'
import { QueryWorkbench } from './components/QueryWorkbench'
import { SampleData } from './components/SampleData'
import { TableOfContents } from './components/TableOfContents'

export const generateStaticParams = async () => {
  const queries = await getAllQueries()
  return queries.map((query) => ({ slug: query.slug }))
}

export const generateMetadata = async ({
  params,
}: PageProps<'/queries/[slug]'>): Promise<Metadata> => {
  const { slug } = await params
  const query = await getQueryDetail(slug)
  if (!query) return {}
  const dialects = availableDialects(query.variants).map((dialect) => DIALECT_LABEL[dialect])
  return {
    title: query.title,
    description: `${query.summary} Contoh SQL untuk ${dialects.join(', ')}.`,
    keywords: query.tags,
    alternates: { canonical: `/queries/${query.slug}` },
    openGraph: {
      type: 'article',
      title: `${query.title} · ${SITE_NAME}`,
      description: query.summary,
    },
  }
}

const QueryDetailPage = ({ params }: PageProps<'/queries/[slug]'>) => {
  // Konten bergantung pada URL; Suspense menjaga App Shell tetap bisa tampil seketika saat navigasi.
  return (
    <Suspense fallback={<QueryDetailSkeleton />}>
      <QueryDetailContent params={params} />
    </Suspense>
  )
}

export default QueryDetailPage

const QueryDetailSkeleton = () => {
  return (
    <div
      aria-busy="true"
      className="mx-auto flex max-w-[1240px] animate-pulse flex-col gap-5 px-4 pt-7 pb-16 sm:px-6"
    >
      <div className="h-4 w-56 rounded bg-muted" />
      <div className="h-10 w-full max-w-xl rounded-lg bg-muted" />
      <div className="h-5 w-full max-w-2xl rounded bg-muted" />
      <div className="mt-4 h-72 rounded-[14px] bg-code-bg" />
    </div>
  )
}

const QueryDetailContent = async ({
  params,
}: {
  params: PageProps<'/queries/[slug]'>['params']
}) => {
  const { slug } = await params
  const [query, neighbors] = await Promise.all([getQueryDetail(slug), getQueryNeighbors(slug)])
  if (!query) notFound()

  const dialects = availableDialects(query.variants)
  const minVersions = dialects.filter((dialect) => query.minVersions[dialect])
  const toc = [
    { id: 'query', label: 'Query' },
    { id: 'penjelasan', label: 'Penjelasan' },
    ...(query.sample ? [{ id: 'contoh-data', label: 'Contoh data' }] : []),
    ...(query.notes.length ? [{ id: 'catatan', label: 'Catatan' }] : []),
    ...(neighbors.related.length ? [{ id: 'terkait', label: 'Query terkait' }] : []),
  ]
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'TechArticle',
        headline: query.title,
        description: query.summary,
        dateModified: query.updatedAt,
        datePublished: query.createdAt,
        inLanguage: 'id',
        keywords: query.tags.join(', '),
        url: `${SITE_URL}/queries/${query.slug}`,
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Beranda', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: query.categoryName,
            item: `${SITE_URL}/categories/${query.category}`,
          },
          { '@type': 'ListItem', position: 3, name: query.title },
        ],
      },
    ],
  }

  return (
    <div className="mx-auto flex max-w-[1240px] flex-col gap-7 px-4 pt-7 pb-28 sm:px-6 lg:pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      <header className="flex flex-col gap-3.5">
        <Breadcrumb
          items={[
            { label: 'Beranda', href: '/' },
            { label: query.categoryName, href: `/categories/${query.category}` },
            { label: query.title },
          ]}
        />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <h1 className="max-w-3xl flex-[1_1_480px] text-[28px] leading-[1.15] font-semibold tracking-[-0.03em] sm:text-[38px]">
            {query.title}
          </h1>
          <div className="flex gap-2">
            <FavoriteButton slug={query.slug} title={query.title} withLabel />
            <CopyLinkButton path={`/queries/${query.slug}`} />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge>{query.categoryName}</Badge>
          <DifficultyBadge difficulty={query.difficulty} />
          <span className="pl-1 text-[13.5px] text-muted-foreground">
            Tersedia untuk {dialects.map((dialect) => DIALECT_LABEL[dialect]).join(' · ')}
          </span>
        </div>
        <p className="max-w-[760px] text-base leading-relaxed text-muted-foreground sm:text-[17px]">
          <strong className="font-semibold text-foreground">Kapan dipakai:</strong>{' '}
          {query.whenToUse}
        </p>
      </header>

      <details className="group rounded-xl border bg-card lg:hidden">
        <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between px-4 font-semibold [&::-webkit-details-marker]:hidden">
          Di halaman ini
          <ChevronDownIcon
            className="size-[18px] transition-transform group-open:rotate-180"
            aria-hidden
          />
        </summary>
        <div className="flex flex-col px-2 pb-2">
          {toc.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="rounded-lg px-2.5 py-2.5 text-[14.5px] text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              {item.label}
            </a>
          ))}
        </div>
      </details>

      <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_260px]">
        <div className="flex min-w-0 flex-col gap-11">
          <QueryWorkbench slug={query.slug} title={query.title} variants={query.variants} />

          {query.sample && (
            <section
              id="contoh-data"
              aria-labelledby="contoh-data-heading"
              className="flex flex-col gap-3.5"
            >
              <h2 id="contoh-data-heading" className="text-2xl font-semibold tracking-[-0.02em]">
                Contoh data
              </h2>
              <SampleData sample={query.sample} />
            </section>
          )}

          {query.notes.length > 0 && (
            <section id="catatan" aria-labelledby="catatan-heading" className="flex flex-col gap-3">
              <h2 id="catatan-heading" className="text-2xl font-semibold tracking-[-0.02em]">
                Catatan
              </h2>
              {query.notes.map((note, index) => (
                <Callout key={index} type={note.type} title={note.title}>
                  {note.text}
                </Callout>
              ))}
            </section>
          )}

          {neighbors.related.length > 0 && (
            <section
              id="terkait"
              aria-labelledby="terkait-heading"
              className="flex flex-col gap-3.5"
            >
              <h2 id="terkait-heading" className="text-2xl font-semibold tracking-[-0.02em]">
                Query terkait
              </h2>
              <RelatedQueries items={neighbors.related} />
            </section>
          )}

          <PrevNextNav previous={neighbors.previous} next={neighbors.next} />
        </div>

        <aside aria-label="Navigasi halaman" className="hidden lg:block">
          <div className="sticky top-24 flex flex-col gap-4">
            <TableOfContents items={toc} />
            {minVersions.length > 0 && (
              <div className="flex flex-col gap-2.5 rounded-xl border bg-card p-[18px]">
                <h2 className="text-[12.5px] font-semibold tracking-[0.04em] text-subtle-foreground uppercase">
                  Versi minimum
                </h2>
                <dl className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-2 text-sm">
                  {minVersions.map((dialect) => (
                    <div key={dialect} className="contents">
                      <dt className="text-muted-foreground">{DIALECT_LABEL[dialect]}</dt>
                      <dd className="text-right font-mono">{query.minVersions[dialect]}+</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
            {query.tags.length > 0 && (
              <div className="flex flex-col gap-2.5 rounded-xl border bg-card p-[18px]">
                <h2 className="text-[12.5px] font-semibold tracking-[0.04em] text-subtle-foreground uppercase">
                  Tag
                </h2>
                <div className="flex flex-wrap gap-1.5">
                  {query.tags.map((tag) => (
                    <Link
                      key={tag}
                      href={`/queries?q=${encodeURIComponent(tag)}`}
                      className="rounded-md bg-muted px-2 py-1 font-mono text-[12.5px] font-medium text-muted-foreground hover:text-foreground"
                    >
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}
