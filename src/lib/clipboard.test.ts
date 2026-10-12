import { describe, expect, it } from 'vitest'
import { normalizeCode } from '@/lib/clipboard'

describe('normalizeCode', () => {
  it('membuang spasi di akhir baris dan menambah satu newline di akhir', () => {
    expect(normalizeCode('SELECT 1;   \nFROM t;\t')).toBe('SELECT 1;\nFROM t;\n')
  })

  it('tidak menumpuk newline di akhir', () => {
    expect(normalizeCode('SELECT 1;\n\n\n')).toBe('SELECT 1;\n')
  })

  it('mempertahankan indentasi di awal baris', () => {
    expect(normalizeCode('SET a = 1,\n    b = 2;')).toBe('SET a = 1,\n    b = 2;\n')
  })
})
