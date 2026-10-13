// Warna untuk OG image. Satori merender tanpa CSS kustom properties, jadi nilainya
// ditulis mentah di sini. Dipilih dari palet blok kode di globals.css (--code-*) supaya
// kartu share-nya terlihat satu keluarga dengan tampilan kode di aplikasi.
export const OG_COLOR = {
  background: '#0e1117',
  surface: '#1a1f29',
  border: '#1e2430',
  foreground: '#e6e9ef',
  muted: '#b8c0cc',
  subtle: '#7c8597',
  accent: '#82aaff',
  keyword: '#82aaff',
  string: '#a6da95',
} as const

export const OG_SIZE = { width: 1200, height: 630 }
