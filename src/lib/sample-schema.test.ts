import { describe, expect, it } from 'vitest'
import { DIALECTS } from '@/lib/dialects'
import { buildDdl, buildSeed, POSTGRES_SEQUENCE_FIX, SAMPLE_TABLES } from '@/lib/sample-schema'

describe('buildDdl', () => {
  it('PostgreSQL memakai SERIAL dan REFERENCES di level kolom', () => {
    const ddl = buildDdl('postgresql')
    expect(ddl).toContain('id          SERIAL PRIMARY KEY')
    expect(ddl).toContain('customer_id  INT NOT NULL REFERENCES customers(id)')
    expect(ddl).not.toContain('FOREIGN KEY')
  })

  it('MySQL menulis foreign key sebagai constraint tabel', () => {
    const ddl = buildDdl('mysql')
    expect(ddl).toContain('INT AUTO_INCREMENT PRIMARY KEY')
    expect(ddl).toContain('FOREIGN KEY (customer_id) REFERENCES customers(id)')
    expect(ddl).not.toMatch(/INT NOT NULL REFERENCES/)
  })

  it('SQLite mengaktifkan foreign key dan memakai tipe SQLite', () => {
    const ddl = buildDdl('sqlite')
    expect(ddl.startsWith('PRAGMA foreign_keys = ON;')).toBe(true)
    expect(ddl).toContain('id          INTEGER PRIMARY KEY')
    expect(ddl).not.toContain('VARCHAR')
  })

  it('membuat semua tabel dengan urutan yang aman untuk foreign key', () => {
    const ddl = buildDdl('postgresql')
    const positions = SAMPLE_TABLES.map((table) => ddl.indexOf(`CREATE TABLE ${table.name} (`))
    expect(positions.every((position) => position >= 0)).toBe(true)
    expect(positions).toEqual([...positions].sort((a, b) => a - b))
  })

  it('perintah sinkronisasi sequence mencakup setiap tabel', () => {
    for (const table of SAMPLE_TABLES) {
      expect(POSTGRES_SEQUENCE_FIX).toContain(`'${table.name}_id_seq'`)
    }
  })

  it('memakai tipe JSON khas tiap dialek untuk kolom metadata', () => {
    expect(buildDdl('postgresql')).toContain('metadata     JSONB')
    expect(buildDdl('mysql')).toContain('metadata     JSON')
    // SQLite tidak punya tipe JSON, jadi disimpan sebagai teks.
    expect(buildDdl('sqlite')).toContain('metadata     TEXT')
  })
})

describe('buildSeed', () => {
  it('tidak pernah menanam tanggal kalender, agar contoh rentang waktu tidak basi', () => {
    for (const dialect of DIALECTS) {
      expect(buildSeed(dialect)).not.toMatch(/\d{4}-\d{2}-\d{2}/)
    }
  })

  it('mengisi metadata JSON, termasuk satu pesanan tanpa metadata', () => {
    for (const dialect of DIALECTS) {
      const seed = buildSeed(dialect)
      expect(seed).toContain('INSERT INTO orders (id, customer_id, status, ordered_at, metadata)')
      expect(seed).toContain('"channel": "web"')
      expect(seed).toContain('"tags": ["promo", "bundling"]')
      // Pesanan ketiga sengaja NULL agar contoh JSON bisa menunjukkan nilai kosong.
      expect(seed).toMatch(/'pending', [^\n]+, NULL\)/)
    }
  })

  it('memakai ekspresi tanggal relatif khas tiap dialek', () => {
    expect(buildSeed('postgresql')).toContain("CURRENT_DATE + TIME '09:15:00' - INTERVAL '10 days'")
    expect(buildSeed('mysql')).toContain("TIMESTAMP(CURDATE() - INTERVAL 10 DAY, '09:15:00')")
    expect(buildSeed('sqlite')).toContain("datetime(date('now', '-10 days') || ' 09:15:00')")
  })

  it('menambahkan TIME ke date, bukan ke timestamp, karena PostgreSQL tidak punya operator itu', () => {
    // date + time -> timestamp, lalu timestamp - interval -> timestamp.
    expect(buildSeed('postgresql')).not.toMatch(/INTERVAL '\d+ days?' \+ TIME/)
  })

  it('memakai satuan hari tunggal di PostgreSQL untuk pesanan kemarin', () => {
    expect(buildSeed('postgresql')).toContain("INTERVAL '1 day'")
    expect(buildSeed('postgresql')).not.toContain("INTERVAL '1 days'")
  })

  it('mengisi semua tabel dengan urutan yang aman untuk foreign key', () => {
    for (const dialect of DIALECTS) {
      const seed = buildSeed(dialect)
      const positions = SAMPLE_TABLES.map((table) => seed.indexOf(`INSERT INTO ${table.name} (`))
      expect(positions.every((position) => position >= 0)).toBe(true)
      expect(positions).toEqual([...positions].sort((a, b) => a - b))
    }
  })

  it('menutup tiap blok INSERT dengan titik koma dan memisahkan baris dengan koma', () => {
    const seed = buildSeed('sqlite')
    const orders = seed.slice(seed.indexOf('INSERT INTO orders (')).split('\n').slice(1, 4)
    expect(orders).toHaveLength(3)
    expect(orders[0].endsWith(',')).toBe(true)
    expect(orders[1].endsWith(',')).toBe(true)
    expect(orders[2].endsWith(';')).toBe(true)
  })
})
