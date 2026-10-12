'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

export const SEARCH_INPUT_ID = 'q'

export const focusSearchInput = (): boolean => {
  const input = document.getElementById(SEARCH_INPUT_ID)
  if (!(input instanceof HTMLInputElement)) return false
  input.focus()
  input.select()
  return true
}

// Shortcut global: "/" atau Ctrl/⌘ + K membuka pencarian dari halaman mana pun.
export const SearchHotkey = () => {
  const router = useRouter()

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null
      const isTyping = Boolean(target?.closest('input, textarea, select, [contenteditable="true"]'))
      const isSlash =
        event.key === '/' && !isTyping && !event.ctrlKey && !event.metaKey && !event.altKey
      const isCommandK = (event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k'
      if (!isSlash && !isCommandK) return

      event.preventDefault()
      if (!focusSearchInput()) router.push('/queries#cari')
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [router])

  return null
}
