import { Suspense } from 'react'
import { getProjects, getCategories } from '../../sanity/lib/queries'
import HomepageClient from '@/components/HomepageClient'

export default async function HomePage() {
  const [projects, categories] = await Promise.all([
    getProjects(),
    getCategories(),
  ])

  return (
    <Suspense>
      <HomepageClient projects={projects} categories={categories} />
    </Suspense>
  )
}
