import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <h1 className="text-8xl font-extrabold text-gray-200">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-gray-900">Halaman tidak ditemukan</h2>
        <p className="mt-2 text-sm text-gray-500">
          Halaman yang kamu cari tidak ada atau telah dipindahkan.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-block rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF9800] px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-200 transition-all hover:shadow-lg"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  )
}
