'use client'

import { Table2Icon } from 'lucide-react'
import Link from 'next/link'
import { Callout, CodePanel, CopyButton, DialectTabs } from '@/components'
import { columnType, SAMPLE_TABLES } from '@/lib/sample-schema'
import type { HighlightedCode } from '@/types'
import { useSchemaPage } from '../../hooks'

type SchemaWorkbenchProps = {
  ddl: HighlightedCode[]
  seed: HighlightedCode[]
  sequenceFix: HighlightedCode
}

const STEPS = [
  {
    title: 'Buat database kosong',
    text: 'Misalnya bernama tokoku di PostgreSQL atau MySQL, atau file SQLite baru.',
  },
  {
    title: 'Jalankan DDL',
    text: `Membuat ${SAMPLE_TABLES.length} tabel beserta primary key dan foreign key-nya.`,
  },
  {
    title: 'Isi data contoh',
    text: 'Data kecil yang sengaja memuat kasus khusus: email ganda, customer tanpa pesanan, dan tanggal pesanan yang dihitung dari hari kamu menjalankannya.',
  },
]

export const SchemaWorkbench = ({ ddl, seed, sequenceFix }: SchemaWorkbenchProps) => {
  const state = useSchemaPage(ddl, seed)

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-3">
        <span className="pl-1 text-sm font-medium text-muted-foreground">Dialek</span>
        <DialectTabs
          tone="light"
          available={state.available}
          value={state.dialect}
          onChange={state.setDialect}
          className="border-0 p-0"
        />
        <CopyButton
          text={state.copyAllText}
          label={`Salin DDL dan data contoh untuk ${state.dialectLabel}`}
          tone="primary"
          className="ml-auto"
        >
          Salin DDL + data contoh
        </CopyButton>
      </div>

      <section aria-labelledby="cara-heading" className="flex flex-col gap-3.5">
        <h2 id="cara-heading" className="text-[22px] font-semibold tracking-[-0.02em]">
          Cara mencoba
        </h2>
        <ol className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-3">
          {STEPS.map((step, index) => (
            <Step key={step.title} number={index + 1} title={step.title}>
              {step.text}
            </Step>
          ))}
          <Step number={STEPS.length + 1} title="Coba query apa saja">
            Salin dari halaman{' '}
            <Link href="/queries" className="font-medium text-link hover:underline">
              Jelajah
            </Link>{' '}
            lalu bandingkan hasilnya dengan contoh data.
          </Step>
        </ol>
      </section>

      <section aria-labelledby="struktur-heading" className="flex flex-col gap-3.5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <h2 id="struktur-heading" className="text-[22px] font-semibold tracking-[-0.02em]">
              Struktur tabel
            </h2>
            <p className="text-[14.5px] text-muted-foreground">
              Tipe kolom ditampilkan dalam dialek{' '}
              <strong className="font-semibold text-foreground">{state.dialectLabel}</strong>.
            </p>
          </div>
          <div className="flex flex-wrap gap-3.5 text-[13px] text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <KeyBadge>PK</KeyBadge> Primary key
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ForeignKeyBadge>FK →</ForeignKeyBadge> Foreign key ke tabel lain
            </span>
          </div>
        </div>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3.5">
          {SAMPLE_TABLES.map((table) => (
            <article key={table.name} className="overflow-hidden rounded-xl border bg-card">
              <div className="flex items-center gap-2.5 border-b bg-background px-4 py-3.5">
                <Table2Icon className="size-[18px] shrink-0 text-primary" aria-hidden />
                <div className="flex min-w-0 flex-col">
                  <h3 className="font-mono text-[15px] font-semibold">{table.name}</h3>
                  <span className="text-[13px] text-muted-foreground">{table.description}</span>
                </div>
              </div>
              <ul className="py-1">
                {table.columns.map((column) => (
                  <li
                    key={column.name}
                    className="flex flex-wrap items-center gap-x-2.5 gap-y-1 px-4 py-2"
                  >
                    <span className="font-mono text-[13.5px] font-medium">{column.name}</span>
                    <span className="font-mono text-[12.5px] text-subtle-foreground">
                      {columnType(column, state.dialect)}
                    </span>
                    <span className="flex-1" />
                    {column.kind === 'pk' && <KeyBadge>PK</KeyBadge>}
                    {column.references && (
                      <ForeignKeyBadge>FK → {column.references}</ForeignKeyBadge>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section aria-labelledby="ddl-heading" className="flex flex-col gap-3.5">
        <h2 id="ddl-heading" className="text-[22px] font-semibold tracking-[-0.02em]">
          DDL
        </h2>
        <CodePanel
          variants={ddl}
          name="DDL skema contoh"
          showTabs={false}
          title={(dialect) => `schema.${dialect}.sql`}
          copyLabel="Salin DDL"
          bodyClassName="max-h-[520px]"
        />
      </section>

      <section aria-labelledby="seed-heading" className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1">
          <h2 id="seed-heading" className="text-[22px] font-semibold tracking-[-0.02em]">
            Data contoh
          </h2>
          <p className="text-[14.5px] text-muted-foreground">
            Semua INSERT-nya sama untuk ketiga dialek; yang menyesuaikan hanya ekspresi tanggal{' '}
            <code className="font-mono text-[13.5px]">ordered_at</code>, yang dihitung relatif
            terhadap hari kamu menjalankannya agar contoh rentang waktu tidak pernah kosong.
          </p>
        </div>
        <CodePanel
          variants={seed}
          name="data contoh"
          showTabs={false}
          title={(dialect) => `seed.${dialect}.sql`}
          copyLabel="Salin data"
          bodyClassName="max-h-[380px]"
        />
        {state.dialect === 'postgresql' && (
          <Callout type="info" title="Khusus PostgreSQL">
            <p className="mb-3">
              Data contoh memakai id eksplisit, jadi sequence SERIAL belum bergeser. Sebelum
              menambah baris dengan id otomatis, sinkronkan dulu sequence-nya:
            </p>
            <CodePanel
              variants={[sequenceFix]}
              name="perintah sinkronisasi sequence"
              showTabs={false}
              title="sequence.sql"
            />
          </Callout>
        )}
      </section>
    </div>
  )
}

type StepProps = {
  number: number
  title: string
  children: React.ReactNode
}

const Step = ({ number, title, children }: StepProps) => {
  return (
    <li className="flex gap-3 rounded-xl border bg-card p-4">
      <span
        aria-hidden
        className="inline-flex size-7 shrink-0 items-center justify-center rounded-full bg-primary-soft font-mono text-[13px] font-semibold text-primary-soft-foreground"
      >
        {number}
      </span>
      <span className="flex flex-col gap-1">
        <strong className="text-[15px] font-semibold">{title}</strong>
        <span className="text-sm leading-normal text-muted-foreground">{children}</span>
      </span>
    </li>
  )
}

const KeyBadge = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="rounded bg-intermediate-soft px-1.5 py-0.5 font-mono text-[11px] font-semibold text-intermediate-foreground">
      {children}
    </span>
  )
}

const ForeignKeyBadge = ({ children }: { children: React.ReactNode }) => {
  return (
    <span className="rounded bg-primary-soft px-1.5 py-0.5 font-mono text-[11px] font-semibold text-primary-soft-foreground">
      {children}
    </span>
  )
}
