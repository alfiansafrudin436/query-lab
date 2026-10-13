'use client'

import { TriangleAlertIcon } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'
import { EmptyState } from '@/components'
import { Button, buttonVariants } from '@/components/ui/button'

type ErrorPageProps = {
  error: Error & { digest?: string }
  retry: () => void
}

const ErrorPage = ({ error, retry }: ErrorPageProps) => {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="mx-auto max-w-[1240px] px-4 py-16 sm:px-6">
      <EmptyState
        icon={TriangleAlertIcon}
        headingLevel="h1"
        title="Ada yang salah di halaman ini"
        description="Halamannya gagal dimuat. Biasanya ini sementara, jadi coba muat ulang dulu."
      >
        <div className="flex flex-wrap justify-center gap-2">
          <Button variant="ink" onClick={() => retry()}>
            Coba lagi
          </Button>
          <Link href="/queries" className={buttonVariants({ variant: 'outline' })}>
            Jelajah query
          </Link>
        </div>
        {error.digest && (
          <p className="text-[13px] text-subtle-foreground">
            Kode error: <code className="font-mono">{error.digest}</code>
          </p>
        )}
      </EmptyState>
    </div>
  )
}

export default ErrorPage
