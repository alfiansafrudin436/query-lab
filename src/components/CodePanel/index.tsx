'use client'

import { InfoIcon, WrapTextIcon } from 'lucide-react'
import { useId, useRef } from 'react'
import { CodeBlock } from '@/components/CodeBlock'
import { CopyButton } from '@/components/CopyButton'
import { DialectTabs } from '@/components/DialectTabs'
import { useActiveVariant } from '@/hooks/use-active-variant'
import { DIALECT_LABEL } from '@/lib/dialects'
import { cn } from '@/lib/utils'
import { usePreferenceStore } from '@/store/preference-store'
import type { Dialect, HighlightedCode } from '@/types'

type CodePanelProps = {
  variants: HighlightedCode[]
  /** Nama yang dibacakan screen reader pada tombol salin. */
  name: string
  /** Tampilkan tab dialek. Jika false, header menampilkan `title`. */
  showTabs?: boolean
  title?: string | ((dialect: Dialect) => string)
  highlight?: readonly [number, number] | null
  allowWrap?: boolean
  copyLabel?: string
  footer?: React.ReactNode
  showNote?: boolean
  bodyClassName?: string
  className?: string
  panelRef?: React.Ref<HTMLDivElement>
}

export const CodePanel = ({
  variants,
  name,
  showTabs = true,
  title,
  highlight,
  allowWrap = false,
  copyLabel = 'Salin',
  footer,
  showNote = true,
  bodyClassName,
  className,
  panelRef,
}: CodePanelProps) => {
  const { variant, dialect, available, setDialect } = useActiveVariant(variants)
  const wrapPreference = usePreferenceStore((state) => state.wrap)
  const toggleWrap = usePreferenceStore((state) => state.toggleWrap)
  const wrap = allowWrap && wrapPreference
  const codeRef = useRef<HTMLPreElement>(null)
  const panelId = useId()
  const heading = typeof title === 'function' ? title(dialect) : title

  // Fallback terakhir saat clipboard ditolak: blok kode diseleksi agar user cukup menekan Ctrl+C.
  const selectCode = () => {
    const code = codeRef.current?.querySelector('code')
    if (code) window.getSelection()?.selectAllChildren(code)
  }

  return (
    <div
      ref={panelRef}
      className={cn(
        'overflow-hidden rounded-[14px] border border-code-border bg-code-bg text-code-foreground',
        className,
      )}
    >
      <div className="flex flex-wrap items-center gap-2 border-b border-code-border p-2.5 pl-3">
        {showTabs ? (
          <DialectTabs
            available={available}
            value={dialect}
            onChange={setDialect}
            panelId={panelId}
            // Di layar sempit tab mendapat baris sendiri agar dialek aktif selalu terlihat.
            className="w-full sm:w-auto sm:flex-1"
          />
        ) : (
          <span className="min-w-0 flex-1 truncate px-1 font-mono text-[13px] text-code-muted">
            {heading}
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          {allowWrap && (
            <button
              type="button"
              onClick={toggleWrap}
              aria-pressed={wrap}
              className={cn(
                'inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border px-3 text-[13.5px] font-medium transition-colors',
                wrap
                  ? 'border-code-link text-white'
                  : 'border-code-surface-active text-code-subtle hover:text-white',
              )}
            >
              <WrapTextIcon className="size-4" aria-hidden />
              Wrap
            </button>
          )}
          <CopyButton
            text={variant.code}
            label={`Salin ${name} versi ${DIALECT_LABEL[dialect]}`}
            tone="dark"
            onError={selectCode}
          >
            {copyLabel}
          </CopyButton>
        </div>
      </div>
      <div
        id={panelId}
        role={showTabs ? 'tabpanel' : undefined}
        aria-label={showTabs ? `Kode ${DIALECT_LABEL[dialect]}` : undefined}
        className={cn(bodyClassName && 'overflow-y-auto', bodyClassName)}
      >
        <CodeBlock
          ref={codeRef}
          lines={variant.lines}
          highlight={highlight}
          wrap={wrap}
          tabIndex={0}
          aria-label={`Kode ${name}`}
        />
      </div>
      {footer ??
        (showNote && variant.note ? (
          <p className="flex items-start gap-2.5 border-t border-code-border px-4 py-3 text-[13.5px] leading-relaxed text-code-muted">
            <InfoIcon className="mt-0.5 size-4 shrink-0 text-code-link" aria-hidden />
            <span>{variant.note}</span>
          </p>
        ) : null)}
    </div>
  )
}
