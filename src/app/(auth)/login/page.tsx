import LoginForm from '@/components/auth/LoginForm'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-neutral-100 px-4 py-10">
      <div className="w-full max-w-md space-y-5">
        <div className="flex flex-col items-center text-center">
          <Image src="/postday-typography.png" alt="Postday" width={180} height={40} className="h-8 sm:h-10 md:h-12 w-auto object-contain transition-all" />
          <h2 className="mt-6 text-2xl font-semibold text-neutral-900">Selamat Datang Kembali</h2>
        </div>
        <LoginForm />
      </div>
    </main>
  )
}
