import Link from 'next/link'
import { LogoMark } from '@/components/Logo'
import { SITE_NAME } from '@/lib/site'

const LINK_GROUPS = [
  {
    title: 'Jelajah',
    links: [
      { href: '/queries', label: 'Semua query' },
      { href: '/categories', label: 'Kategori' },
      { href: '/schema', label: 'Skema contoh' },
      { href: '/favorites', label: 'Favorit' },
    ],
  },
  {
    title: 'Kategori populer',
    links: [
      { href: '/categories/join', label: 'JOIN' },
      { href: '/categories/window-function', label: 'Window Function' },
      { href: '/categories/dml', label: 'Manipulasi Data' },
    ],
  },
]

export const Footer = () => {
  return (
    <footer className="border-t bg-card">
      <div className="mx-auto flex max-w-[1240px] flex-wrap gap-x-16 gap-y-8 px-4 py-10 sm:px-6">
        <div className="flex flex-[1_1_280px] flex-col gap-2.5">
          <span className="inline-flex items-center gap-2.5 font-semibold">
            <LogoMark className="size-7 rounded-md" />
            {SITE_NAME}
          </span>
          <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
            Contoh query SQL yang dikurasi, dijelaskan, dan siap disalin.
          </p>
          <p className="text-[13px] text-subtle-foreground">
            Tekan <kbd className="rounded-[5px] border bg-muted px-1.5 font-mono text-xs">/</kbd>{' '}
            untuk mencari dari halaman mana pun.
          </p>
        </div>
        <nav aria-label="Footer" className="flex flex-wrap gap-x-16 gap-y-8">
          {LINK_GROUPS.map((group) => (
            <div key={group.title} className="flex flex-col gap-1">
              <h2 className="pb-1.5 text-[13px] font-semibold">{group.title}</h2>
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-1.5 text-sm text-muted-foreground hover:text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </footer>
  )
}
