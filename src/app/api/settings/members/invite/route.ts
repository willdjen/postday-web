import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

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

  const workspace = await db.workspace.findFirst({
    where: { ownerId: session.user.id },
  })

  if (!workspace) {
    return NextResponse.json({ error: 'Workspace tidak ditemukan' }, { status: 404 })
  }

  // Find or create user by email
  let user = await db.user.findUnique({ where: { email } })

  if (!user) {
    user = await db.user.create({
      data: { email, name: email.split('@')[0] },
    })
  }

  // Check if already a member
  const existing = await db.workspaceMember.findUnique({
    where: {
      workspaceId_userId: {
        workspaceId: workspace.id,
        userId: user.id,
      },
    },
  })

  if (existing) {
    return NextResponse.json({ error: 'Pengguna sudah menjadi anggota workspace ini' }, { status: 409 })
  }

  const member = await db.workspaceMember.create({
    data: {
      workspaceId: workspace.id,
      userId: user.id,
      role: 'MEMBER',
      status: 'PENDING',
    },
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true },
      },
    },
  })

  return NextResponse.json(member, { status: 201 })
}
