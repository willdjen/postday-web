import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import BillingView from '@/components/billing/BillingView'

export default async function BillingPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  const workspace = await db.workspace.findFirst({
    where: { ownerId: session.user.id },
    select: { id: true },
  })

  if (!workspace) redirect('/login')

  const subscription = await db.subscription.findUnique({
    where: { workspaceId: workspace.id },
  })

  const serialized = subscription
    ? {
        plan: subscription.plan,
        status: subscription.status,
        currentPeriodStart: subscription.currentPeriodStart.toISOString(),
        currentPeriodEnd: subscription.currentPeriodEnd?.toISOString() ?? null,
      }
    : null

  return (
    <section className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Billing & Langganan</h1>
        <p className="mt-1 text-sm text-gray-500">Kelola paket dan riwayat tagihan kamu</p>
      </div>
      <BillingView subscription={serialized} workspaceId={workspace.id} />
    </section>
  )
}
