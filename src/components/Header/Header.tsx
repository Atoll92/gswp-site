'use client'

import { Suspense, useState, useEffect } from 'react'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import styles from './Header.module.css'
import InfoPanel from '../InfoPanel/InfoPanel'
import type { SiteSettings } from '@/lib/types'

const MENU_ITEMS = [
  { key: 'home', label: 'Home' },
  { key: 'theaters', label: 'Theaters' },
  { key: 'architectures', label: 'Architectures' },
  { key: 'expos', label: 'Expos' },
  { key: 'shows', label: 'Shows' },
  { key: 'timeline', label: 'Timeline' },
]

function HeaderNav({ onNavClick, onOpenInfo }: { onNavClick?: () => void; onOpenInfo?: () => void }) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isHome = pathname === '/'
  const currentView = searchParams.get('view') || 'home'

  if (!isHome) return null

  function handleViewChange(key: string) {
    onNavClick?.()
    if (key === 'home') {
      router.push('/', { scroll: false })
    } else {
      router.push(`/?view=${key}`, { scroll: false })
    }
  }

  return (
    <nav className={styles.nav}>
      <button
        className={styles.mobileInfoLink}
        onClick={() => {
          onNavClick?.()
          onOpenInfo?.()
        }}
      >
        George · William
      </button>
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
  infoPanelOpen?: boolean
  onInfoPanelChange?: (open: boolean) => void
}

export default function Header({ bio, settings, infoPanelOpen: controlledOpen, onInfoPanelChange }: HeaderProps) {
  const [internalOpen, setInternalOpen] = useState(false)

  // Support both controlled (from parent) and uncontrolled (standalone) modes
  const infoPanelOpen = controlledOpen ?? internalOpen
  const setInfoPanelOpen = onInfoPanelChange ?? setInternalOpen
  const [menuOpen, setMenuOpen] = useState(false)
  const pathname = usePathname()
  const isHome = pathname === '/'

  // Close menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header className={`${styles.header} ${menuOpen ? styles.menuOpen : ''}`}>
        <button
          className={styles.firmName}
          onClick={() => setInfoPanelOpen(!infoPanelOpen)}
        >
          George · William
        </button>
        {isHome && (
          <button
            className={styles.burger}
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerLineOpen : ''}`} />
            <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerLineOpen : ''}`} />
            <span className={`${styles.burgerLine} ${menuOpen ? styles.burgerLineOpen : ''}`} />
          </button>
        )}
        <Suspense>
          <HeaderNav onNavClick={() => setMenuOpen(false)} onOpenInfo={() => setInfoPanelOpen(true)} />
        </Suspense>
      </header>
      {menuOpen && (
        <div className={styles.menuOverlay} onClick={() => setMenuOpen(false)} />
      )}
      <InfoPanel
        isOpen={infoPanelOpen}
        onClose={() => setInfoPanelOpen(false)}
        bio={bio || null}
        settings={settings || null}
      />
    </>
  )
}
