'use client'

import { useRef, useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import AleatoireView from './AleatoireView/AleatoireView'
import ChronologiqueView from './ChronologiqueView/ChronologiqueView'
import ProjetsView from './ProjetsView/ProjetsView'
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
  const initialCategorySlug = isCategory ? CATEGORY_SLUG_MAP[view] : undefined

  const footerRef = useRef<HTMLElement>(null)
  const [footerHeight, setFooterHeight] = useState(0)

  useEffect(() => {
    const el = footerRef.current
    if (!el) return
    const measure = () => setFooterHeight(el.getBoundingClientRect().height)
    measure()
    const observer = new ResizeObserver(() => measure())
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <>
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          background: 'var(--color-bg)',
          marginBottom: footerHeight,
        }}
      >
        <Header bio={aboutBio} settings={settings} />
        <main>
          <AnimatePresence mode="wait">
            {view === 'home' && (
              <AleatoireView
                key="home"
                projects={projects}
              />
            )}
            {isCategory && (
              <ProjetsView
                key="categories"
                projects={projects}
                categories={categories}
                initialCategorySlug={initialCategorySlug}
              />
            )}
            {view === 'chronologique' && (
              <ChronologiqueView key="chronologique" projects={projects} />
            )}
          </AnimatePresence>
        </main>
      </div>
      <Footer ref={footerRef} settings={settings} />
    </>
  )
}
