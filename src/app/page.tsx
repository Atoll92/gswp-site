import { Suspense } from 'react'
import { getProjects, getCategories, getAboutPage, getSiteSettings } from '../../sanity/lib/queries'
import HomepageClient from '@/components/HomepageClient'

export const revalidate = 0

export default async function HomePage() {
  const [projects, categories, about, settings] = await Promise.all([
    getProjects(),
    getCategories(),
    getAboutPage(),
    getSiteSettings(),
  ])

  return (
    <Suspense>
      <HomepageClient
        projects={projects}
        categories={categories}
        aboutBio={about?.bio || null}
        settings={settings}
      />
    </Suspense>
  )
}
