import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { DIFFICULTY_LABEL } from '@/lib/dialects'
import type { QueryLink } from '@/types'

export const RelatedQueries = ({ items }: { items: QueryLink[] }) => {
  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3">
      {items.map((item) => (
        <li key={item.slug} className="flex">
          <Link
            href={`/queries/${item.slug}`}
            prefetch
            className="flex flex-1 flex-col gap-2 rounded-[10px] border bg-card p-4 transition-colors hover:border-input"
          >
            <span className="text-[15px] leading-snug font-semibold">{item.title}</span>
            <span className="text-[13px] text-subtle-foreground">
              {item.categoryName} · {DIFFICULTY_LABEL[item.difficulty]}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  )
}

type PrevNextNavProps = {
  previous: QueryLink | null
  next: QueryLink | null
}

export const PrevNextNav = ({ previous, next }: PrevNextNavProps) => {
  if (!previous && !next) return null
  return (
    <nav aria-label="Query sebelumnya dan berikutnya" className="flex flex-wrap gap-3">
      {previous ? (
        <Link
          href={`/queries/${previous.slug}`}
          prefetch
          className="flex flex-[1_1_260px] flex-col gap-1 rounded-[10px] border bg-card p-4 transition-colors hover:border-input"
        >
          <span className="inline-flex items-center gap-1.5 text-[13px] text-subtle-foreground">
            <ArrowLeftIcon className="size-3.5" aria-hidden />
            Sebelumnya
          </span>
          <span className="text-[15.5px] font-semibold">{previous.title}</span>
        </Link>
      ) : (
        <span className="hidden flex-[1_1_260px] sm:block" />
      )}
      {next && (
        <Link
          href={`/queries/${next.slug}`}
          prefetch
          className="flex flex-[1_1_260px] flex-col items-end gap-1 rounded-[10px] border bg-card p-4 text-right transition-colors hover:border-input"
        >
          <span className="inline-flex items-center gap-1.5 text-[13px] text-subtle-foreground">
            Berikutnya
            <ArrowRightIcon className="size-3.5" aria-hidden />
          </span>
          <span className="text-[15.5px] font-semibold">{next.title}</span>
        </Link>
      )}
    </nav>
  )
}
