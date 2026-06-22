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

  const styles = await db.writingStyle.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(styles)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    name?: string
    toneOfVoice?: string[]
    targetAudience?: string[]
    contentType?: string[]
    personas?: string[]
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 })
  }

  if (!body.name || body.name.trim().length < 1) {
    return NextResponse.json({ error: 'Nama gaya penulisan wajib diisi' }, { status: 400 })
  }

  const workspace = await db.workspace.findFirst({
    where: { ownerId: session.user.id },
  })

  if (!workspace) {
    return NextResponse.json({ error: 'Workspace tidak ditemukan' }, { status: 404 })
  }

  const style = await db.writingStyle.create({
    data: {
      workspaceId: workspace.id,
      name: body.name.trim(),
      tone: (body.toneOfVoice ?? []).join(', ') || 'Professional',
      keywords: [],
      toneOfVoice: body.toneOfVoice ?? [],
      targetAudience: body.targetAudience ?? [],
      contentType: body.contentType ?? [],
      personas: body.personas ?? [],
    },
  })

  return NextResponse.json(style, { status: 201 })
}
