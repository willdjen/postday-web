'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-gray-200">500</h1>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Terjadi kesalahan</h2>
        <p className="mt-2 text-sm text-gray-500">
          Sesuatu tidak berjalan dengan baik. Silakan coba lagi.
        </p>
        <button
          onClick={reset}
          className="mt-6 inline-block rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF9800] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-all hover:shadow-lg"
        >
          Coba Lagi
        </button>
      </div>
    </div>
  )
}
