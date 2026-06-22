import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { content?: string; hashtags?: string[]; scheduledAt?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 })
  }

  if (!body.content || body.content.trim().length < 1) {
    return NextResponse.json({ error: 'Konten wajib diisi' }, { status: 400 })
  }

  if (!body.scheduledAt) {
    return NextResponse.json({ error: 'Waktu jadwal wajib diisi' }, { status: 400 })
  }

  const scheduledDate = new Date(body.scheduledAt)
  if (isNaN(scheduledDate.getTime())) {
    return NextResponse.json({ error: 'Format tanggal tidak valid' }, { status: 400 })
  }

  const workspace = await db.workspace.findFirst({
    where: { ownerId: session.user.id },
  })

  if (!workspace) {
    return NextResponse.json({ error: 'Workspace tidak ditemukan' }, { status: 404 })
  }

  const hashtagStr = (body.hashtags ?? []).map(h => `#${h}`).join(' ')
  const fullContent = body.content.trim() + (hashtagStr ? '\n\n' + hashtagStr : '')

  const post = await db.post.create({
    data: {
      workspaceId: workspace.id,
      authorId: session.user.id,
      content: fullContent,
      platform: 'LINKEDIN',
      type: 'TEXT',
      status: 'SCHEDULED',
      scheduledAt: scheduledDate,
      isAIGenerated: true,
    },
  })

  return NextResponse.json({ success: true, postId: post.id }, { status: 201 })
}
