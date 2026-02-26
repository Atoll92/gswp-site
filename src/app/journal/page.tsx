import { getJournalPosts } from '../../../sanity/lib/queries'
import JournalClient from './JournalClient'

export const revalidate = 0

export default async function JournalPage() {
  const posts = await getJournalPosts()

  return <JournalClient posts={posts} />
}
