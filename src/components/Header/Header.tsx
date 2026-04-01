'use client'

import { Suspense, useState } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import styles from './Header.module.css'
import InfoPanel from '../InfoPanel/InfoPanel'
import type { SiteSettings } from '@/lib/types'

const MENU_ITEMS = [
  { key: 'home', label: 'Home' },
  { key: 'chronologique', label: 'Chronological' },
  { key: 'temporary-theatres', label: 'Temporary Theatres' },
  { key: 'interiors', label: 'Interiors' },
  { key: 'exhibitions', label: 'Exhibitions' },
  { key: 'fashion-shows', label: 'Fashion Shows' },
  { key: 'celebrations', label: 'Celebrations' },
  { key: 'theatre-scenography', label: 'Theatre Scenography' },
]

function HeaderNav() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isHome = pathname === '/'
  const currentView = searchParams.get('view') || 'home'

  if (!isHome) return null

  function handleViewChange(key: string) {
    if (key === 'home') {
      router.push('/', { scroll: false })
    } else {
      router.push(`/?view=${key}`, { scroll: false })
    }
  }

  return (
    <nav className={styles.nav}>
      {MENU_ITEMS.map((item, i) => (
        <span key={item.key} className={styles.navItemWrap}>
          <button
            className={`${styles.navLink} ${currentView === item.key ? styles.navLinkActive : ''}`}
            onClick={() => handleViewChange(item.key)}
          >
            {item.label}
          </button>
          {i < MENU_ITEMS.length - 1 && (
            <span className={styles.navSeparator}>·</span>
          )}
        </span>
      ))}
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
          George · William
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
