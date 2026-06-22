import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(req: NextRequest) {
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

  const searchParams = req.nextUrl.searchParams
  const type = searchParams.get('type')
  const tab = searchParams.get('tab') ?? 'all'

  // Build where clause
  const where: Record<string, unknown> = { workspaceId: workspace.id }

  if (type && type !== 'all') {
    where.type = type
  }

  if (tab === 'scheduled') {
    where.post = { status: 'SCHEDULED' }
  } else if (tab === 'published') {
    where.post = { status: 'PUBLISHED' }
  }

  const assets = await db.mediaAsset.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 50,
    select: {
      id: true,
      type: true,
      url: true,
      publicId: true,
      mimeType: true,
      sizeInBytes: true,
      width: true,
      height: true,
      createdAt: true,
    },
  })

  return NextResponse.json(assets)
}
