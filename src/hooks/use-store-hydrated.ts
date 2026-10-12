'use client'

import { useCallback, useSyncExternalStore } from 'react'

type PersistApi = {
  hasHydrated: () => boolean
  onFinishHydration: (listener: () => void) => () => void
}

// Di server tidak ada localStorage, sehingga Zustand tidak memasang API `persist`.
type PersistedStore = {
  persist?: PersistApi
}

// True setelah store Zustand `persist` selesai membaca localStorage.
export const useStoreHydrated = (store: PersistedStore) => {
  const subscribe = useCallback(
    (listener: () => void) => store.persist?.onFinishHydration(listener) ?? (() => {}),
    [store],
  )
  const getSnapshot = useCallback(() => store.persist?.hasHydrated() ?? false, [store])
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
