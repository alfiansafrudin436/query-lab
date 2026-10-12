'use client'

import { ThemeProvider } from 'next-themes'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { useEffect } from 'react'
import { useFavoriteStore } from '@/store/favorite-store'
import { usePreferenceStore } from '@/store/preference-store'

type ProvidersProps = {
  children: React.ReactNode
}

export const Providers = ({ children }: ProvidersProps) => {
  useEffect(() => {
    void usePreferenceStore.persist.rehydrate()
    void useFavoriteStore.persist.rehydrate()
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <NuqsAdapter>{children}</NuqsAdapter>
    </ThemeProvider>
  )
}
