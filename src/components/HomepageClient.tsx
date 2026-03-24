'use client'

import { useMemo } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import AleatoireView from './AleatoireView/AleatoireView'
import ChronologiqueView from './ChronologiqueView/ChronologiqueView'
import type { Project, Category, SiteSettings } from '@/lib/types'

// Category keys matching the flat header menu
const CATEGORY_KEYS = [
  'temporary-theatres',
  'interiors',
  'exhibitions',
  'fashion-shows',
  'celebrations',
  'theatre-scenography',
]

// Map header menu keys to Sanity category slugs
const CATEGORY_SLUG_MAP: Record<string, string> = {
  'temporary-theatres': 'architecture-theatres',
  'interiors': 'architecture-interieurs',
  'exhibitions': 'expositions',
  'fashion-shows': 'defiles',
  'celebrations': 'celebrations',
  'theatre-scenography': 'scenographie-theatre',
}

// Display names for category large titles
const CATEGORY_DISPLAY_NAMES: Record<string, string> = {
  'temporary-theatres': 'Temporary Theatres',
  'interiors': 'Interiors',
  'exhibitions': 'Exhibitions',
  'fashion-shows': 'Fashion Shows',
  'celebrations': 'Celebrations',
  'theatre-scenography': 'Theatre Scenography',
}

interface HomepageClientProps {
  projects: Project[]
  categories: Category[]
  aboutBio?: any[] | null
  settings?: SiteSettings | null
}

export default function HomepageClient({
  projects,
  categories,
  aboutBio,
  settings,
}: HomepageClientProps) {
  const searchParams = useSearchParams()
  const view = searchParams.get('view') || 'home'

  const isCategory = CATEGORY_KEYS.includes(view)

  const filteredProjects = useMemo(() => {
    if (!isCategory) return projects
    const sanitySlug = CATEGORY_SLUG_MAP[view]
    return projects.filter((p) => p.category?.slug?.current === sanitySlug)
  }, [projects, view, isCategory])

  const categoryTitle = isCategory ? CATEGORY_DISPLAY_NAMES[view] : undefined

  return (
    <>
      <Header bio={aboutBio} settings={settings} />
      <main>
        <AnimatePresence mode="wait">
          {(view === 'home' || isCategory) && (
            <AleatoireView
              key={view}
              projects={filteredProjects}
              categoryTitle={categoryTitle}
            />
          )}
          {view === 'chronologique' && (
            <ChronologiqueView key="chronologique" projects={projects} />
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  )
}
