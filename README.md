# QueryLab

Kumpulan contoh query SQL siap salin untuk **PostgreSQL, MySQL, dan SQLite**, lengkap dengan penjelasan per klausa, contoh data sebelum/sesudah, dan catatan jebakan umum.

## Fitur

- **Salin dalam satu klik** dari kartu, halaman detail, atau bar yang menempel di bawah layar pada mobile (dengan fallback bila Clipboard API ditolak).
- **Tab dialek** dengan pilihan yang diingat di perangkat.
- **Pencarian instan** (toleran typo) + filter kategori & level + urutan; semua tersimpan di URL.
- **Penjelasan interaktif**: pilih langkah untuk menyorot baris kode terkait.
- **Skema contoh** (DDL per dialek + data seed) agar semua contoh bisa dicoba di database lokal.
- Favorit tanpa login, tema terang/gelap, shortcut `/` atau `Ctrl/⌘ + K` untuk mencari.
- Semua halaman diprerender statis; metadata, sitemap, robots, dan JSON-LD untuk SEO.

## Menjalankan

```bash
pnpm install
pnpm dev
```

Buka http://localhost:3000.

| Perintah         | Fungsi                                 |
| ---------------- | -------------------------------------- |
| `pnpm dev`       | Dev server                             |
| `pnpm build`     | Build produksi                         |
| `pnpm start`     | Menjalankan hasil build                |
| `pnpm test`      | Unit test + validasi semua file konten |
| `pnpm lint`      | ESLint                                 |
| `pnpm typecheck` | Pemeriksaan TypeScript                 |
| `pnpm format`    | Prettier                               |

## Konfigurasi

Salin `.env.example` menjadi `.env.local` lalu isi:

| Variabel               | Keterangan                                                      |
| ---------------------- | --------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL` | URL publik situs, dipakai untuk canonical, sitemap, dan JSON-LD |

## Menambah konten

Setiap query adalah satu file YAML di `content/queries/<kategori>/<slug>.yaml`. Format lengkap dan panduan gaya ada di [CLAUDE.md](CLAUDE.md#5-menambah-contoh-query). Jalankan `pnpm test` setelah menambah konten; build akan gagal bila ada konten yang tidak valid.

