export const SITE_NAME = 'QueryLab'
export const SITE_TAGLINE = 'Contoh query SQL siap salin, lengkap dengan penjelasannya'
export const SITE_DESCRIPTION =
  'Kumpulan contoh query SQL untuk PostgreSQL, MySQL, dan SQLite. Cari, pilih dialek, salin dalam satu klik, lalu pahami setiap klausanya.'

// Canonical, sitemap, dan JSON-LD semuanya dibangun dari nilai ini. Kalau env var-nya lupa
// diisi saat build produksi, seluruh URL tersebut akan menunjuk localhost tanpa satu pun
// error, jadi build sengaja digagalkan daripada menghasilkan metadata yang salah.
const resolveSiteUrl = (): string => {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL
  if (fromEnv) return fromEnv
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'NEXT_PUBLIC_SITE_URL wajib diisi untuk build produksi. ' +
        'Contoh: NEXT_PUBLIC_SITE_URL=https://querylab.example pnpm build',
    )
  }
  return 'http://localhost:3000'
}

export const SITE_URL = resolveSiteUrl()
