import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

const MAX_SIZE = 50 * 1024 * 1024 // 50MB

const ALLOWED_TYPES: Record<string, string> = {
  'image/jpeg': 'IMAGE',
  'image/png': 'IMAGE',
  'image/gif': 'IMAGE',
  'image/webp': 'IMAGE',
  'image/svg+xml': 'IMAGE',
  'video/mp4': 'VIDEO',
  'video/webm': 'VIDEO',
  'video/quicktime': 'VIDEO',
  'audio/mpeg': 'DOCUMENT',
  'audio/wav': 'DOCUMENT',
  'application/pdf': 'DOCUMENT',
  'application/zip': 'DOCUMENT',
}

export async function POST(req: Request) {
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

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'FormData tidak valid' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'File wajib diunggah' }, { status: 400 })
  }

  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: 'Ukuran file maksimal 50MB' }, { status: 400 })
  }

  const mediaType = ALLOWED_TYPES[file.type]
  if (!mediaType) {
    return NextResponse.json({ error: 'Tipe file tidak didukung' }, { status: 400 })
  }

  // Phase 1: store metadata with placeholder URL (real R2 upload in Phase 2)
  const placeholderUrl = `/uploads/${Date.now()}-${file.name}`

  const asset = await db.mediaAsset.create({
    data: {
      workspaceId: workspace.id,
      type: mediaType as 'IMAGE' | 'VIDEO' | 'DOCUMENT' | 'CAROUSEL',
      url: placeholderUrl,
      mimeType: file.type,
      sizeInBytes: file.size,
      publicId: file.name,
    },
    select: {
      id: true,
      url: true,
      type: true,
      mimeType: true,
      sizeInBytes: true,
      publicId: true,
    },
  })

  return NextResponse.json({
    id: asset.id,
    url: asset.url,
    filename: asset.publicId,
    type: asset.type,
  }, { status: 201 })
}
