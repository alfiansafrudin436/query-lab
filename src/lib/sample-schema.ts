import type { Dialect } from '@/types'

// Skema toko online yang dipakai oleh semua contoh query.

type ColumnKind = 'pk' | 'int' | 'varchar' | 'money' | 'timestamp' | 'json'

export type SampleColumn = {
  name: string
  kind: ColumnKind
  length?: number
  notNull?: boolean
  defaultValue?: string
  references?: string
}

export type SampleTableDefinition = {
  name: string
  description: string
  columns: SampleColumn[]
}

export const SAMPLE_TABLES: SampleTableDefinition[] = [
  {
    name: 'customers',
    description: 'Pelanggan toko',
    columns: [
      { name: 'id', kind: 'pk' },
      { name: 'name', kind: 'varchar', length: 100, notNull: true },
      { name: 'email', kind: 'varchar', length: 150, notNull: true },
      { name: 'city', kind: 'varchar', length: 80 },
      { name: 'created_at', kind: 'timestamp', notNull: true, defaultValue: 'CURRENT_TIMESTAMP' },
    ],
  },
  {
    name: 'categories',
    description: 'Kategori produk, bisa bertingkat',
    columns: [
      { name: 'id', kind: 'pk' },
      { name: 'name', kind: 'varchar', length: 80, notNull: true },
      { name: 'parent_id', kind: 'int', references: 'categories' },
    ],
  },
  {
    name: 'products',
    description: 'Katalog produk',
    columns: [
      { name: 'id', kind: 'pk' },
      { name: 'category_id', kind: 'int', notNull: true, references: 'categories' },
      { name: 'name', kind: 'varchar', length: 150, notNull: true },
      { name: 'price', kind: 'money', notNull: true },
      { name: 'stock', kind: 'int', notNull: true, defaultValue: '0' },
    ],
  },
  {
    name: 'orders',
    description: 'Header pesanan',
    columns: [
      { name: 'id', kind: 'pk' },
      { name: 'customer_id', kind: 'int', notNull: true, references: 'customers' },
      { name: 'status', kind: 'varchar', length: 20, notNull: true },
      { name: 'ordered_at', kind: 'timestamp', notNull: true },
      // Sengaja boleh kosong agar contoh JSON bisa menunjukkan penanganan NULL.
      { name: 'metadata', kind: 'json' },
    ],
  },
  {
    name: 'order_items',
    description: 'Item di setiap pesanan',
    columns: [
      { name: 'id', kind: 'pk' },
      { name: 'order_id', kind: 'int', notNull: true, references: 'orders' },
      { name: 'product_id', kind: 'int', notNull: true, references: 'products' },
      { name: 'quantity', kind: 'int', notNull: true },
      { name: 'unit_price', kind: 'money', notNull: true },
    ],
  },
  {
    name: 'employees',
    description: 'Karyawan dan atasannya',
    columns: [
      { name: 'id', kind: 'pk' },
      { name: 'name', kind: 'varchar', length: 100, notNull: true },
      { name: 'manager_id', kind: 'int', references: 'employees' },
      { name: 'department', kind: 'varchar', length: 50 },
      { name: 'salary', kind: 'money' },
    ],
  },
]

export const columnType = (column: SampleColumn, dialect: Dialect): string => {
  switch (column.kind) {
    case 'pk':
      return { postgresql: 'SERIAL', mysql: 'INT AUTO_INCREMENT', sqlite: 'INTEGER' }[dialect]
    case 'int':
      return dialect === 'sqlite' ? 'INTEGER' : 'INT'
    case 'varchar':
      return dialect === 'sqlite' ? 'TEXT' : `VARCHAR(${column.length})`
    case 'money':
      return { postgresql: 'NUMERIC(12,2)', mysql: 'DECIMAL(12,2)', sqlite: 'NUMERIC' }[dialect]
    case 'timestamp':
      return { postgresql: 'TIMESTAMP', mysql: 'DATETIME', sqlite: 'TEXT' }[dialect]
    // SQLite tidak punya tipe JSON; nilainya disimpan sebagai teks dan dibaca
    // dengan fungsi json_* bawaan.
    case 'json':
      return { postgresql: 'JSONB', mysql: 'JSON', sqlite: 'TEXT' }[dialect]
  }
}

export const buildDdl = (dialect: Dialect): string => {
  const out: string[] = []
  if (dialect === 'sqlite') out.push('PRAGMA foreign_keys = ON;', '')

  SAMPLE_TABLES.forEach((table, tableIndex) => {
    const width = Math.max(...table.columns.map((column) => column.name.length))
    const lines = table.columns.map((column) => {
      let line = `  ${column.name.padEnd(width + 2)}${columnType(column, dialect)}`
      if (column.kind === 'pk') line += ' PRIMARY KEY'
      if (column.notNull) line += ' NOT NULL'
      if (column.defaultValue) line += ` DEFAULT ${column.defaultValue}`
      // MySQL mengabaikan REFERENCES di level kolom, jadi FK ditulis sebagai constraint tabel.
      if (column.references && dialect !== 'mysql') line += ` REFERENCES ${column.references}(id)`
      return line
    })
    if (dialect === 'mysql') {
      for (const column of table.columns) {
        if (column.references) {
          lines.push(`  FOREIGN KEY (${column.name}) REFERENCES ${column.references}(id)`)
        }
      }
    }
    out.push(`CREATE TABLE ${table.name} (`)
    lines.forEach((line, index) => out.push(index < lines.length - 1 ? `${line},` : line))
    out.push(');')
    if (tableIndex < SAMPLE_TABLES.length - 1) out.push('')
  })

  return out.join('\n')
}

// Tanggal pesanan sengaja relatif terhadap hari seed dijalankan, bukan tanggal absolut,
// supaya contoh seperti "7 hari terakhir" tetap menghasilkan baris kapan pun dicoba.
// Order 1 (H-10) sengaja di luar jendela 7 hari agar filternya terlihat bekerja.
type SeedOrder = {
  id: number
  customerId: number
  status: string
  daysAgo: number
  time: string
  // Null berarti pesanan tanpa metadata, dipakai contoh JSON untuk menunjukkan NULL.
  // Jangan menaruh tanggal di dalamnya: seed sengaja bebas tanggal kalender.
  metadata: string | null
}

const SEED_ORDERS: SeedOrder[] = [
  {
    id: 1,
    customerId: 1,
    status: 'paid',
    daysAgo: 10,
    time: '09:15:00',
    metadata: '{"channel": "web", "coupon": "HEMAT10", "tags": ["promo", "bundling"]}',
  },
  {
    id: 2,
    customerId: 2,
    status: 'paid',
    daysAgo: 5,
    time: '14:02:00',
    metadata: '{"channel": "mobile", "tags": ["promo"]}',
  },
  { id: 3, customerId: 1, status: 'pending', daysAgo: 1, time: '19:40:00', metadata: null },
]

const relativeTimestamp = (dialect: Dialect, daysAgo: number, time: string): string => {
  switch (dialect) {
    // Urutan operasi penting di PostgreSQL: date + time menghasilkan timestamp,
    // sedangkan timestamp + time bukan operator yang valid.
    case 'postgresql':
      return `CURRENT_DATE + TIME '${time}' - INTERVAL '${daysAgo} ${daysAgo === 1 ? 'day' : 'days'}'`
    case 'mysql':
      return `TIMESTAMP(CURDATE() - INTERVAL ${daysAgo} DAY, '${time}')`
    case 'sqlite':
      return `datetime(date('now', '-${daysAgo} days') || ' ${time}')`
  }
}

const SEED_BEFORE_ORDERS = [
  'INSERT INTO customers (id, name, email, city) VALUES',
  "  (1, 'Rina Wijaya', 'rina@example.com', 'Bandung'),",
  "  (2, 'Dimas Pratama', 'dimas@example.com', 'Surabaya'),",
  "  (3, 'Sari Lestari', 'sari@example.com', 'Yogyakarta'),",
  "  (4, 'Rina W.', 'rina@example.com', 'Bandung');",
  '',
  'INSERT INTO categories (id, name, parent_id) VALUES',
  "  (1, 'Minuman', NULL),",
  "  (2, 'Kopi', 1),",
  "  (3, 'Teh', 1);",
  '',
  'INSERT INTO products (id, category_id, name, price, stock) VALUES',
  "  (101, 2, 'Kopi Arabika 250g', 79000, 12),",
  "  (102, 3, 'Teh Melati 100g', 25000, 30),",
  "  (103, 2, 'Kopi Robusta 250g', 62000, 20);",
  '',
]

const SEED_AFTER_ORDERS = [
  '',
  'INSERT INTO order_items (id, order_id, product_id, quantity, unit_price) VALUES',
  '  (1, 1, 101, 2, 79000),',
  '  (2, 1, 102, 1, 25000),',
  '  (3, 2, 103, 3, 62000),',
  '  (4, 3, 102, 2, 25000);',
  '',
  'INSERT INTO employees (id, name, manager_id, department, salary) VALUES',
  "  (1, 'Andi Saputra', NULL, 'Operasional', 15000000),",
  "  (2, 'Budi Hartono', 1, 'Operasional', 9000000),",
  "  (3, 'Citra Dewi', 1, 'Gudang', 8500000);",
]

export const buildSeed = (dialect: Dialect): string => {
  const orders = SEED_ORDERS.map((order, index) => {
    const timestamp = relativeTimestamp(dialect, order.daysAgo, order.time)
    const metadata = order.metadata === null ? 'NULL' : `'${order.metadata}'`
    const end = index < SEED_ORDERS.length - 1 ? ',' : ';'
    return `  (${order.id}, ${order.customerId}, '${order.status}', ${timestamp}, ${metadata})${end}`
  })

  return [
    ...SEED_BEFORE_ORDERS,
    'INSERT INTO orders (id, customer_id, status, ordered_at, metadata) VALUES',
    ...orders,
    ...SEED_AFTER_ORDERS,
  ].join('\n')
}

export const POSTGRES_SEQUENCE_FIX = SAMPLE_TABLES.map(
  (table) => `SELECT setval('${table.name}_id_seq', (SELECT MAX(id) FROM ${table.name}));`,
).join('\n')
