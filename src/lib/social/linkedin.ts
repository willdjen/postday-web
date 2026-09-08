export async function publishToLinkedIn({
  accessToken,
  platformUserId,
  content,
  mediaUrls = [],
}: {
  accessToken: string
  platformUserId: string
  content: string
  mediaUrls?: string[]
}): Promise<{ platformPostId: string }> {
  const body = {
    author: `urn:li:person:${platformUserId}`,
    lifecycleState: 'PUBLISHED',
    specificContent: {
      'com.linkedin.ugc.ShareContent': {
        shareCommentary: { text: content },
        shareMediaCategory: mediaUrls.length > 0 ? 'IMAGE' : 'NONE',
      },
    },
    visibility: {
      'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC',
    },
  }

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0',
    },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(`LinkedIn publish failed: ${JSON.stringify(error)}`)
  }

  const data = await res.json() as { id: string }
  return { platformPostId: data.id }
}
