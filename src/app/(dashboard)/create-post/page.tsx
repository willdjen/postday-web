import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

import { authOptions } from '@/lib/auth'
import CreatePostTabs from '@/components/create-post/CreatePostTabs'

export default async function CreatePostPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) redirect('/login')

  return <CreatePostTabs />
}
