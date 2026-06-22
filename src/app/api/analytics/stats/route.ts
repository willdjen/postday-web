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

  // Fetch latest analytics records
  const analytics = await db.analytics.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { capturedAt: 'desc' },
    take: 30,
  })

  if (analytics.length === 0) {
    return NextResponse.json({
      totalFollowers: 0,
      followersGained: 0,
      engagementRate: 0,
      ctr: 0,
      totalImpressions: 0,
      totalReactions: 0,
      totalComments: 0,
      totalShares: 0,
    })
  }

  const totalImpressions = analytics.reduce((s, a) => s + a.impressions, 0)
  const totalReactions = analytics.reduce((s, a) => s + a.likes, 0)
  const totalComments = analytics.reduce((s, a) => s + a.comments, 0)
  const totalShares = analytics.reduce((s, a) => s + a.shares, 0)
  const avgEngagementRate = analytics.reduce((s, a) => s + a.engagementRate, 0) / analytics.length

  return NextResponse.json({
    totalFollowers: analytics[0]?.reach ?? 0,
    followersGained: analytics.length > 1 ? (analytics[0]?.reach ?? 0) - (analytics[analytics.length - 1]?.reach ?? 0) : 0,
    engagementRate: Math.round(avgEngagementRate * 100) / 100,
    ctr: totalImpressions > 0 ? Math.round((totalReactions / totalImpressions) * 10000) / 100 : 0,
    totalImpressions,
    totalReactions,
    totalComments,
    totalShares,
  })
}
