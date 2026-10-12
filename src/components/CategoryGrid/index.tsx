import Link from 'next/link'
import { cn } from '@/lib/utils'
import type { CategoryWithCount } from '@/types'

type CategoryGridProps = {
  categories: CategoryWithCount[]
  headingLevel?: 'h2' | 'h3'
  className?: string
}

export const CategoryGrid = ({ categories, headingLevel = 'h3', className }: CategoryGridProps) => {
  const Heading = headingLevel
  return (
    <ul className={cn('grid grid-cols-[repeat(auto-fill,minmax(220px,1fr))] gap-3', className)}>
      {categories.map((category) => {
        const content = (
          <>
            <span className="flex items-center justify-between gap-2">
              <span
                className={cn(
                  'rounded-md px-2 py-1 font-mono text-[12.5px] font-semibold',
                  category.count > 0
                    ? 'bg-primary-soft text-primary-soft-foreground'
                    : 'bg-muted text-subtle-foreground',
                )}
              >
                {category.keyword}
              </span>
              <span className="font-mono text-[12.5px] text-subtle-foreground">
                {category.count > 0 ? `${category.count} query` : 'Segera hadir'}
              </span>
            </span>
            <Heading className="text-base font-semibold tracking-[-0.01em]">
              {category.name}
            </Heading>
            <span className="text-[13.5px] leading-normal text-muted-foreground">
              {category.description}
            </span>
          </>
        )
        return (
          <li key={category.slug} className="flex">
            {category.count > 0 ? (
              <Link
                href={`/categories/${category.slug}`}
                className="flex flex-1 flex-col gap-2.5 rounded-xl border bg-card p-[18px] transition-colors hover:border-primary-soft-border hover:bg-primary-soft/40"
              >
                {content}
              </Link>
            ) : (
              <div className="flex flex-1 flex-col gap-2.5 rounded-xl border border-dashed bg-card/60 p-[18px] opacity-80">
                {content}
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}
