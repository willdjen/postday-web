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

  const kits = await db.brandKit.findMany({
    where: { workspaceId: workspace.id },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(kits)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: {
    profileName?: string
    profileHandle?: string
    primaryColor?: string
    secondaryColor?: string
    accentColor?: string
    primaryFont?: string
    secondaryFont?: string
    logoUrl?: string
  }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 })
  }

  if (!body.profileName || body.profileName.trim().length < 1) {
    return NextResponse.json({ error: 'Nama profil wajib diisi' }, { status: 400 })
  }

  const workspace = await db.workspace.findFirst({
    where: { ownerId: session.user.id },
  })

  if (!workspace) {
    return NextResponse.json({ error: 'Workspace tidak ditemukan' }, { status: 404 })
  }

  const kit = await db.brandKit.create({
    data: {
      workspaceId: workspace.id,
      name: body.profileName.trim(),
      primaryColor: body.primaryColor ?? '#FF5722',
      secondaryColor: body.secondaryColor ?? null,
      accentColor: body.accentColor ?? null,
      fontHeading: body.primaryFont ?? null,
      fontBody: body.secondaryFont ?? null,
      logoUrl: body.logoUrl ?? null,
    },
  })

  return NextResponse.json(kit, { status: 201 })
}
