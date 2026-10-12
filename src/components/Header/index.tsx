'use client'

import { MenuIcon, SearchIcon, StarIcon } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Logo } from '@/components/Logo'
import { focusSearchInput } from '@/components/SearchHotkey'
import { ThemeToggle } from '@/components/ThemeToggle'
import { buttonVariants } from '@/components/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'
import { useStoreHydrated } from '@/hooks/use-store-hydrated'
import { cn } from '@/lib/utils'
import { useFavoriteStore } from '@/store/favorite-store'

const NAV_ITEMS = [
  { href: '/queries', label: 'Jelajah' },
  { href: '/categories', label: 'Kategori' },
  { href: '/schema', label: 'Skema contoh' },
]

const isActive = (pathname: string, href: string) => {
  return pathname === href || pathname.startsWith(`${href}/`)
}

export const Header = () => {
  const pathname = usePathname()

  const onSearchClick = (event: React.MouseEvent<HTMLAnchorElement>) => {
    // Sudah di halaman Jelajah: cukup fokus ke kolom cari.
    if (focusSearchInput()) event.preventDefault()
  }

  return (
    <header className="sticky top-0 z-40 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/85">
      <div className="mx-auto flex h-16 max-w-[1240px] items-center gap-3 px-4 sm:px-6 lg:gap-7">
        <Logo />
        <nav aria-label="Utama" className="hidden items-center gap-1 md:flex">
          {NAV_ITEMS.map((item) => {
            const active = isActive(pathname, item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'rounded-lg px-3 py-2.5 text-[14.5px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                  active && 'bg-muted font-semibold text-foreground',
                )}
              >
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link
            href="/queries#cari"
            onClick={onSearchClick}
            className="mr-1 hidden h-11 w-[260px] items-center gap-2.5 rounded-[10px] border bg-background pr-2 pl-3 text-sm text-subtle-foreground transition-colors hover:border-input md:flex lg:w-[320px]"
          >
            <SearchIcon className="size-[18px]" aria-hidden />
            <span className="flex-1">Cari query…</span>
            <kbd className="rounded-[5px] border bg-card px-1.5 py-0.5 font-mono text-[11.5px] text-muted-foreground">
              /
            </kbd>
          </Link>
          <Link
            href="/queries#cari"
            onClick={onSearchClick}
            aria-label="Cari query"
            className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'md:hidden')}
          >
            <SearchIcon />
          </Link>
          <FavoritesLink active={isActive(pathname, '/favorites')} />
          <ThemeToggle />
          <MobileMenu pathname={pathname} />
        </div>
      </div>
    </header>
  )
}

type FavoritesLinkProps = {
  active: boolean
}

const FavoritesLink = ({ active }: FavoritesLinkProps) => {
  const count = useFavoriteStore((state) => state.slugs.length)
  const hydrated = useStoreHydrated(useFavoriteStore)
  const shownCount = hydrated ? count : 0

  return (
    <Link
      href="/favorites"
      aria-label={shownCount ? `Favorit (${shownCount})` : 'Favorit'}
      aria-current={active ? 'page' : undefined}
      className={cn(
        buttonVariants({ variant: 'ghost', size: 'icon' }),
        'relative',
        active && 'bg-muted',
      )}
    >
      <StarIcon />
      {shownCount > 0 && (
        <span className="absolute top-1.5 right-1 inline-flex min-w-[18px] items-center justify-center rounded-full bg-primary px-1 text-[11px] leading-[18px] font-semibold text-primary-foreground">
          {shownCount}
        </span>
      )}
    </Link>
  )
}

type MobileMenuProps = {
  pathname: string
}

const MobileMenu = ({ pathname }: MobileMenuProps) => {
  return (
    <Sheet>
      <SheetTrigger
        aria-label="Buka menu"
        className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'md:hidden')}
      >
        <MenuIcon />
      </SheetTrigger>
      <SheetContent side="right" aria-describedby={undefined}>
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <nav aria-label="Menu utama" className="flex flex-col gap-1 p-3">
          {[
            { href: '/', label: 'Beranda' },
            ...NAV_ITEMS,
            { href: '/favorites', label: 'Favorit' },
          ].map((item) => {
            const active = item.href === '/' ? pathname === '/' : isActive(pathname, item.href)
            return (
              <SheetClose asChild key={item.href}>
                <Link
                  href={item.href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'rounded-[10px] px-3 py-3 text-base font-medium text-muted-foreground hover:bg-muted hover:text-foreground',
                    active && 'bg-muted font-semibold text-foreground',
                  )}
                >
                  {item.label}
                </Link>
              </SheetClose>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
