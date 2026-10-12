// Rapikan teks sebelum disalin: buang spasi di akhir baris dan akhiri dengan satu newline.
export const normalizeCode = (text: string): string => {
  const lines = text.split('\n').map((line) => line.replace(/\s+$/, ''))
  return `${lines.join('\n').replace(/\n+$/, '')}\n`
}

export const copyText = async (text: string): Promise<boolean> => {
  const value = normalizeCode(text)
  // writeText dipanggil langsung (tanpa await lain sebelumnya) agar Safari tetap menganggapnya gesture user.
  if (
    typeof navigator !== 'undefined' &&
    navigator.clipboard?.writeText &&
    window.isSecureContext
  ) {
    try {
      await navigator.clipboard.writeText(value)
      return true
    } catch {
      // lanjut ke fallback
    }
  }
  return legacyCopy(value)
}

const legacyCopy = (value: string): boolean => {
  if (typeof document === 'undefined') return false
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.top = '0'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  let copied = false
  try {
    copied = document.execCommand('copy')
  } catch {
    copied = false
  }
  document.body.removeChild(textarea)
  return copied
}
