import type { Metadata } from 'next'
import { PageHeader } from '@/components'
import { getSampleSchemaCode } from '@/lib/content'
import { SchemaWorkbench } from './components/SchemaWorkbench'

export const metadata: Metadata = {
  title: 'Skema database contoh',
  description:
    'DDL dan data contoh toko online untuk PostgreSQL, MySQL, dan SQLite. Jalankan di database lokal untuk mencoba semua contoh query.',
  alternates: { canonical: '/schema' },
}

const SchemaPage = async () => {
  const code = await getSampleSchemaCode()

  return (
    <div className="mx-auto flex max-w-[1240px] flex-col gap-8 px-4 pt-7 pb-16 sm:px-6">
      <PageHeader
        breadcrumb={[{ label: 'Beranda', href: '/' }, { label: 'Skema contoh' }]}
        title="Skema database contoh"
        description="Semua contoh di QueryLab memakai database toko online ini. Pilih dialek, salin DDL dan data contohnya, lalu jalankan di database lokal untuk mencoba query mana pun."
      />
      <SchemaWorkbench ddl={code.ddl} seed={code.seed} sequenceFix={code.sequenceFix} />
    </div>
  )
}

export default SchemaPage
