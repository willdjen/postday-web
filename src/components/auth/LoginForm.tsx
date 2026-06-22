'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { Loader2 } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

type LoginValues = z.infer<typeof loginSchema>

export default function LoginForm() {
  const router = useRouter()
  const [authError, setAuthError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<LoginValues>({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (values: LoginValues) => {
    setAuthError('')
    const parsed = loginSchema.safeParse(values)

    if (!parsed.success) {
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0]
        if (field === 'email' || field === 'password') {
          setError(field, { type: 'manual', message: issue.message })
        }
      })
      return
    }

    const result = await signIn('credentials', {
      email: parsed.data.email,
      password: parsed.data.password,
      redirect: false,
    })

    if (result?.error) {
      setAuthError('Email atau password salah. Silakan coba lagi.')
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="w-full max-w-md rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
      <h1 className="text-2xl font-semibold text-neutral-900">Masuk</h1>
      <p className="mt-1 text-sm text-neutral-600">Masuk ke akun Postday Anda.</p>

      <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="space-y-1">
          <label htmlFor="email" className="text-sm font-medium text-neutral-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
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
            autoComplete="current-password"
            className="h-11 w-full rounded-xl border border-neutral-300 px-3 text-sm outline-none ring-orange-500/20 focus:border-orange-400 focus:ring-2"
            placeholder="Masukkan password"
            {...register('password')}
          />
          {errors.password ? <p className="text-xs text-red-600">{errors.password.message}</p> : null}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xs text-neutral-500">Gunakan minimal 8 karakter</span>
          <Link href="/forgot-password" className="text-xs font-medium text-orange-600 hover:text-orange-700">
            Lupa password?
          </Link>
        </div>

        {authError ? <p className="text-sm text-red-600">{authError}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-brand-gradient text-sm font-semibold text-white disabled:opacity-70"
        >
          {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isSubmitting ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <div className="my-5 h-px bg-neutral-200" />

      <button
        type="button"
        onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
        className="h-11 w-full rounded-xl border border-neutral-300 bg-white text-sm font-medium text-neutral-700 hover:bg-neutral-50"
      >
        Masuk dengan Google
      </button>

      <p className="mt-4 text-center text-sm text-neutral-600">
        Belum punya akun?{' '}
        <Link href="/register" className="font-semibold text-orange-600 hover:text-orange-700">
          Daftar
        </Link>
      </p>
    </div>
  )
}
