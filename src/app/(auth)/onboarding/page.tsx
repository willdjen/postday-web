'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Loader2, Users, User } from 'lucide-react'
import { cn } from '@/lib/utils'

type JobTitle = 'Manajer Media Sosial' | 'Kreator Konten' | 'Pemilik Bisnis' | 'Pemasar Digital' | 'Freelancer' | 'Lainnya'

const ROLES = [
  { key: 'agency', label: 'Ghostwriter/Pemilik Agensi', desc: 'Kelola konten untuk klien', icon: Users },
  { key: 'creator', label: 'Kreator Individu', desc: 'Buat konten untuk diri sendiri', icon: User },
] as const

const JOB_TITLES: JobTitle[] = ['Manajer Media Sosial', 'Kreator Konten', 'Pemilik Bisnis', 'Pemasar Digital', 'Freelancer', 'Lainnya']

const SOURCES = ['Friend/co-worker', 'Pencarian Web', 'LinkedIn', 'Twitter', 'Instagram', 'Youtube', 'Lainnya']

export default function OnboardingPage() {
  const router = useRouter()
  const [role, setRole] = useState('')
  const [jobTitle, setJobTitle] = useState<JobTitle | ''>('')
  const [hearAboutUs, setHearAboutUs] = useState<string[]>([])
  const [linkedinUrl, setLinkedinUrl] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const toggleSource = (value: string) => {
    setHearAboutUs(c => c.includes(value) ? c.filter(i => i !== value) : [...c, value])
  }

  const handleFinish = async () => {
    setError('')
    setIsSubmitting(true)

    const response = await fetch('/api/auth/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ role, jobTitle, hearAboutUs, linkedinUrl }),
    })

    setIsSubmitting(false)

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null
      setError(data?.error ?? 'Gagal menyimpan onboarding.')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-10">
      <div className="w-full max-w-2xl space-y-6">
        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF9800]" />
          <div className="h-0.5 w-8 bg-gradient-to-r from-[#FF5722] to-[#FF9800] rounded-full" />
          <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-r from-[#FF5722] to-[#FF9800] ring-4 ring-orange-100" />
        </div>

        <div className="rounded-2xl border border-neutral-200 bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-neutral-900">
            Ceritakan sedikit lebih banyak tentang kamu.
          </h1>
          <p className="mt-2 text-sm text-neutral-500">
            Ini membantu kami mempersonalisasi pengalaman kamu.
          </p>

          <div className="mt-8 space-y-6">
            {/* Role selection */}
            <div>
              <p className="mb-3 text-sm font-medium text-neutral-700">Pilih tipe akun kamu</p>
              <div className="grid gap-3 md:grid-cols-2">
                {ROLES.map(item => {
                  const selected = role === item.key
                  return (
                    <button key={item.key} type="button" onClick={() => setRole(item.key)}
                      className={cn(
                        'flex items-center gap-4 rounded-xl border-2 px-5 py-4 text-left transition-all',
                        selected
                          ? 'border-[#FF5722] bg-orange-50 shadow-sm shadow-orange-100'
                          : 'border-neutral-200 hover:border-neutral-300'
                      )}>
                      <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl',
                        selected ? 'bg-gradient-to-br from-[#FF5722] to-[#FF9800] text-white' : 'bg-gray-100 text-gray-500')}>
                        <item.icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className={cn('text-sm font-semibold', selected ? 'text-[#FF5722]' : 'text-neutral-900')}>{item.label}</p>
                        <p className="text-xs text-neutral-500">{item.desc}</p>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Job title */}
            <div>
              <label htmlFor="jobTitle" className="mb-2 block text-sm font-medium text-neutral-700">
                Apa yang paling menggambarkan peranmu?
              </label>
              <select id="jobTitle" value={jobTitle}
                onChange={e => setJobTitle(e.target.value as JobTitle)}
                className="h-11 w-full rounded-xl border border-neutral-300 bg-white px-3 text-sm text-neutral-800 outline-none ring-orange-500/20 focus:border-orange-400 focus:ring-2">
                <option value="">Pilih peran</option>
                {JOB_TITLES.map(item => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>

            {/* Source chips */}
            <div>
              <p className="mb-3 text-sm font-medium text-neutral-700">Dari mana kamu mendengar tentang kami?</p>
              <div className="flex flex-wrap gap-2">
                {SOURCES.map(item => {
                  const active = hearAboutUs.includes(item)
                  return (
                    <button key={item} type="button" onClick={() => toggleSource(item)}
                      className={cn(
                        'rounded-full border px-4 py-2 text-xs font-medium transition-all',
                        active
                          ? 'border-transparent bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-white shadow-sm'
                          : 'border-neutral-300 text-neutral-600 hover:border-neutral-400'
                      )}>
                      {item}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* LinkedIn URL */}
            <div>
              <label htmlFor="linkedinUrl" className="mb-2 block text-sm font-medium text-neutral-700">
                Bagikan URL profil LinkedIn kamu (opsional)
              </label>
              <input id="linkedinUrl" value={linkedinUrl}
                onChange={e => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm outline-none ring-orange-500/20 focus:border-orange-400 focus:ring-2" />
            </div>
          </div>

          {error ? <p className="mt-4 text-sm text-red-600">{error}</p> : null}

          <button type="button" onClick={handleFinish} disabled={isSubmitting}
            className="mt-8 inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-sm font-semibold text-white shadow-md shadow-orange-200 hover:shadow-lg disabled:opacity-70 transition-all">
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {isSubmitting ? 'Menyimpan...' : 'SELESAI'}
          </button>
        </div>
      </div>
    </main>
  )
}
