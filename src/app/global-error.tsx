'use client'

// global-error menggantikan root layout saat aktif, jadi ia harus menulis <html> dan <body>
// sendiri. Global stylesheet tidak ikut termuat di sini, sehingga seluruh gaya ditulis inline
// dan warnanya mengikuti skema sistem lewat color-scheme, bukan lewat class tema aplikasi.

type GlobalErrorProps = {
  error: Error & { digest?: string }
  retry: () => void
}

const GlobalError = ({ error, retry }: GlobalErrorProps) => {
  return (
    <html lang="id">
      <body
        style={{
          colorScheme: 'light dark',
          margin: 0,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          fontFamily:
            'system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif, Apple Color Emoji',
        }}
      >
        <title>Terjadi kesalahan · QueryLab</title>
        <main style={{ maxWidth: '32rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '1.375rem', lineHeight: 1.3, margin: '0 0 12px' }}>
            Terjadi kesalahan
          </h1>
          <p style={{ fontSize: '0.95rem', lineHeight: 1.6, opacity: 0.75, margin: '0 0 20px' }}>
            QueryLab gagal dimuat sepenuhnya. Coba muat ulang halamannya.
          </p>
          <button
            type="button"
            onClick={() => retry()}
            style={{
              font: 'inherit',
              fontWeight: 500,
              cursor: 'pointer',
              padding: '10px 18px',
              borderRadius: '10px',
              border: '1px solid currentColor',
              background: 'transparent',
              color: 'inherit',
            }}
          >
            Coba lagi
          </button>
          {error.digest && (
            <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '20px' }}>
              Kode error: <code>{error.digest}</code>
            </p>
          )}
        </main>
      </body>
    </html>
  )
}

export default GlobalError
