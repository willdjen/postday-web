import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import SettingsTabs from '@/components/settings/SettingsTabs'

export default async function SettingsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const workspace = await db.workspace.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true, name: true },
  })

  if (!workspace) redirect('/login')

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Pengaturan</h1>
        <p className="mt-1 text-sm text-gray-500">Ubah preferensi kamu di sini.</p>
      </div>
      <SettingsTabs workspaceId={workspace.id} />
    </section>
  )
}
