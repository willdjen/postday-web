import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import MediaLibraryView from '@/components/media-library/MediaLibraryView'

export default async function MediaLibraryPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const workspace = await db.workspace.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  })

  if (!workspace) redirect('/login')

  return (
    <section>
      <MediaLibraryView workspaceId={workspace.id} />
    </section>
  )
}
