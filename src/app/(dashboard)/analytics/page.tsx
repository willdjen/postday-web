import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import AnalyticsDashboard from '@/components/analytics/AnalyticsDashboard'

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const workspace = await db.workspace.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  })

  if (!workspace) redirect('/login')

  const analytics = await db.analytics.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { capturedAt: 'desc' },
    take: 30,
    select: {
      impressions: true,
      likes: true,
      comments: true,
      shares: true,
      reach: true,
      engagementRate: true,
      capturedAt: true,
    },
  })

  // Serialize dates
  const serialized = analytics.map(a => ({
    ...a,
    capturedAt: a.capturedAt.toISOString(),
  }))

  return (
    <section>
      <AnalyticsDashboard analytics={serialized} />
    </section>
  )
}
