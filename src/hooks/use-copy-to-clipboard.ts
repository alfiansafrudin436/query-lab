'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { copyText } from '@/lib/clipboard'

export type CopyStatus = 'idle' | 'copied' | 'error'

export const useCopyToClipboard = (resetMs = 2000) => {
  const [status, setStatus] = useState<CopyStatus>('idle')
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined)

  useEffect(() => () => clearTimeout(timer.current), [])

  const copy = useCallback(
    async (text: string) => {
      const copied = await copyText(text)
      setStatus(copied ? 'copied' : 'error')
      clearTimeout(timer.current)
      timer.current = setTimeout(() => setStatus('idle'), copied ? resetMs : 4000)
      return copied
    },
    [resetMs],
  )

  return { status, copy }
}
