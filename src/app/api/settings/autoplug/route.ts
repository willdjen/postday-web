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

  const autoPlug = await db.autoPlug.findFirst({
    where: { workspaceId: workspace.id },
  })

  if (!autoPlug) {
    return NextResponse.json({
      isEnabled: false,
      comment: '',
      delayAmount: 30,
      delayUnit: 'Menit',
    })
  }

  return NextResponse.json(autoPlug)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    isEnabled?: boolean
    comment?: string
    delayAmount?: number
    delayUnit?: string
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

  const existing = await db.autoPlug.findFirst({
    where: { workspaceId: workspace.id },
  })

  const data = {
    isEnabled: body.isEnabled ?? false,
    comment: body.comment ?? '',
    delayAmount: body.delayAmount ?? 30,
    delayUnit: body.delayUnit ?? 'Menit',
  }

  let result
  if (existing) {
    result = await db.autoPlug.update({
      where: { id: existing.id },
      data,
    })
  } else {
    result = await db.autoPlug.create({
      data: {
        workspaceId: workspace.id,
        triggerKeywords: [],
        ...data,
      },
    })
  }

  return NextResponse.json(result)
}
