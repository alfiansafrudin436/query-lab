'use client'

import { useEffect, useRef, useState } from 'react'
import { useActiveVariant } from '@/hooks/use-active-variant'
import type { HighlightedVariant } from '@/types'

export const useQueryDetailPage = (variants: HighlightedVariant[]) => {
  const { variant, dialect, available, setDialect } = useActiveVariant(variants)
  const [activeStep, setActiveStep] = useState<number | null>(null)
  const [panelOutOfView, setPanelOutOfView] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  // Langkah aktif tetap valid walau jumlah langkah berbeda antar dialek.
  const step = activeStep !== null && activeStep < variant.explanation.length ? activeStep : null
  const highlight = step !== null ? variant.explanation[step].lines : null

  // Bar salin di mobile muncul setelah panel kode terlewat ke atas layar.
  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const observer = new IntersectionObserver(([entry]) => {
      setPanelOutOfView(!entry.isIntersecting && entry.boundingClientRect.top < 0)
    })
    observer.observe(panel)
    return () => observer.disconnect()
  }, [])

  const toggleStep = (index: number) => {
    setActiveStep((current) => (current === index ? null : index))
    // Pastikan baris yang disorot terlihat.
    const panel = panelRef.current
    if (panel && panel.getBoundingClientRect().top < 0) {
      panel.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }
  }

  return {
    variant,
    dialect,
    available,
    setDialect,
    step,
    toggleStep,
    highlight,
    panelRef,
    showStickyBar: panelOutOfView,
  }
}
