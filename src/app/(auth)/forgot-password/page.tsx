'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setSent(true)
      } else {
        const data = await res.json()
        setError(data.error || 'Terjadi kesalahan')
      }
    } catch {
      setError('Gagal menghubungi server')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">POSTDAY</p>
          <h2 className="mt-2 text-2xl font-semibold text-neutral-900">Lupa Password?</h2>
          <p className="mt-1 text-sm text-neutral-500">
            Masukkan email kamu dan kami akan mengirimkan link untuk reset password.
          </p>
        </div>

        <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-green-50">
                <Mail className="h-7 w-7 text-green-500" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">Email Terkirim!</p>
                <p className="mt-1 text-sm text-gray-500">
                  Jika email terdaftar, kamu akan menerima link reset password di <strong>{email}</strong>.
                </p>
              </div>
              <Link href="/login"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700">
                <ArrowLeft className="h-4 w-4" />Kembali ke Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label htmlFor="fp-email" className="text-sm font-medium text-neutral-700">Email</label>
                <input
                  id="fp-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm outline-none ring-orange-500/20 focus:border-orange-400 focus:ring-2"
                  placeholder="nama@contoh.com"
                  required
                />
              </div>

              {error && <p className="text-sm text-red-600">{error}</p>}

              <button
                type="submit"
                disabled={loading}
                className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#FF5722] to-[#FF9800] text-sm font-semibold text-white disabled:opacity-70"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {loading ? 'Mengirim...' : 'KIRIM LINK RESET'}
              </button>

              <div className="text-center">
                <Link href="/login"
                  className="inline-flex items-center gap-1 text-sm font-medium text-orange-600 hover:text-orange-700">
                  <ArrowLeft className="h-3.5 w-3.5" />Kembali ke Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  )
}
