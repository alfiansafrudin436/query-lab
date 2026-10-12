'use client'

import { CopyButton, FavoriteButton } from '@/components'
import { DIALECT_LABEL } from '@/lib/dialects'
import { cn } from '@/lib/utils'
import type { Dialect } from '@/types'

type StickyCopyBarProps = {
  visible: boolean
  code: string
  dialect: Dialect
  slug: string
  title: string
}

// Hanya di layar kecil: aksi salin tetap di zona jempol setelah panel kode terlewat.
export const StickyCopyBar = ({ visible, code, dialect, slug, title }: StickyCopyBarProps) => {
  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        'fixed inset-x-0 bottom-0 z-30 flex gap-2.5 border-t bg-card px-4 pt-3 pb-[max(12px,env(safe-area-inset-bottom))] shadow-[0_-8px_24px_rgb(13_17_23/0.08)] transition-transform duration-200 lg:hidden',
        visible ? 'translate-y-0' : 'translate-y-full',
      )}
    >
      <CopyButton
        text={code}
        label={`Salin query ${title} versi ${DIALECT_LABEL[dialect]}`}
        tone="primary"
        size="lg"
        className="flex-1"
      >
        Salin query · {DIALECT_LABEL[dialect]}
      </CopyButton>
      <FavoriteButton slug={slug} title={title} size="lg" />
    </div>
  )
}
