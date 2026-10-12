import { FileQuestionIcon } from 'lucide-react'
import Link from 'next/link'
import { EmptyState } from '@/components'
import { buttonVariants } from '@/components/ui/button'

const NotFound = () => {
  return (
    <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6">
      <EmptyState
        icon={FileQuestionIcon}
        headingLevel="h1"
        title="Halaman tidak ditemukan"
        description="Query atau halaman yang kamu cari tidak ada. Mungkin sudah dipindah, atau ada salah ketik di alamatnya."
      >
        <div className="flex flex-wrap justify-center gap-2">
          <Link href="/queries" className={buttonVariants({ variant: 'ink' })}>
            Jelajah query
          </Link>
          <Link href="/" className={buttonVariants({ variant: 'outline' })}>
            Ke beranda
          </Link>
        </div>
      </EmptyState>
    </div>
  )
}

export default NotFound
