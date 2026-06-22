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
