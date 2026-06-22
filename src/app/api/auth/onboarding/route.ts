import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

const onboardingSchema = z.object({
  role: z.string().optional().nullable(),
  jobTitle: z.string().optional().nullable(),
  hearAboutUs: z.array(z.string()).default([]),
  linkedinUrl: z.string().url().optional().or(z.literal('')).nullable(),
})

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const parsed = onboardingSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Data onboarding tidak valid' }, { status: 400 })
    }

    await db.onboarding.upsert({
      where: { userId: session.user.id },
      update: {
        role: parsed.data.role ?? null,
        jobTitle: parsed.data.jobTitle ?? null,
        hearAboutUs: parsed.data.hearAboutUs,
        linkedinUrl: parsed.data.linkedinUrl || null,
        isComplete: true,
      },
      create: {
        userId: session.user.id,
        role: parsed.data.role ?? null,
        jobTitle: parsed.data.jobTitle ?? null,
        hearAboutUs: parsed.data.hearAboutUs,
        linkedinUrl: parsed.data.linkedinUrl || null,
        isComplete: true,
      },
    })

    return NextResponse.json({ message: 'Onboarding berhasil disimpan' }, { status: 200 })
  } catch {
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
