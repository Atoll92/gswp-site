'use client'

import { useSearchParams } from 'next/navigation'
import { AnimatePresence } from 'framer-motion'
import Header from './Header/Header'
import Footer from './Footer/Footer'
import AleatoireView from './AleatoireView/AleatoireView'
import ChronologiqueView from './ChronologiqueView/ChronologiqueView'
import ProjetsView from './ProjetsView/ProjetsView'
import type { Project, Category, ViewMode } from '@/lib/types'

interface HomepageClientProps {
  projects: Project[]
  categories: Category[]
}

export default function HomepageClient({ projects, categories }: HomepageClientProps) {
  const searchParams = useSearchParams()
  const view = (searchParams.get('view') as ViewMode) || 'aleatoire'

  return (
    <>
      <Header />
      <main>
        <AnimatePresence mode="wait">
          {view === 'aleatoire' && (
            <AleatoireView key="aleatoire" projects={projects} />
          )}
          {view === 'chronologique' && (
            <ChronologiqueView key="chronologique" projects={projects} />
          )}
          {view === 'projets' && (
            <ProjetsView key="projets" projects={projects} categories={categories} />
          )}
        </AnimatePresence>
      </main>
      <Footer />
    </>
  )
}
