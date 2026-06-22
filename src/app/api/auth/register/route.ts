import bcrypt from 'bcryptjs'
import { NextResponse } from 'next/server'
import { z } from 'zod'

import { db } from '@/lib/db'

const registerSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      return NextResponse.json({ error: 'Data pendaftaran tidak valid' }, { status: 400 })
    }

    const { name, email, password } = parsed.data

    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email sudah terdaftar' }, { status: 409 })
    }

    const hashedPassword = await bcrypt.hash(password, 12)

    const result = await db.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
        },
      })

      const workspace = await tx.workspace.create({
        data: {
          name: `${name}'s Workspace`,
          ownerId: user.id,
        },
      })

      await tx.workspaceMember.create({
        data: {
          workspaceId: workspace.id,
          userId: user.id,
          role: 'ADMIN',
          status: 'ACCEPTED',
        },
      })

      await tx.aISettings.create({
        data: {
          workspaceId: workspace.id,
          defaultLanguage: 'id',
          topics: [],
        },
      })

      await tx.subscription.create({
        data: {
          workspaceId: workspace.id,
          plan: 'FREE',
          status: 'ACTIVE',
        },
      })

      return user
    })

    return NextResponse.json({ message: 'Akun berhasil dibuat', userId: result.id }, { status: 201 })
  } catch (error) {
    console.error('Registration error:', error)
    return NextResponse.json({ error: 'Terjadi kesalahan server' }, { status: 500 })
  }
}
