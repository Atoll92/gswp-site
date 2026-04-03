import { Suspense } from 'react'
import { getProjects, getCategories, getAboutPage, getSiteSettings, getHomeOrder } from '../../sanity/lib/queries'
import HomepageClient from '@/components/HomepageClient'

export const revalidate = 0

export default async function HomePage() {
  const [projects, categories, about, settings, homeOrder] = await Promise.all([
    getProjects(),
    getCategories(),
    getAboutPage(),
    getSiteSettings(),
    getHomeOrder(),
  ])

  return (
    <Suspense>
      <HomepageClient
        projects={projects}
        categories={categories}
        aboutBio={about?.bio || null}
        settings={settings}
        homeOrder={homeOrder}
      />
    </Suspense>
  )
}
