import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

const VALID_PLANS = ['STARTER', 'PRO'] as const

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { plan?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 })
  }

  const plan = body.plan as (typeof VALID_PLANS)[number] | undefined
  if (!plan || !VALID_PLANS.includes(plan)) {
    return NextResponse.json({ error: 'Paket tidak valid. Pilih STARTER atau PRO.' }, { status: 400 })
  }

  const workspace = await db.workspace.findFirst({
    where: { ownerId: session.user.id },
  })

  if (!workspace) {
    return NextResponse.json({ error: 'Workspace tidak ditemukan' }, { status: 404 })
  }

  // Phase 2: integrate Midtrans payment gateway here
  // For now: directly update subscription plan
  const subscription = await db.subscription.upsert({
    where: { workspaceId: workspace.id },
    create: {
      workspaceId: workspace.id,
      plan,
      status: 'ACTIVE',
    },
    update: {
      plan,
      status: 'ACTIVE',
      currentPeriodStart: new Date(),
    },
  })

  return NextResponse.json({
    success: true,
    message: 'Paket berhasil diupgrade',
    subscription,
  })
}
