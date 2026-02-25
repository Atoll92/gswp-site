'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams, useRouter, usePathname } from 'next/navigation'
import styles from './Header.module.css'
import type { ViewMode } from '@/lib/types'

const views: { key: ViewMode; label: string }[] = [
  { key: 'aleatoire', label: 'Aléatoire' },
  { key: 'chronologique', label: 'Chronologique' },
  { key: 'projets', label: 'Projets' },
]

function HeaderNav() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const isHome = pathname === '/'
  const currentView = (searchParams.get('view') as ViewMode) || 'aleatoire'

  function handleViewChange(view: ViewMode) {
    router.push(`/?view=${view}`, { scroll: false })
  }

  if (!isHome) return null

  return (
    <nav className={styles.nav}>
      {views.map((v) => (
        <button
          key={v.key}
          className={`${styles.navLink} ${currentView === v.key ? styles.navLinkActive : ''}`}
          onClick={() => handleViewChange(v.key)}
        >
          {v.label}
        </button>
      ))}
    </nav>
  )
}

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.firmName}>
        <Link href="/">Georgi Stanishev & William Parlon</Link>
      </div>
      <Suspense>
        <HeaderNav />
      </Suspense>
    </header>
  )
}
