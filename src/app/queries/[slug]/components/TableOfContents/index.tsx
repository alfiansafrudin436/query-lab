'use client'

import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type TableOfContentsProps = {
  items: { id: string; label: string }[]
}

export const TableOfContents = ({ items }: TableOfContentsProps) => {
  const [activeId, setActiveId] = useState(items[0]?.id)

  // Sorot bagian yang sedang dibaca.
  useEffect(() => {
    const sections = items
      .map((item) => document.getElementById(item.id))
      .filter((section): section is HTMLElement => Boolean(section))
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visible[0]) setActiveId(visible[0].target.id)
      },
      { rootMargin: '-96px 0px -60% 0px' },
    )
    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [items])

  return (
    <nav
      aria-labelledby="toc-title"
      className="flex flex-col gap-1 rounded-xl border bg-card p-[18px]"
    >
      <h2
        id="toc-title"
        className="mb-1.5 text-[12.5px] font-semibold tracking-[0.04em] text-subtle-foreground uppercase"
      >
        Di halaman ini
      </h2>
      {items.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          aria-current={activeId === item.id ? 'location' : undefined}
          className={cn(
            'rounded-lg px-2.5 py-2 text-[14.5px] transition-colors',
            activeId === item.id
              ? 'bg-primary-soft font-semibold text-primary-soft-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {item.label}
        </a>
      ))}
    </nav>
  )
}
