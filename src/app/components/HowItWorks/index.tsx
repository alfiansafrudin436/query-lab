const STEPS = [
  {
    label: '01 · Cari',
    title: 'Ketik apa yang ingin kamu lakukan',
    text: 'Misalnya “upsert” atau “running total”. Hasil muncul saat mengetik, typo kecil pun tetap ketemu.',
  },
  {
    label: '02 · Pilih dialek',
    title: 'PostgreSQL, MySQL, atau SQLite',
    text: 'Perbedaan sintaks ditampilkan per tab. Dialek pilihanmu diingat untuk kunjungan berikutnya.',
  },
  {
    label: '03 · Salin & pahami',
    title: 'Satu klik, lalu baca alasannya',
    text: 'Setiap query dijelaskan per klausa, lengkap dengan contoh data sebelum dan sesudah dijalankan.',
  },
]

export const HowItWorks = () => {
  return (
    <section aria-labelledby="cara-title" className="px-4 pt-12 pb-6 sm:px-6">
      <div className="mx-auto flex max-w-[1240px] flex-col gap-6">
        <h2
          id="cara-title"
          className="text-[26px] font-semibold tracking-[-0.025em] sm:text-[28px]"
        >
          Dari cari sampai tersalin dalam tiga langkah
        </h2>
        <ol className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-4">
          {STEPS.map((step) => (
            <li key={step.label} className="flex flex-col gap-2.5 rounded-xl border bg-card p-6">
              <span className="font-mono text-[13px] font-semibold text-primary-soft-foreground">
                {step.label}
              </span>
              <span className="text-[17px] font-semibold">{step.title}</span>
              <span className="text-[14.5px] leading-relaxed text-muted-foreground">
                {step.text}
              </span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
