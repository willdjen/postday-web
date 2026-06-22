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
    return NextResponse.json([])
  }

  const drafts = await db.draft.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: 'desc' },
    take: 20,
    select: {
      id: true,
      title: true,
      content: true,
      platform: true,
      createdAt: true,
      updatedAt: true,
    },
  })

  return NextResponse.json(drafts)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { content?: string; hashtags?: string[] }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 })
  }

  if (!body.content || body.content.trim().length < 1) {
    return NextResponse.json({ error: 'Konten wajib diisi' }, { status: 400 })
  }

  const workspace = await db.workspace.findFirst({
    where: { ownerId: session.user.id },
  })

  if (!workspace) {
    return NextResponse.json({ error: 'Workspace tidak ditemukan' }, { status: 404 })
  }

  const hashtagStr = (body.hashtags ?? []).map(h => `#${h}`).join(' ')
  const fullContent = body.content.trim() + (hashtagStr ? '\n\n' + hashtagStr : '')

  const draft = await db.draft.create({
    data: {
      workspaceId: workspace.id,
      authorId: session.user.id,
      content: fullContent,
      platform: 'LINKEDIN',
      type: 'TEXT',
    },
  })

  return NextResponse.json({ success: true, draftId: draft.id }, { status: 201 })
}
