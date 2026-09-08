import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

const BASE_URL = process.env.NEXTAUTH_URL!

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state') // userId passed as CSRF state
  const errorParam = searchParams.get('error')

  if (errorParam || !code || !state) {
    return NextResponse.redirect(new URL('/settings?tab=linkedin&error=linkedin_denied', BASE_URL))
  }

  try {
    // 1. Exchange code for access token
    const tokenRes = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: `${BASE_URL}/api/social/linkedin/callback`,
        client_id: process.env.LINKEDIN_CLIENT_ID!,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET!,
      }),
    })

    if (!tokenRes.ok) {
      console.error('LinkedIn token exchange failed:', await tokenRes.text())
      return NextResponse.redirect(new URL('/settings?tab=linkedin&error=token_exchange_failed', BASE_URL))
    }

    const tokens = await tokenRes.json() as {
      access_token: string
      expires_in: number
      refresh_token?: string
    }

    // 2. Fetch LinkedIn profile using OpenID userinfo endpoint
    const profileRes = await fetch('https://api.linkedin.com/v2/userinfo', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    })

    if (!profileRes.ok) {
      console.error('LinkedIn profile fetch failed:', await profileRes.text())
      return NextResponse.redirect(new URL('/settings?tab=linkedin&error=profile_fetch_failed', BASE_URL))
    }

    const profile = await profileRes.json() as {
      sub: string
      name: string
      email: string
      picture?: string
    }

    // 3. Find workspace for this user
    const workspace = await db.workspace.findFirst({
      where: { ownerId: state },
      select: { id: true },
    })

    if (!workspace) {
      return NextResponse.redirect(new URL('/settings?tab=linkedin&error=no_workspace', BASE_URL))
    }

    // 4. Upsert SocialAccount — schema uses accountId (not platformUserId)
    await db.socialAccount.upsert({
      where: {
        workspaceId_platform_accountId: {
          workspaceId: workspace.id,
          platform: 'LINKEDIN',
          accountId: profile.sub,
        },
      },
      create: {
        workspaceId: workspace.id,
        platform: 'LINKEDIN',
        accountId: profile.sub,
        accountName: profile.name,
        accountHandle: profile.email,
        profileImageUrl: profile.picture ?? null,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? null,
        tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        isActive: true,
      },
      update: {
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token ?? null,
        tokenExpiresAt: new Date(Date.now() + tokens.expires_in * 1000),
        accountName: profile.name,
        accountHandle: profile.email,
        profileImageUrl: profile.picture ?? null,
        isActive: true,
      },
    })

    return NextResponse.redirect(new URL('/settings?tab=linkedin&success=connected', BASE_URL))
  } catch (err) {
    console.error('LinkedIn callback error:', err)
    return NextResponse.redirect(new URL('/settings?tab=linkedin&error=server_error', BASE_URL))
  }
}
