import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { db } from '@/lib/db'
import { startOfMonth } from 'date-fns'

import StatsCards from '@/components/dashboard/StatsCards'
import DailyActions from '@/components/dashboard/DailyActions'
import MiniCalendar from '@/components/dashboard/MiniCalendar'
import RecentPosts from '@/components/dashboard/RecentPosts'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const workspace = await db.workspace.findFirst({
    where: { ownerId: session.user.id },
  })

  if (!workspace) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-sm text-gray-500">Workspace tidak ditemukan. Silakan hubungi admin.</p>
      </div>
    )
  }

  const [recentPosts, postsThisMonth] = await Promise.all([
    db.post.findMany({
      where: { workspaceId: workspace.id },
      orderBy: { createdAt: 'desc' },
      take: 6,
      select: {
        id: true,
        content: true,
        status: true,
        platform: true,
        scheduledAt: true,
        createdAt: true,
      },
    }),
    db.post.count({
      where: {
        workspaceId: workspace.id,
        createdAt: { gte: startOfMonth(new Date()) },
      },
    }),
  ])

  // Serialize dates for client components
  const serializedPosts = recentPosts.map((p) => ({
    ...p,
    scheduledAt: p.scheduledAt?.toISOString() ?? null,
    createdAt: p.createdAt.toISOString(),
  }))

  const firstName = session.user.name?.split(' ')[0] ?? 'Kamu'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          Halo, {firstName} 👋
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Workspace: {workspace.name}
        </p>
      </div>

      <StatsCards postsThisMonth={postsThisMonth} workspaceId={workspace.id} />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <DailyActions />
        <MiniCalendar posts={serializedPosts} />
      </div>

      <RecentPosts posts={serializedPosts} />
    </div>
  )
}