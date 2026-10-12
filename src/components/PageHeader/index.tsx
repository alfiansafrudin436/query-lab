import Link from 'next/link'
import { Fragment } from 'react'
import { cn } from '@/lib/utils'

export type BreadcrumbItem = {
  label: string
  href?: string
}

type PageHeaderProps = {
  breadcrumb: BreadcrumbItem[]
  title: string
  description?: React.ReactNode
  actions?: React.ReactNode
  className?: string
}

export const Breadcrumb = ({ items }: { items: BreadcrumbItem[] }) => {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-[13.5px] text-subtle-foreground">
        {items.map((item, index) => (
          <Fragment key={`${item.label}-${index}`}>
            {index > 0 && <li aria-hidden>/</li>}
            <li>
              {item.href ? (
                <Link href={item.href} className="text-muted-foreground hover:text-foreground">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-foreground">
                  {item.label}
                </span>
              )}
            </li>
          </Fragment>
        ))}
      </ol>
    </nav>
  )
}

export const PageHeader = ({
  breadcrumb,
  title,
  description,
  actions,
  className,
}: PageHeaderProps) => {
  return (
    <div className={cn('flex flex-col gap-3', className)}>
      <Breadcrumb items={breadcrumb} />
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="flex max-w-3xl flex-[1_1_480px] flex-col gap-2">
          <h1 className="text-[30px] leading-tight font-semibold tracking-[-0.03em] sm:text-[34px]">
            {title}
          </h1>
          {description && (
            <p className="text-[15.5px] leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>
        {actions}
      </div>
    </div>
  )
}
