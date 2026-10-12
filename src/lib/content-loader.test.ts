import { mkdtemp, mkdir, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { DIALECTS } from '@/lib/content-schema'
import { ContentError, loadCategories, loadQueries } from '@/lib/content-loader'

describe('konten di repo', () => {
  it('semua file konten valid', async () => {
    const queries = await loadQueries()
    expect(queries.length).toBeGreaterThan(0)
  })

  it('setiap query punya kode untuk ketiga dialek', async () => {
    for (const query of await loadQueries()) {
      const dialects = new Set(query.variants.flatMap((variant) => variant.dialects))
      expect([...dialects].sort(), query.slug).toEqual([...DIALECTS].sort())
    }
  })

  it('setiap kategori query terdaftar', async () => {
    const categories = new Set((await loadCategories()).map((category) => category.slug))
    for (const query of await loadQueries()) {
      expect(categories.has(query.category), query.slug).toBe(true)
    }
  })
})

const makeContent = async (files: Record<string, string>) => {
  const dir = await mkdtemp(path.join(tmpdir(), 'querylab-'))
  await writeFile(
    path.join(dir, 'categories.yaml'),
    '- slug: join\n  name: JOIN\n  keyword: JOIN\n  description: Gabung tabel.\n',
  )
  for (const [file, content] of Object.entries(files)) {
    await mkdir(path.dirname(path.join(dir, 'queries', file)), { recursive: true })
    await writeFile(path.join(dir, 'queries', file), content)
  }
  return dir
}

const validQuery = `
title: Contoh
summary: Ringkasan.
whenToUse: Saat butuh.
difficulty: beginner
createdAt: '2026-01-01'
updatedAt: '2026-01-01'
variants:
  - dialects: [postgresql]
    code: |
      SELECT 1;
    explanation:
      - lines: [1, 1]
        clause: SELECT 1
        text: Contoh.
`

describe('validasi loader', () => {
  it('menolak penjelasan yang merujuk baris di luar kode', async () => {
    const dir = await makeContent({
      'join/contoh.yaml': validQuery.replace('lines: [1, 1]', 'lines: [1, 3]'),
    })
    await expect(loadQueries(dir)).rejects.toThrow(ContentError)
  })

  it('menolak related yang tidak ada', async () => {
    const dir = await makeContent({ 'join/contoh.yaml': `${validQuery}related: [tidak-ada]\n` })
    await expect(loadQueries(dir)).rejects.toThrow(/related "tidak-ada"/)
  })

  it('menolak folder kategori yang tidak terdaftar', async () => {
    const dir = await makeContent({ 'lainnya/contoh.yaml': validQuery })
    await expect(loadQueries(dir)).rejects.toThrow(/tidak terdaftar/)
  })

  it('menolak dialek ganda di dua varian', async () => {
    const duplicate = validQuery.replace(
      'variants:',
      'variants:\n  - dialects: [postgresql]\n    code: SELECT 2;\n    explanation:\n      - lines: [1, 1]\n        clause: SELECT 2\n        text: Dua.',
    )
    const dir = await makeContent({ 'join/contoh.yaml': duplicate })
    await expect(loadQueries(dir)).rejects.toThrow(/lebih dari satu varian/)
  })

  it('menurunkan slug dan kategori dari path file', async () => {
    const dir = await makeContent({ 'join/contoh-valid.yaml': validQuery })
    const [query] = await loadQueries(dir)
    expect(query.slug).toBe('contoh-valid')
    expect(query.category).toBe('join')
    expect(query.variants[0].code).toBe('SELECT 1;')
  })
})
