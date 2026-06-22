import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { Lightbulb, Zap } from 'lucide-react'

import { authOptions } from '@/lib/auth'

export default async function InsightsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Insights</h1>
        <p className="mt-1 text-sm text-gray-500">Rekomendasi AI berdasarkan performa konten kamu</p>
      </div>

      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white py-20">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
          <Lightbulb className="h-8 w-8 text-amber-500" />
        </div>
        <p className="text-lg font-semibold text-gray-700">Fitur ini sedang dalam pengembangan</p>
        <p className="mt-2 max-w-md text-center text-sm text-gray-400">
          Insights akan memberikan rekomendasi AI berdasarkan performa konten kamu.
          Analisis mendalam tentang waktu posting terbaik, tipe konten paling efektif,
          dan saran topik yang sedang trending.
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-4 py-1.5 text-xs font-semibold text-amber-700">
          <Zap className="h-3.5 w-3.5" />
          Segera Hadir
        </span>
      </div>
    </section>
  )
}
