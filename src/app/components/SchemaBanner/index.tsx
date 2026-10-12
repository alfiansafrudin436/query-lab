import { ArrowRightIcon } from 'lucide-react'
import Link from 'next/link'
import { SAMPLE_TABLES } from '@/lib/sample-schema'

export const SchemaBanner = () => {
  return (
    <section aria-labelledby="skema-title" className="px-4 pt-12 pb-20 sm:px-6">
      <div className="mx-auto flex max-w-[1240px] flex-wrap items-center justify-between gap-8 rounded-2xl border border-code-border bg-code-bg p-7 text-code-foreground sm:p-10">
        <div className="flex min-w-0 flex-[1_1_420px] flex-col gap-3.5">
          <h2 id="skema-title" className="text-[26px] font-semibold tracking-[-0.02em] text-white">
            Satu database contoh untuk semua query
          </h2>
          <p className="max-w-[620px] text-[15.5px] leading-relaxed text-code-muted">
            Semua contoh memakai skema toko online yang sama. Salin DDL dan data contohnya, jalankan
            di database lokal, lalu coba query mana pun.
          </p>
          <ul className="flex flex-wrap gap-2" aria-label="Tabel di skema contoh">
            {SAMPLE_TABLES.map((table) => (
              <li
                key={table.name}
                className="rounded-md border border-code-surface-active bg-code-surface px-2.5 py-1 font-mono text-[13px]"
              >
                {table.name}
              </li>
            ))}
          </ul>
        </div>
        <Link
          href="/schema"
          className="inline-flex h-12 items-center gap-2 rounded-[10px] bg-white px-5 text-[15px] font-semibold text-[#0d1117] hover:bg-[#e6e9ef]"
        >
          Lihat skema &amp; salin DDL
          <ArrowRightIcon className="size-4" aria-hidden />
        </Link>
      </div>
    </section>
  )
}
