'use client'

import { useSyncExternalStore } from 'react'

const subscribe = () => () => {}

// False saat render server dan hydration pertama, true setelahnya.
export const useIsClient = () => {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  )
}
