import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const workspace = await db.workspace.findFirst({
    where: { ownerId: session.user.id },
  })

  if (!workspace) {
    return NextResponse.json({ error: 'Workspace tidak ditemukan' }, { status: 404 })
  }

  const cta = await db.customCTA.findFirst({
    where: { workspaceId: workspace.id },
  })

  if (!cta) {
    return NextResponse.json({
      isEnabled: false,
      finishers: ['Write a comment', 'Follow me', 'Check the Link', 'Check my Featured Section', 'Send me a Dm'],
      label: '',
    })
  }

  return NextResponse.json(cta)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    isEnabled?: boolean
    finishers?: string[]
    label?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 })
  }

  const workspace = await db.workspace.findFirst({
    where: { ownerId: session.user.id },
  })

  if (!workspace) {
    return NextResponse.json({ error: 'Workspace tidak ditemukan' }, { status: 404 })
  }

  const existing = await db.customCTA.findFirst({
    where: { workspaceId: workspace.id },
  })

  const data = {
    isEnabled: body.isEnabled ?? false,
    finishers: body.finishers ?? [],
    label: body.label ?? '',
  }

  let result
  if (existing) {
    result = await db.customCTA.update({
      where: { id: existing.id },
      data,
    })
  } else {
    result = await db.customCTA.create({
      data: {
        workspaceId: workspace.id,
        ...data,
      },
    })
  }

  return NextResponse.json(result)
}
