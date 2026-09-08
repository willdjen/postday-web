import { getServerSession } from 'next-auth'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { publishToLinkedIn } from '@/lib/social/linkedin'

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let body: { postId?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body tidak valid' }, { status: 400 })
  }

  if (!body.postId) {
    return NextResponse.json({ error: 'postId wajib diisi' }, { status: 400 })
  }

  // Fetch the post
  const post = await db.post.findUnique({
    where: { id: body.postId },
    select: {
      id: true,
      content: true,
      platform: true,
      status: true,
      workspaceId: true,
    },
  })

  if (!post) {
    return NextResponse.json({ error: 'Post tidak ditemukan' }, { status: 404 })
  }

  // Verify ownership
  const workspace = await db.workspace.findFirst({
    where: { id: post.workspaceId, ownerId: session.user.id },
    select: { id: true },
  })

  if (!workspace) {
    return NextResponse.json({ error: 'Akses ditolak' }, { status: 403 })
  }

  // Get connected social account for this platform
  const socialAccount = await db.socialAccount.findFirst({
    where: {
      workspaceId: post.workspaceId,
      platform: post.platform,
      isActive: true,
    },
    select: {
      accessToken: true,
      accountId: true,
    },
  })

  if (!socialAccount) {
    return NextResponse.json(
      { error: `Tidak ada akun ${post.platform} yang terhubung. Hubungkan akun di Settings terlebih dahulu.` },
      { status: 422 }
    )
  }

  // Mark as IN_PROGRESS (use SCHEDULED as intermediate — no IN_PROGRESS enum)
  await db.post.update({
    where: { id: post.id },
    data: { status: 'SCHEDULED' },
  })

  try {
    let result: { platformPostId: string }

    if (post.platform === 'LINKEDIN') {
      result = await publishToLinkedIn({
        accessToken: socialAccount.accessToken,
        platformUserId: socialAccount.accountId,
        content: post.content,
      })
    } else {
      return NextResponse.json(
        { error: `Platform ${post.platform} belum didukung untuk publish langsung.` },
        { status: 422 }
      )
    }

    // Mark as published
    await db.post.update({
      where: { id: post.id },
      data: {
        status: 'PUBLISHED',
        publishedAt: new Date(),
        platformPostId: result.platformPostId,
        errorMessage: null,
      },
    })

    return NextResponse.json({ success: true, platformPostId: result.platformPostId })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Terjadi kesalahan tidak dikenal'

    // Mark as failed
    await db.post.update({
      where: { id: post.id },
      data: {
        status: 'FAILED',
        errorMessage: message,
      },
    })

    return NextResponse.json({ error: `Gagal publish: ${message}` }, { status: 500 })
  }
}
