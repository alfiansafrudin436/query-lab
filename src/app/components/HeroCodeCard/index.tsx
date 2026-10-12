import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { CodePanel } from '@/components'
import { DIFFICULTY_LABEL } from '@/lib/dialects'
import type { QueryDetail } from '@/types'

type HeroCodeCardProps = {
  query: QueryDetail
  className?: string
}

export const HeroCodeCard = ({ query, className }: HeroCodeCardProps) => {
  const variants = query.variants.map(({ dialects, code, lines, note }) => ({
    dialects,
    code,
    lines,
    note,
  }))

  return (
    <div className={className}>
      <CodePanel
        variants={variants}
        name={`query ${query.title}`}
        className="rounded-2xl shadow-[0_30px_60px_-30px_rgb(13_17_23/0.55)]"
        footer={
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-code-border px-4 py-3 text-[13px] text-code-muted">
            <span>
              {query.categoryName} · {DIFFICULTY_LABEL[query.difficulty]}
            </span>
            <Link
              href={`/queries/${query.slug}`}
              className="inline-flex min-h-9 items-center gap-1.5 font-medium text-code-link hover:underline"
            >
              Lihat penjelasan
              <ArrowRightIcon className="size-4" aria-hidden />
            </Link>
          </div>
        }
      />
    </div>
  )
}
