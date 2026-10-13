// Fallback untuk segmen yang belum punya skeleton sendiri. Halaman /queries dan
// /queries/[slug] sudah menyediakan skeleton-nya di dalam <Suspense> masing-masing.
// Ukurannya dibuat menyerupai konten nyata agar pergeseran tata letak tetap nol.
const Loading = () => {
  return (
    <div
      aria-busy="true"
      className="mx-auto flex max-w-[1240px] animate-pulse flex-col gap-4 px-4 pt-7 pb-16 sm:px-6"
    >
      <div className="h-4 w-48 rounded bg-muted" />
      <div className="h-10 w-72 rounded-lg bg-muted" />
      <div className="mt-4 h-64 rounded-xl bg-muted" />
      <span className="sr-only">Memuat halaman…</span>
    </div>
  )
}

export default Loading
