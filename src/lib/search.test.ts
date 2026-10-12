import { describe, expect, it } from 'vitest'
import { createSearchIndex, highlightSegments, searchQueries, searchTerms } from '@/lib/search'
import type { QuerySummary } from '@/types'

const items: QuerySummary[] = [
  {
    slug: 'upsert',
    title: 'UPSERT: insert atau update jika sudah ada',
    summary: 'Tambahkan produk baru atau perbarui harga.',
    category: 'dml',
    categoryName: 'Manipulasi Data',
    difficulty: 'intermediate',
    tags: ['upsert', 'on conflict'],
    popularity: 11,
    createdAt: '2026-09-28',
    variants: [
      {
        dialects: ['postgresql'],
        code: 'INSERT INTO products ... ON CONFLICT (id) DO UPDATE',
        lineCount: 1,
        previewLines: [],
      },
    ],
  },
  {
    slug: 'left-join',
    title: 'LEFT JOIN: sertakan data tanpa pasangan',
    summary: 'Tampilkan semua customer beserta pesanannya.',
    category: 'join',
    categoryName: 'JOIN',
    difficulty: 'beginner',
    tags: ['left join'],
    popularity: 10,
    createdAt: '2026-08-04',
    variants: [
      {
        dialects: ['postgresql'],
        code: 'SELECT c.name FROM customers c LEFT JOIN orders o',
        lineCount: 1,
        previewLines: [],
      },
    ],
  },
]

describe('searchQueries', () => {
  const index = createSearchIndex(items)

  it('menemukan berdasarkan judul', () => {
    expect(searchQueries(index, 'upsert')[0]).toBe('upsert')
  })

  it('toleran terhadap typo kecil', () => {
    expect(searchQueries(index, 'upsrt')).toContain('upsert')
  })

  it('mencari di isi kode dan mendukung awalan kata', () => {
    expect(searchQueries(index, 'conf')).toContain('upsert')
  })

  it('semua kata harus cocok', () => {
    expect(searchQueries(index, 'left customer')).toEqual(['left-join'])
  })

  it('pencarian kosong tidak mengembalikan apa pun', () => {
    expect(searchQueries(index, '   ')).toEqual([])
  })
})

describe('highlightSegments', () => {
  it('menandai bagian judul yang cocok tanpa peduli huruf besar-kecil', () => {
    expect(highlightSegments('LEFT JOIN data', searchTerms('join'))).toEqual([
      { text: 'LEFT ', match: false },
      { text: 'JOIN', match: true },
      { text: ' data', match: false },
    ])
  })

  it('mengabaikan kata satu huruf', () => {
    expect(searchTerms('a left')).toEqual(['left'])
  })
})
