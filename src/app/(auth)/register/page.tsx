'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const registerSchema = z
  .object({
    name: z.string().min(2, 'Nama minimal 2 karakter'),
    email: z.string().email('Format email tidak valid'),
    password: z.string().min(8, 'Password minimal 8 karakter'),
    confirmPassword: z.string().min(8, 'Konfirmasi password minimal 8 karakter'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Konfirmasi password tidak cocok',
  })

type RegisterValues = z.infer<typeof registerSchema>

function RegisterForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<RegisterValues>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  const onSubmit = async (values: RegisterValues) => {
    setServerError('')
    const parsed = registerSchema.safeParse(values)

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0]
        if (field === 'name' || field === 'email' || field === 'password' || field === 'confirmPassword') {
          setError(field, { type: 'manual', message: issue.message })
        }
      })
      return
    }

    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password,
      }),
    })

    if (!response.ok) {
      const data = (await response.json().catch(() => null)) as { error?: string } | null
      setServerError(data?.error ?? 'Terjadi kesalahan, silakan coba lagi.')
      return
    }

    const signInResult = await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    })

    if (signInResult?.error) {
      setServerError('Akun berhasil dibuat, namun gagal masuk. Silakan login manual.')
      router.push('/login')
      return
    }

    router.push('/onboarding')
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-neutral-900">Daftar</h1>
      <p className="mt-1 text-sm text-neutral-600">Buat akun baru untuk mulai menggunakan Postday.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label htmlFor="name" className="text-sm font-medium text-neutral-700">
            Nama lengkap
          </label>
          <input
            id="name"
            className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm outline-none ring-orange-500/20 focus:border-orange-400 focus:ring-2"
            placeholder="Nama lengkap Anda"
            {...register('name')}
          />
          {errors.name ? <p className="text-xs text-red-600">{errors.name.message}</p> : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm outline-none ring-orange-500/20 focus:border-orange-400 focus:ring-2"
            placeholder="nama@contoh.com"
            {...register('email')}
          />
          {errors.email ? <p className="text-xs text-red-600">{errors.email.message}</p> : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="password" className="text-sm font-medium text-neutral-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm outline-none ring-orange-500/20 focus:border-orange-400 focus:ring-2"
            placeholder="Minimal 8 karakter"
            {...register('password')}
          />
          {errors.password ? <p className="text-xs text-red-600">{errors.password.message}</p> : null}
        </div>

        <div className="space-y-1">
          <label htmlFor="confirmPassword" className="text-sm font-medium text-neutral-700">
            Konfirmasi password
          </label>
          <input
            id="confirmPassword"
            type="password"
            className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm outline-none ring-orange-500/20 focus:border-orange-400 focus:ring-2"
            placeholder="Ulangi password"
            {...register('confirmPassword')}
          />
          {errors.confirmPassword ? <p className="text-xs text-red-600">{errors.confirmPassword.message}</p> : null}
        </div>

        {serverError ? <p className="text-sm text-red-600">{serverError}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient text-sm font-semibold text-white disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? 'Memproses...' : 'Daftar'}
        </button>
      </form>

      <div className="my-5 h-px bg-neutral-200" />

      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl: '/onboarding' })}
        className="h-11 w-full rounded-xl border border-neutral-300 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
      >
        Daftar dengan Google
      </button>

      <p className="mt-4 text-center text-sm text-neutral-600">
        Sudah punya akun?{' '}
        <Link href="/login" className="font-semibold text-orange-600 hover:text-orange-700">
          Masuk
        </Link>
      </p>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        <div className="flex flex-col items-center text-center">
          <Image src="/postday-typography.png" alt="Postday" width={180} height={40} className="h-8 sm:h-10 md:h-12 w-auto object-contain transition-all" />
          <h2 className="mt-6 text-2xl font-semibold text-neutral-900">Buat Akun Baru</h2>
        </div>
        <RegisterForm />
      </div>
    </main>
  )
}
