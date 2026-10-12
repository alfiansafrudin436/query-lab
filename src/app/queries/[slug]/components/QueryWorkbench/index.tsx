'use client'

import { CodePanel } from '@/components'
import type { HighlightedVariant } from '@/types'
import { useQueryDetailPage } from '../../hooks'
import { ExplanationSteps } from '../ExplanationSteps'
import { StickyCopyBar } from '../StickyCopyBar'

type QueryWorkbenchProps = {
  slug: string
  title: string
  variants: HighlightedVariant[]
}

// Bagian interaktif halaman detail: panel kode + penjelasan yang saling terhubung.
export const QueryWorkbench = ({ slug, title, variants }: QueryWorkbenchProps) => {
  const state = useQueryDetailPage(variants)

  return (
    <>
      <section id="query" aria-labelledby="query-heading" className="flex flex-col gap-3">
        <h2 id="query-heading" className="sr-only">
          Query
        </h2>
        <CodePanel
          panelRef={state.panelRef}
          variants={variants}
          name={`query ${title}`}
          highlight={state.highlight}
          allowWrap
          copyLabel="Salin query"
        />
      </section>

      <section
        id="penjelasan"
        aria-labelledby="penjelasan-heading"
        className="flex flex-col gap-3.5"
      >
        <div className="flex flex-col gap-1">
          <h2 id="penjelasan-heading" className="text-2xl font-semibold tracking-[-0.02em]">
            Penjelasan
          </h2>
          <p className="text-[14.5px] text-muted-foreground">
            Pilih satu langkah untuk menyorot baris kode yang dibahas.
          </p>
        </div>
        <ExplanationSteps
          steps={state.variant.explanation}
          activeStep={state.step}
          onToggle={state.toggleStep}
        />
      </section>

      <StickyCopyBar
        visible={state.showStickyBar}
        code={state.variant.code}
        dialect={state.dialect}
        slug={slug}
        title={title}
      />
    </>
  )
}
