import 'server-only'
import { createHighlighterCore, type HighlighterCore, type ThemeRegistration } from 'shiki/core'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import type { CodeLine } from '@/types'

// Warna syntax mengikuti desain: blok kode selalu gelap, di tema terang maupun gelap.
const CODE_FOREGROUND = '#E6E9EF'
const KEYWORD_COLOR = '#82AAFF'

const queryLabTheme: ThemeRegistration = {
  name: 'query-lab',
  type: 'dark',
  colors: {
    'editor.background': '#0E1117',
    'editor.foreground': CODE_FOREGROUND,
  },
  tokenColors: [
    {
      scope: ['keyword', 'storage', 'storage.type', 'storage.modifier'],
      settings: { foreground: KEYWORD_COLOR },
    },
    { scope: ['keyword.operator', 'punctuation'], settings: { foreground: '#AEB6C4' } },
    { scope: ['support.function', 'entity.name.function'], settings: { foreground: '#F2C66D' } },
    { scope: ['string'], settings: { foreground: '#A6DA95' } },
    { scope: ['constant.numeric', 'constant.language'], settings: { foreground: '#F5A97F' } },
    { scope: ['comment'], settings: { foreground: '#8A93A5' } },
  ],
}

// Keyword yang tidak dikenali grammar SQL bawaan Shiki.
const EXTRA_KEYWORDS = new Set([
  'CONFLICT',
  'DO',
  'NOTHING',
  'EXCLUDED',
  'DUPLICATE',
  'KEY',
  'INTERVAL',
  'OFFSET',
  'RETURNING',
  'USING',
  'PRAGMA',
  'AUTO_INCREMENT',
  'FILTER',
  'LATERAL',
  'RECURSIVE',
])

let highlighterPromise: Promise<HighlighterCore> | null = null

const getHighlighter = () => {
  highlighterPromise ??= (async () => {
    const sql = (await import('shiki/langs/sql.mjs')).default
    return createHighlighterCore({
      themes: [queryLabTheme],
      langs: [sql],
      engine: createJavaScriptRegexEngine(),
    })
  })()
  return highlighterPromise
}

export const highlightSql = async (code: string): Promise<CodeLine[]> => {
  const highlighter = await getHighlighter()
  const { tokens } = highlighter.codeToTokens(code, { lang: 'sql', theme: 'query-lab' })

  return tokens.map((line) => {
    const out: CodeLine = []
    for (const token of line) {
      const color = (token.color ?? CODE_FOREGROUND).toUpperCase()
      const parts = color === CODE_FOREGROUND ? splitExtraKeywords(token.content) : [token]
      for (const part of parts) {
        const partColor = 'color' in part && part.color ? part.color.toUpperCase() : color
        const last = out.at(-1)
        if (last && last.color === partColor) {
          last.content += part.content
        } else {
          out.push({ content: part.content, color: partColor })
        }
      }
    }
    return out
  })
}

const splitExtraKeywords = (content: string): { content: string; color?: string }[] => {
  return content
    .split(/([A-Za-z_][A-Za-z0-9_]*)/)
    .filter(Boolean)
    .map((part) => {
      const upper = part.toUpperCase()
      const isKeyword = EXTRA_KEYWORDS.has(upper) && (part === upper || upper === 'EXCLUDED')
      return isKeyword ? { content: part, color: KEYWORD_COLOR } : { content: part }
    })
}
