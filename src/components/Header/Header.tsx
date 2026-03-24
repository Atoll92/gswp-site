'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import styles from './Header.module.css'
import InfoPanel from '../InfoPanel/InfoPanel'
import type { SiteSettings } from '@/lib/types'

const PROJECT_CATEGORIES = [
  { key: 'architecture-theatres', label: 'Architecture [Theaters]' },
  { key: 'architecture-interieurs', label: 'Architecture [Interiors]' },
  { key: 'exhibitions', label: 'Exhibitions' },
  { key: 'fashion-shows', label: 'Fashion Shows' },
  { key: 'party', label: 'Party' },
  { key: 'showroom', label: 'Showroom' },
]

function HeaderNav() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()
  const [projectsOpen, setProjectsOpen] = useState(false)

  const isHome = pathname === '/'
  const currentView = searchParams.get('view') || 'home'

  if (!isHome) return null

  function handleViewChange(key: string) {
    if (key === 'home') {
      router.push('/', { scroll: false })
    } else {
      router.push(`/?view=${key}`, { scroll: false })
    }
    setProjectsOpen(false)
  }

  const isCategoryActive = PROJECT_CATEGORIES.some((c) => c.key === currentView)

  return (
    <nav className={styles.nav}>
      <button
        className={`${styles.navLink} ${currentView === 'chronologique' ? styles.navLinkActive : ''}`}
        onClick={() => handleViewChange('chronologique')}
      >
        Chronological
      </button>
      <span className={styles.navSeparator}>&mdash;</span>
      <div className={styles.projectsMenu}>
        <button
          className={`${styles.navLink} ${isCategoryActive || projectsOpen ? styles.navLinkActive : ''}`}
          onClick={() => setProjectsOpen(!projectsOpen)}
        >
          Projects
        </button>
        {projectsOpen && (
          <div className={styles.subMenu}>
            {PROJECT_CATEGORIES.map((cat) => (
              <button
                key={cat.key}
                className={`${styles.subMenuLink} ${currentView === cat.key ? styles.subMenuLinkActive : ''}`}
                onClick={() => handleViewChange(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  )
}

interface HeaderProps {
  bio?: any[] | null
  settings?: SiteSettings | null
}

export default function Header({ bio, settings }: HeaderProps) {
  const [infoPanelOpen, setInfoPanelOpen] = useState(false)

  return (
    <>
      <header className={styles.header}>
        <button
          className={styles.firmName}
          onClick={() => setInfoPanelOpen(!infoPanelOpen)}
        >
          Georgi William
        </button>
        <Suspense>
          <HeaderNav />
        </Suspense>
      </header>
      <InfoPanel
        isOpen={infoPanelOpen}
        onClose={() => setInfoPanelOpen(false)}
        bio={bio || null}
        settings={settings || null}
      />
    </>
  )
}
