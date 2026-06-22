import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import CalendarView from '@/components/calendar/CalendarView'

export default async function CalendarPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const workspace = await db.workspace.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  })

  if (!workspace) redirect('/login')

  const posts = await db.post.findMany({
    where: {
      workspaceId: workspace.id,
      scheduledAt: { not: null },
    },
    select: {
      id: true,
      title: true,
      content: true,
      status: true,
      scheduledAt: true,
      platform: true,
    },
    orderBy: { scheduledAt: 'asc' },
  })

  // Serialize dates
  const serialized = posts.map(p => ({
    ...p,
    scheduledAt: p.scheduledAt?.toISOString() ?? null,
  }))

  return (
    <section>
      <CalendarView posts={serialized} workspaceId={workspace.id} />
    </section>
  )
}
