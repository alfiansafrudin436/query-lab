import { ImageResponse } from 'next/og'
import { SITE_NAME, SITE_TAGLINE } from '@/lib/site'
import { OG_COLOR, OG_SIZE } from './og-style'

export const alt = `${SITE_NAME} — ${SITE_TAGLINE}`
export const size = OG_SIZE
export const contentType = 'image/png'

const Image = () => {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px',
        background: OG_COLOR.background,
        color: OG_COLOR.foreground,
        fontFamily: 'sans-serif',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '18px',
          fontSize: 34,
          fontWeight: 700,
          color: OG_COLOR.accent,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '14px',
            background: OG_COLOR.accent,
            color: OG_COLOR.background,
            fontSize: 32,
          }}
        >
          Q
        </div>
        {SITE_NAME}
      </div>

      <div
        style={{
          marginTop: '36px',
          fontSize: 62,
          lineHeight: 1.18,
          fontWeight: 700,
          letterSpacing: '-0.02em',
        }}
      >
        {SITE_TAGLINE}
      </div>

      <div
        style={{
          marginTop: '32px',
          display: 'flex',
          gap: '14px',
          fontSize: 26,
          color: OG_COLOR.muted,
        }}
      >
        {['PostgreSQL', 'MySQL', 'SQLite'].map((dialect) => (
          <div
            key={dialect}
            style={{
              padding: '10px 20px',
              borderRadius: '999px',
              border: `1px solid ${OG_COLOR.border}`,
              background: OG_COLOR.surface,
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
