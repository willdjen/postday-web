import LoginForm from '@/components/auth/LoginForm'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        <div className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-500">POSTDAY</p>
          <h2 className="mt-2 text-2xl font-semibold text-neutral-900">Selamat Datang Kembali</h2>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
