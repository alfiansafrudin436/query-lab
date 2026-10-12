import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { CategoryGrid, QueryCard } from '@/components'
import { getCategoriesWithCount, getQueryDetail, getQuerySummaries } from '@/lib/content'
import { HeroCodeCard } from './components/HeroCodeCard'
import { HeroSearch } from './components/HeroSearch'
import { HowItWorks } from './components/HowItWorks'
import { SchemaBanner } from './components/SchemaBanner'

const HERO_SLUG = 'upsert'
const POPULAR_SEARCHES = ['upsert', 'left join', 'running total', 'duplikat', 'pagination']

const HomePage = async () => {
  const [categories, summaries] = await Promise.all([getCategoriesWithCount(), getQuerySummaries()])
  const popular = [...summaries].sort((a, b) => b.popularity - a.popularity).slice(0, 3)
  const hero =
    (await getQueryDetail(HERO_SLUG)) ?? (popular[0] ? await getQueryDetail(popular[0].slug) : null)
  const filledCategories = categories.filter((category) => category.count > 0).length

  return (
    <>
      <section aria-labelledby="hero-title" className="border-b bg-card">
        <div className="mx-auto flex max-w-[1240px] flex-wrap items-center gap-12 px-4 pt-14 pb-14 sm:px-6 lg:pt-[72px] lg:pb-16">
          <div className="flex min-w-0 flex-[1_1_460px] flex-col gap-6">
            <p className="self-start rounded-full bg-primary-soft px-3 py-1.5 font-mono text-[13px] font-medium text-primary-soft-foreground">
              {summaries.length} contoh query · {filledCategories} kategori
            </p>
            <h1
              id="hero-title"
              className="text-[38px] leading-[1.08] font-semibold tracking-[-0.035em] sm:text-5xl lg:text-[52px]"
            >
              Contoh query SQL siap salin, lengkap dengan penjelasannya.
            </h1>
            <p className="max-w-xl text-[17px] leading-relaxed text-muted-foreground sm:text-lg">
              Cari pola yang kamu butuhkan, pilih dialek database, lalu salin dalam satu klik.
              Setiap contoh dijelaskan per klausa dan disertai contoh hasilnya.
            </p>
            <HeroSearch />
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm text-subtle-foreground">Populer:</span>
              {POPULAR_SEARCHES.map((term) => (
                <Link
                  key={term}
                  href={`/queries?q=${encodeURIComponent(term)}`}
                  className="inline-flex min-h-9 items-center rounded-full border bg-card px-3 font-mono text-[13px] font-medium text-muted-foreground transition-colors hover:border-input hover:text-foreground"
                >
                  {term}
                </Link>
              ))}
            </div>
          </div>
          {hero && <HeroCodeCard query={hero} className="min-w-0 flex-[1_1_460px]" />}
        </div>
      </section>

      <section aria-labelledby="kategori-title" className="px-4 pt-16 pb-6 sm:px-6">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-6">
          <SectionHeading
            id="kategori-title"
            title="Jelajahi per kategori"
            description="Dari SELECT dasar sampai resep analitik."
            href="/categories"
            linkLabel="Semua kategori"
          />
          <CategoryGrid categories={categories} />
        </div>
      </section>

      <section aria-labelledby="populer-title" className="px-4 pt-12 pb-6 sm:px-6">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-6">
          <SectionHeading
            id="populer-title"
            title="Query populer"
            description="Kode mengikuti dialek pilihanmu. Ganti dialek lewat tab di contoh atas."
            href="/queries"
            linkLabel="Jelajah semua"
          />
          <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-4">
            {popular.map((item) => (
              <QueryCard key={item.slug} item={item} />
            ))}
          </div>
        </div>
      </section>

      <HowItWorks />
      <SchemaBanner />
    </>
  )
}

export default HomePage

type SectionHeadingProps = {
  id: string
  title: string
  description: string
  href: string
  linkLabel: string
}

const SectionHeading = ({ id, title, description, href, linkLabel }: SectionHeadingProps) => {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="flex flex-col gap-1.5">
        <h2 id={id} className="text-[26px] font-semibold tracking-[-0.025em] sm:text-[28px]">
          {title}
        </h2>
        <p className="text-[15px] text-muted-foreground">{description}</p>
      </div>
      <Link
        href={href}
        className="inline-flex min-h-11 items-center gap-1.5 text-[15px] font-medium text-link hover:underline"
      >
        {linkLabel}
        <ArrowRightIcon className="size-4" aria-hidden />
      </Link>
    </div>
  )
}
