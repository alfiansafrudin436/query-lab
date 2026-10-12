'use client'

import Link from 'next/link'
import { Badge } from '@/components/Badge'
import { CodeBlock } from '@/components/CodeBlock'
import { CopyButton } from '@/components/CopyButton'
import { DifficultyBadge } from '@/components/DifficultyBadge'
import { FavoriteButton } from '@/components/FavoriteButton'
import { DIALECT_LABEL, pickVariant } from '@/lib/dialects'
import { highlightSegments } from '@/lib/search'
import { cn } from '@/lib/utils'
import { usePreferenceStore } from '@/store/preference-store'
import type { QuerySummary } from '@/types'

type QueryCardProps = {
  item: QuerySummary
  /** Kata pencarian yang disorot di judul. */
  terms?: string[]
  headingLevel?: 'h2' | 'h3'
  className?: string
}

const PREVIEW_LINES = 5

export const QueryCard = ({ item, terms = [], headingLevel = 'h3', className }: QueryCardProps) => {
  const preferred = usePreferenceStore((state) => state.dialect)
  const { variant, dialect } = pickVariant(item.variants, preferred)
  const Heading = headingLevel

  return (
    <article
      className={cn(
        'relative flex min-w-0 flex-col gap-3 rounded-xl border bg-card p-5 transition-colors focus-within:border-input hover:border-input',
        className,
      )}
    >
      <div className="flex flex-wrap gap-1.5">
        <Badge>{item.categoryName}</Badge>
        <DifficultyBadge difficulty={item.difficulty} />
      </div>
      <Heading className="text-[17px] leading-snug font-semibold tracking-[-0.01em]">
        <Link
          href={`/queries/${item.slug}`}
          prefetch
          className="outline-none after:absolute after:inset-0 after:rounded-xl after:content-[''] hover:text-link focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-ring"
        >
          {highlightSegments(item.title, terms).map((segment, index) =>
            segment.match ? (
              <mark key={index} className="rounded-[3px] bg-mark text-inherit">
                {segment.text}
              </mark>
            ) : (
              <span key={index}>{segment.text}</span>
            ),
          )}
        </Link>
      </Heading>
      <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">{item.summary}</p>
      <div aria-hidden className="relative h-[124px] overflow-hidden rounded-lg bg-code-bg">
        <CodeBlock size="sm" lines={variant.previewLines} className="overflow-hidden" />
        {variant.lineCount > PREVIEW_LINES && (
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-b from-transparent to-code-bg" />
        )}
        <div className="absolute inset-y-0 right-0 w-6 bg-gradient-to-r from-transparent to-code-bg" />
      </div>
      <div className="relative z-10 mt-auto flex items-center gap-2.5">
        <CopyButton
          text={variant.code}
          label={`Salin query ${item.title} versi ${DIALECT_LABEL[dialect]}`}
        />
        <span className="font-mono text-xs text-subtle-foreground">{DIALECT_LABEL[dialect]}</span>
        <FavoriteButton slug={item.slug} title={item.title} className="ml-auto" />
      </div>
    </article>
  )
}
