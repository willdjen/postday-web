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

  const settings = await db.aISettings.upsert({
    where: { workspaceId: workspace.id },
    create: { workspaceId: workspace.id },
    update: {},
  })

  return NextResponse.json(settings)
}

export async function PUT(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    autoPostEnabled?: boolean
    profileDescription?: string
    topics?: string[]
    defaultLanguage?: string
    defaultTone?: string
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

  const updated = await db.aISettings.upsert({
    where: { workspaceId: workspace.id },
    create: {
      workspaceId: workspace.id,
      autoPostEnabled: body.autoPostEnabled ?? false,
      profileDescription: body.profileDescription ?? null,
      topics: body.topics ?? [],
      defaultLanguage: body.defaultLanguage ?? 'id',
      defaultTone: body.defaultTone ?? 'profesional',
    },
    update: {
      ...(body.autoPostEnabled !== undefined && { autoPostEnabled: body.autoPostEnabled }),
      ...(body.profileDescription !== undefined && { profileDescription: body.profileDescription }),
      ...(body.topics !== undefined && { topics: body.topics }),
      ...(body.defaultLanguage !== undefined && { defaultLanguage: body.defaultLanguage }),
      ...(body.defaultTone !== undefined && { defaultTone: body.defaultTone }),
    },
  })

  return NextResponse.json(updated)
}
