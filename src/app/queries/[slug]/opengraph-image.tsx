import { ImageResponse } from 'next/og'
import { notFound } from 'next/navigation'
import { OG_COLOR, OG_SIZE } from '@/app/og-style'
import { getAllQueries, getQueryDetail } from '@/lib/content'
import { availableDialects, DIALECT_LABEL, DIFFICULTY_LABEL } from '@/lib/dialects'
import { SITE_NAME } from '@/lib/site'

export const alt = 'Contoh query SQL di QueryLab'
export const size = OG_SIZE
export const contentType = 'image/png'

// Tanpa ini, gambar per query tidak ikut diprerender saat build.
export const generateStaticParams = async () => {
  const queries = await getAllQueries()
  return queries.map((query) => ({ slug: query.slug }))
}

// Cukup beberapa baris pertama; sisanya tidak akan terbaca di ukuran kartu share.
const PREVIEW_LINES = 6

const Image = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const query = await getQueryDetail(slug)
  if (!query) notFound()

  const code = query.variants[0].code.split('\n').slice(0, PREVIEW_LINES)
  const dialects = availableDialects(query.variants).map((dialect) => DIALECT_LABEL[dialect])

  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '64px',
        background: OG_COLOR.background,
        color: OG_COLOR.foreground,
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          fontSize: 26,
          color: OG_COLOR.subtle,
        }}
      >
        <span style={{ color: OG_COLOR.accent, fontWeight: 700 }}>{SITE_NAME}</span>
        <span>·</span>
        <span>{query.categoryName}</span>
        <span>·</span>
        <span>{DIFFICULTY_LABEL[query.difficulty]}</span>
      </div>

      <div
        style={{
          marginTop: '26px',
          fontSize: 54,
          lineHeight: 1.16,
          fontWeight: 700,
          letterSpacing: '-0.02em',
          // Judul dibatasi 70 karakter oleh schema, jadi dua baris selalu cukup.
          display: 'flex',
        }}
      >
        {query.title}
      </div>

      <div
        style={{
          marginTop: '30px',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '6px',
          padding: '26px 30px',
          borderRadius: '16px',
          border: `1px solid ${OG_COLOR.border}`,
          background: OG_COLOR.surface,
          fontFamily: 'monospace',
          fontSize: 24,
          lineHeight: 1.45,
          color: OG_COLOR.muted,
          overflow: 'hidden',
        }}
      >
        {code.map((line, index) => (
          <div key={index} style={{ display: 'flex', whiteSpace: 'pre' }}>
            {line || ' '}
          </div>
        ))}
      </div>

      <div style={{ marginTop: '24px', display: 'flex', gap: '12px', fontSize: 23 }}>
        {dialects.map((dialect) => (
          <div
            key={dialect}
            style={{
              padding: '8px 18px',
              borderRadius: '999px',
              border: `1px solid ${OG_COLOR.border}`,
              color: OG_COLOR.muted,
            }}
          >
            {dialect}
          </div>
        ))}
      </div>
    </div>,
    size,
  )
}

export default Image
