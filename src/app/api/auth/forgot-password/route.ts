import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  let body: { email?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 })
  }

  const email = body.email?.trim().toLowerCase()
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Email tidak valid' }, { status: 400 })
  }

  // Phase 2: send real reset email via Resend
  // For now, return success regardless (don't leak user existence)
  return NextResponse.json({
    message: 'Jika email terdaftar, kamu akan menerima link reset password.',
  })
}
