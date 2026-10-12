import { describe, expect, it } from 'vitest'
import { highlightSql } from '@/lib/highlight'

const KEYWORD = '#82AAFF'

const colorOf = (lines: Awaited<ReturnType<typeof highlightSql>>, word: string) => {
  return lines.flat().find((token) => token.content.includes(word))?.color
}

describe('highlightSql', () => {
  it('menghasilkan satu baris token per baris kode, tanpa kehilangan teks', async () => {
    const code = 'SELECT id\nFROM orders\nWHERE id = 1;'
    const lines = await highlightSql(code)
    expect(lines).toHaveLength(3)
    expect(lines.map((line) => line.map((token) => token.content).join('')).join('\n')).toBe(code)
  })

  it('mewarnai keyword yang tidak dikenali grammar bawaan', async () => {
    const lines = await highlightSql('INSERT INTO t (id) VALUES (1) ON CONFLICT (id) DO NOTHING;')
    expect(colorOf(lines, 'CONFLICT')).toBe(KEYWORD)
  })

  it('tidak mewarnai nama kolom biasa sebagai keyword', async () => {
    const lines = await highlightSql('SELECT dokumen FROM t;')
    expect(colorOf(lines, 'dokumen')).not.toBe(KEYWORD)
  })
})
